{*<!--
/*********************************************************************************
  ** The contents of this file are subject to the vtiger CRM Public License Version 1.0
   * ("License"); You may not use this file except in compliance with the License
   * The Original Code is:  vtiger CRM Open Source
   * The Initial Developer of the Original Code is vtiger.
   * Portions created by vtiger are Copyright (C) vtiger.
   * All Rights Reserved.
********************************************************************************/
-->*}
<script type="text/javascript" src="modules/ModComments/ModComments.js"></script>
{include file='SetMenu.tpl'}
<section role="dialog" tabindex="-1" class="slds-fade-in-open slds-modal_large slds-app-launcher" aria-labelledby="header43">
<div class="slds-modal__container slds-p-around_none">
<table align="center" border="0" cellpadding="0" cellspacing="0" width="98%">
<tr>
    <td class="showPanelBg" style="padding: 10px;" valign="top" width="100%">
    <br>

    <div align="center">

        <table class="settingsSelUITopLine" border="0" cellpadding="5" cellspacing="0" width="100%">
        <tr>
            <td rowspan="2" valign="top" width="50">
            <img src="modules/ModComments/ModComments.png" alt="{$MOD.ModComments}" title="{$MOD.ModComments}" border="0" height="48" width="48">
            </td>
            <td class="heading2" valign="bottom">
            <b><a href="index.php?module=Settings&action=index">{$APP.LBL_SETTINGS}</a> &gt; {$MOD.ModComments}</b>
            </td>
        </tr>

        <tr>
            <td class="small" valign="top">{$MOD.LBL_CONFIGURATION_DESCRIPTION}</td>
        </tr>
        </table>

        <table border=0 cellspacing=1 cellpadding=0 width="100%" class="lvtBg">
        <tr>
            <td>
                <table border=0 cellspacing=0 cellpadding=2 width="100%" class="small">
                <tr>
                    <td style="padding-right:20px" nowrap align="right"></td>
                </tr>
                </table>

                <table border=0 cellspacing=0 cellpadding=0 width="95%" class="small">

                <tr><td>
                    <table border=0 cellspacing=0 cellpadding=10 width="100%" class="dvtContentSpace" style='border-bottom: 0'>
                    <tr>
                        <td>
                            <div id="modcommsContents">
                            {include file="modules/ModComments/BasicSettingsContents.tpl"}
                            </div>
                        </td>
                    </tr>
                    </table>
                </td></tr>
                </table>
            </td>
        </tr>
        </table>
        </td>
        </tr>
    </table>
    </td>
    </tr>
    </table>
   </div>
        </td>
    </tr>
</table>
</div>
</section>