<?php
/*+********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ********************************************************************************/
require_once 'include/utils/CommonUtils.php';
global $adb,$log,$current_user;
$cfmid=vtlib_purify($_REQUEST['cfmid']);
$result=$adb->pquery('DELETE FROM vtiger_convertleadmapping WHERE cfmid=?', array($cfmid));
header(sprintf('Location: %s', 'index.php?action=CustomFieldList&module=Settings'));
?>
