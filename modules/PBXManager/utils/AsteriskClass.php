<?php
/*********************************************************************************
** The contents of this file are subject to the vtiger CRM Public License Version 1.0
* ("License"); You may not use this file except in compliance with the License
* The Original Code is:  vtiger CRM Open Source
* The Initial Developer of the Original Code is vtiger.
* Portions created by vtiger are Copyright (C) vtiger.
* All Rights Reserved.
********************************************************************************/
require_once 'include/database/PearDatabase.php';
require_once 'include/logging.php';

class Asterisk {
	public $address;
	public $port;
	public $userName;
	public $password;
	public $sock;
	public $queue;
	public $strData;

	/**
	 * this is the constructor of the class, it initializes the parameters of the class
	 * @param resource $sock - a socket type
	 * @param string $server - the asterisk server address
	 * @param integer $port - the port number where to connect to the asterisk server
	 */
	public function __construct($sock, $server, $port) {
		$this->sock = $sock;
		$this->address = $server;
		$this->port = $port;
		$this->queue = array();
	}

	/**
	 * this function sets the username and password for the asterisk object
	 * @param string $userName - asterisk username
	 * @param string $password - password for the user
	 */
	public function setUserInfo($userName, $password) {
		$this->userName = $userName;
		$this->password = $password;
	}

	/**
	 * this function authenticates the user
	 * @return - true on success else false
	 */
	public function authenticateUser() {
		global $log;
		$request = "Action: Login\r\n".
					'Username: '.$this->userName."\r\n".
					'Secret: '.$this->password.
					"\r\n\r\n";
		if (!fwrite($this->sock, $request)) {
			echo getTranslatedString('ERR_Authenticate', 'PBXManager');
			$log->debug('< Asterisk:authenticateUser: Socket error, cannot send');
			exit(0);
		}
		sleep(1);	//wait for the response to come
		$response = fread($this->sock, 4096);	//read the response

		if (strstr($response, 'Response') && (strstr($response, 'Error') || strstr($response, 'failed'))) {
			print_r($response);
			$log->debug('< Asterisk:authenticateUser: '.$response);
			return false;
		} else {
			return true;
		}
	}

	/**
	 * create a call between from and to
	 * @param string $from - the from number
	 * @param string $to - the to number
	 * this function prepares the parameter $context and calls the createCall() function
	 */
	public function transfer($from, $to) {
		global $log;
		$log->debug("> transfer $from, $to");
		if (empty($from) || empty($to)) {
			echo getTranslatedString('ERR_Numbers', 'PBXManager');
			$log->debug('< transfer: Not sufficient parameters to create the call');
			return false;
		}

		//the caller would always be a SIP phone in our case
		if (!strstr($from, 'SIP')) {
			$from = "SIP/$from";
		}
		$typeCalled = '';
		if (strpos($to, ':')!==false) {
			$arr = explode(':', $to);
			if (is_array($arr)) {
				$typeCalled = $arr[0];
				$to = trim($arr[1]);
			}
		}

		switch ($typeCalled) {
			case 'SIP':
				$context = 'from-internal';
				break;
			case 'PSTN':
				$context = 'from-internal';//'outbound-dialing';
				break;
			default:
				$context = 'from-internal';
		}
		$this->createCall($from, $to, $context);
	}

	/**
	 * creates a call between $from and $to
	 * @param string $from -the number from which to call
	 * @param string $to - the number to which to call
	 * @param string $context - the context of the call (e.g. local-extensions for local calls)
	 */
	public function createCall($from, $to, $context) {
		global $log;
		$arr = explode('/', $from);
		$request = "Action: Originate\r\n".
					"Channel: $from\r\n".
					'Exten: '.preg_replace('~[^0-9]~', '', $to)."\r\n".
					"Context: $context\r\n".
					"Priority: 1\r\n".
					"Callerid: $arr[1]\r\n".
					"Async: yes\r\n\r\n";
		if (!fwrite($this->sock, $request)) {
			echo getTranslatedString('ERR_Numbers', 'PBXManager');
			$log->debug('< createcall: Socket error, cannot send');
			exit(0);
		}
	}

	/**
	 * this is the destructor for the class :: it closes the opened socket
	 */
	public function __destruct() {
		fclose($this->sock);
	}

	/**
	 * this function reads the socket for asterisk events and
	 * creates a queue with the response arrays
	 * @param boolean $echoFlag - if set no echos are performed (added since some ajax requests might use the function)
	 * @return array the event array present in the queue if no array is present it returns a null
	 */
	public function getAsteriskResponse($echoFlag = true) {
		if (count($this->queue) == 0) {
			$this->strData.=fread($this->sock, 4096);

			if ($echoFlag) {
				echo $this->strData;
			}

			$arr = explode("\r\n\r\n", $this->strData);
			$numresp = count($arr)-1;
			for ($i=0; $i < $numresp; $i++) {
				$resp = $arr[$i];
				$lines = explode("\r\n", $resp);
				$obj = array();
				foreach ($lines as $line) {
					list($key, $value) = explode(':', $line);
					$obj[$key] = trim($value);
				}
				$this->queue[] = $obj;
			}
			$this->strData = $arr[$i];
		}
		return array_shift($this->queue);
	}
}
?>
