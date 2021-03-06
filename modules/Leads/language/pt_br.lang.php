<?php
/*+********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 * Contributor(s): Valmir Carlos Trindade/Translate to Brazilian Portuguese| 03/03/2012 |Curitiba/Paraná/Brasil.|www.ttcasolucoes.com.br
 * Contributor(s): Ranieri Slemer/Translate to Brazilian Portuguese| 13/03/2020 |Sao Paulo/SP/Brasil.|www.slemernet.com.br
 ********************************************************************************/

if (isset($_COOKIE['LeadConv']) && $_COOKIE['LeadConv'] == 'true') {
	$toggle_historicos = 'Ver leads não convertidos';
	$toggle_name = 'Leads Convertidos';
} else {
	$toggle_historicos = 'Ver leads convertidos';
	$toggle_name = 'Leads';
}

$mod_strings = array(
'LBL_TGL_HISTORICOS' => $toggle_historicos,
'LBL_MODULE_NAME'=>$toggle_name,
'Leads' => $toggle_name,
'LBL_DIRECT_REPORTS_FORM_NAME'=>'Subordinado direto',
'LBL_MODULE_TITLE'=>'Leads: Principal',
'LBL_SEARCH_FORM_TITLE'=>'Pesquisa lead',
'LBL_LIST_FORM_TITLE'=>'Lista lead',
'LBL_NEW_FORM_TITLE'=>'Novo lead',
'LBL_LEAD_OPP_FORM_TITLE'=>'Oportunidade-Contato:',
'LBL_LEAD'=>'Lead:',
'LBL_ADDRESS_INFORMATION'=>'Dados do endereço',
'LBL_CUSTOM_INFORMATION'=>'Informação customizada',

'LBL_LIST_NAME'=>'Nome',
'LBL_LIST_LAST_NAME'=>'Sobrenome',
'LBL_LIST_COMPANY'=>'Empresa',
'LBL_LIST_WEBSITE'=>'Website',
'LBL_LIST_LEAD_NAME'=>'Nome lead',
'LBL_LIST_EMAIL'=>'E-mail',
'LBL_LIST_PHONE'=>'Telefone',
'LBL_LIST_LEAD_ROLE'=>'Função',

'LBL_NAME'=>'Nome:',
'LBL_LEAD_NAME'=>'Nome Lead:',
'LBL_LEAD_INFORMATION'=>'Informação lead',
'LBL_FIRST_NAME'=>'Nome:',
'LBL_COMPANY'=>'Empresa:',
'LBL_DESIGNATION'=>'Função:',
'LBL_PHONE'=>'Telefone:',
'LBL_LAST_NAME'=>'Sobrenome:',
'LBL_MOBILE'=>'Celular:',
'LBL_EMAIL'=>'E-mail:',
'LBL_LEAD_SOURCE'=>'Fonte lead:',
'LBL_LEAD_STATUS'=>'Estágio lead:',
'LBL_WEBSITE'=>'Website:',
'LBL_FAX'=>'Fax:',
'LBL_INDUSTRY'=>'Atividade:',
'LBL_ANNUAL_REVENUE'=>'Receita anual:',
'LBL_RATING'=>'Avaliação:',
'LBL_LICENSE_KEY'=>'Chave licença:',
'LBL_NO_OF_EMPLOYEES'=>'No. Empregados:',
'LBL_YAHOO_ID'=>'ID Yahoo!:',

'LBL_ADDRESS_STREET'=>'Rua:',
'LBL_ADDRESS_POSTAL_CODE'=>'CEP:',
'LBL_ADDRESS_CITY'=>'Cidade:',
'LBL_ADDRESS_COUNTRY'=>'País:',
'LBL_ADDRESS_STATE'=> 'Estado:',
'LBL_ADDRESS'=>'Endereço:',
'LBL_DESCRIPTION_INFORMATION'=>'Descrição',
'LBL_DESCRIPTION'=>'Descrição:',

'LBL_CONVERT_LEAD'=>'Converter lead:',
'LBL_CONVERT_LEAD_INFORMATION'=>'Converte Informação lead',
'LBL_ACCOUNT_NAME'=>'Nome conta',
'LBL_POTENTIAL_NAME'=>'Nome oportunidade',
'LBL_POTENTIAL_CLOSE_DATE'=>'Data oportunidade fechada',
'LBL_POTENTIAL_AMOUNT'=>'Valor oportunidade',
'LBL_POTENTIAL_SALES_STAGE'=>'Estágio oportunidade de vendas',

'NTC_DELETE_CONFIRMATION'=>'Você tem certeza que deseja deletar este registro?',
'NTC_REMOVE_CONFIRMATION'=>'Você tem certeza que deseja remover este contato deste caso?',
'NTC_REMOVE_DIRECT_REPORT_CONFIRMATION'=>'Você tem certeza que deseja remover este registro de um relatório subordinado?',
'NTC_REMOVE_OPP_CONFIRMATION'=>'Você tem certeza que deseja remover este contato desta oportunidade?',
'ERR_DELETE_RECORD'=>'Defina um número de registro para deletar o contato.',

'LBL_COLON'=>' : ',
'LBL_IMPORT_LEADS'=>'Importar leads',
'LBL_LEADS_FILE_LIST'=>'Lista de arquivos de leads',
'LBL_INSTRUCTIONS'=>'Instruções',
'LBL_KINDLY_PROVIDE_AN_XLS_FILE'=>'Forneça um único arquivo .xls como entrada',
'LBL_PROVIDE_ATLEAST_ONE_FILE'=>'Por favor forneça ao menos um arquivo como entrada',

'LBL_NONE'=>'Nada',
'LBL_ASSIGNED_TO'=>'Responsável:',
'LBL_SELECT_LEAD'=>'Seleciona lead',
'LBL_GENERAL_INFORMATION'=>'Informação geral',
'LBL_DO_NOT_CREATE_NEW_POTENTIAL'=>'Não criar nova oportunidade após conversão',

'LBL_NEW_POTENTIAL'=>'Nova oportunidade',
'LBL_POTENTIAL_TITLE'=>'Oportunidades',

'LBL_NEW_TASK'=>'Nova tarefa',
'LBL_TASK_TITLE'=>'Tarefas',
'LBL_NEW_CALL'=>'Nova chamada',
'LBL_CALL_TITLE'=>'Chamadas',
'LBL_NEW_MEETING'=>'Nova reunião',
'LBL_MEETING_TITLE'=>'Reuniões',
'LBL_NEW_EMAIL'=>'Novo E-mail',
'LBL_EMAIL_TITLE'=>'E-mails',
'LBL_NEW_NOTE'=>'Novo documento',
'LBL_NOTE_TITLE'=>'Documentos',
'LBL_NEW_ATTACHMENT'=>'Novo anexo',
'LBL_ATTACHMENT_TITLE'=>'Anexos',

'LBL_ALL'=>'Todos',
'LBL_CONTACTED'=>'Contactado',
'LBL_LOST'=>'Perdido',
'LBL_HOT'=>'Quente',
'LBL_COLD'=>'Frio',

'LBL_TOOL_FORM_TITLE'=>'Ferramentas lead',

'Salutation'=>'Saudação',
'First Name'=>'Nome',
'Phone'=>'Telefone',
'Last Name'=>'Sobrenome',
'Mobile'=>'Celular',
'Company'=>'Empresa',
'Fax'=>'Fax',
'Email'=>'E-mail',
'Lead Source'=>'Fonte lead',
'Website'=>'Website',
'Annual Revenue'=>'Receita anual',
'Lead Status'=>'Estágio lead',
'Industry'=>'Atividade',
'Rating'=>'Avaliação',
'No Of Employees'=>'No. Empregados',
'Assigned To'=>'Responsável',
'Yahoo Id'=>'ID Yahoo!',
'Created Time'=>'Data & hora criação',
'Modified Time'=>'Data & hora modificação',
'Street'=>'Rua',
'Postal Code'=>'CEP',
'City'=>'Cidade',
'Country'=>'País',
'State'=>'Estado',
'Description'=>'Descrição',
'Po Box'=>'Cx Postal',
'Campaign Source'=>'Origem campanha',
'Name'=>'Nome',
'LBL_NEW_LEADS'=>'Meus novos leads',
'--None--'=>'--Nada--',
'Mr.'=>'Sr.',
'Ms.'=>'Sra.',
'Mrs.'=>'Srta.',
'Dr.'=>'Dr',
'Prof.'=>'Prof.',
'Acquired'=>'Adquirido',
'Active'=>'Ativo',
'Market Failed'=>'Negócio perdido',
'Project Cancelled'=>'Projeto cancelado',
'Shutdown'=>'Fechado',
'Apparel'=>'Vestuário',
'Banking'=>'Bancos',
'Biotechnology'=>'Biotecnologia',
'Chemicals'=>'Química',
'Communications'=>'Comunicações',
'Construction'=>'Construção',
'Consulting'=>'Consultoria',
'Education'=>'Educação',
'Electronics'=>'Eletrônica',
'Energy'=>'Energia',
'Engineering'=>'Engenharia',
'Entertainment'=>'Entretenimento',
'Environmental'=>'Meio ambiente',
'Finance'=>'Finanças',
'Food & Beverage'=>'Alimentos & Bebidas',
'Government'=>'Governo',
'Healthcare'=>'Saúde',
'Hospitality'=>'Hotelaria',
'Insurance'=>'Seguro',
'Machinery'=>'Máquinas',
'Manufacturing'=>'Indústria',
'Media'=>'Mídia',
'Not For Profit'=>'Sem fins lucrativos',
'Recreation'=>'Recreação',
'Retail'=>'Comércio',
'Shipping'=>'Transporte marítimo',
'Technology'=>'Tecnologia',
'Telecommunications'=>'Telecomunicações',
'Transportation'=>'Transportes',
'Utilities'=>'Serviço público',
'Other'=>'Outro',

'Cold Call'=>'Cold Call',
'Existing Customer'=>'Cliente existente',
'Self Generated'=>'Auto gerado',
'Employee'=>'Empregado',
'Partner'=>'Parceiro',
'Public Relations'=>'Relações públicas',
'Direct Mail'=>'Mala direta',
'Conference'=>'Conferência',
'Trade Show'=>'Feira negócios',
'Web Site'=>'Website',
'Word of mouth'=>'Boca-a-boca',

'Attempted to Contact'=>'Tentativa contato',
'Cold'=>'Frio',
'Contact in Future'=>'Contactar no futuro',
'Contacted'=>'Contactado',
'Hot'=>'Quente',
'Junk Lead'=>'Descartado',
'Lost Lead'=>'Perdido',
'Not Contacted'=>'Não contactado',
'Pre Qualified'=>'Pré-qualificado',
'Qualified'=>'Qualificado',
'Warm'=>'Morno',
'Designation'=>'Função',
'Lead No'=>'Cod. lead',
'LBL_TRANSFER_RELATED_RECORDS_TO' => 'Transferir registros relacionados para',
'LBL_FOLLOWING_ARE_POSSIBLE_REASONS' => 'O seguinte pode ser uma das possíveis razões',
'LBL_LEADS_FIELD_MAPPING_INCOMPLETE' => 'Todos os campos obrigatórios não são mapeados',
'LBL_MANDATORY_FIELDS_ARE_EMPTY' => 'Alguns dos valores dos campos obrigatórios estão vazios',
'LBL_LEADS_FIELD_MAPPING' => 'Mapeamento campos personalizados do lead',
'LBL_FIELD_SETTINGS' => 'Configurações do campo',
'Leads ID' => 'ID leads',

'Secondary Email'=>'E-mail alternativo',
'Email Opt Out' => 'Recusa E-mail',
'LeadAlreadyConverted' => 'O LEAD não pode ser convertido. Já foi convertido ou você não possui permissão em um ou mais dos módulos de destino.',
);
?>
