/*+********************************************************************************
 * The contents of this file are subject to the vtiger CRM Public License Version 1.0
 * ("License"); You may not use this file except in compliance with the License
 * The Original Code is:  vtiger CRM Open Source
 * The Initial Developer of the Original Code is vtiger.
 * Portions created by vtiger are Copyright (C) vtiger.
 * All Rights Reserved.
 ********************************************************************************/

function VTEmailTask($) {
	var vtinst = new VtigerWebservices('webservice.php');
	var accessibleModulesInfo = null;
	var cbGroups = null;
	var map = fn.map;
	var dict = fn.dict;
	var filter = fn.filter;
	var reduceR = fn.reduceR;
	var parallelExecuter = fn.parallelExecuter;
	var contains = fn.contains;
	var concat = fn.concat;

	function diff(reflist, list) {
		var out = [];
		$.each(list, function (i, v) {
			if (contains(reflist, v)) {
				out.push(v);
			}
		});
		return out;
	}

	//Display an error message.
	function errorDialog(message) {
		alert(message);
	}

	//This is a wrapper to handle webservice errors.
	function handleError(fn) {
		return function (status, result) {
			if (status) {
				fn(result);
			} else {
				errorDialog('Failure:'+result);
			}
		};
	}

	//Insert text at the cursor
	function insertAtCursor(element, value) {
		//http://alexking.org/blog/2003/06/02/inserting-at-the-cursor-using-javascript
		if (document.selection) {
			element.focus();
			var sel = document.selection.createRange();
			sel.text = value;
			element.focus();
		} else if (element.selectionStart || element.selectionStart == '0') {
			var startPos = element.selectionStart;
			var endPos = element.selectionEnd;
			var scrollTop = element.scrollTop;
			element.value = element.value.substring(0, startPos) + value + element.value.substring(endPos, element.value.length);
			element.focus();
			element.selectionStart = startPos + value.length;
			element.selectionEnd = startPos + value.length;
			element.scrollTop = scrollTop;
		} else {
			element.value += value;
			element.focus();
		}
	}

	//Convert user type into reference for consistency in describe objects
	//This is done inplace
	function referencify(desc) {
		var fields = desc['fields'];
		for (var i=0; i<fields.length; i++) {
			var field = fields[i];
			var type = field['type'];
			if (type['name']=='owner') {
				type['name']='reference';
				type['refersTo']=['Users'];
			}
		}
		return desc;
	}

	//Get an array containing the the description of a module and all modules
	//refered to by it. This is passed to callback.
	function getDescribeObjects(accessibleModules, moduleName, callback) {
		vtinst.describeObject(moduleName, handleError(function (result) {
			var parent = referencify(result);
			var fields = parent['fields'];
			var referenceFields = filter(
				function (e) {
					return e['type']['name']=='reference';
				},
				fields
			);
			var referenceFieldModules = map(
				function (e) {
					return e['type']['refersTo'];
				},
				referenceFields
			);
			function union(a, b) {
				var newfields = filter(
					function (e) {
						return !contains(a, e);
					},
					b
				);
				return a.concat(newfields);
			}
			var relatedModules = reduceR(union, referenceFieldModules, [parent['name']]);

			// Remove modules that is no longer accessible
			relatedModules = diff(accessibleModules, relatedModules);

			function executer(parameters) {
				var failures = filter(function (e) {
					return e[0]==false;
				}, parameters);
				if (failures.length!=0) {
					var firstFailure = failures[0];
					callback(false, firstFailure[1]);
				} else {
					var moduleDescriptions = map(
						function (e) {
							return referencify(e[1]);
						},
						parameters
					);
					var modules = dict(map(
						function (e) {
							return [e['name'], e];
						},
						moduleDescriptions
					));
					callback(true, modules);
				}
			}
			var p = parallelExecuter(executer, relatedModules.length);
			$.each(relatedModules, function (i, v) {
				p(function (callback) {
					vtinst.describeObject(v, callback);
				});
			});
		}));
	}

	function fillSelectBox(id, modules, parentModule, filterPred) {
		if (filterPred==null) {
			filterPred = function () {
				return true;
			};
		}
		var parent = modules[parentModule];
		var fields = parent['fields'];

		function filteredFields(fields) {
			return filter(
				function (e) {
					var fieldCheck = !contains(['autogenerated', 'reference', 'owner', 'multipicklist', 'password'], e.type.name);
					var predCheck = filterPred(e);
					return fieldCheck && predCheck;
				},
				fields
			);
		}
		var parentFields = map(
			function (e) {
				return [e['name'], e['label']];
			},
			filteredFields(parent['fields'])
		);

		var referenceFieldTypes = filter(
			function (e) {
				return (e['type']['name']=='reference');
			},
			parent['fields']
		);

		var moduleFieldTypes = {};
		$.each(modules, function (k, v) {
			moduleFieldTypes[k] = dict(map(function (e) {
				return [e['name'], e['type']];
			}, filteredFields(v['fields'])));
		});

		function getFieldType(fullFieldName) {
			var group = fullFieldName.match(/(\w+) : \((\w+)\) (\w+)/);
			if (group==null) {
				var fieldModule = moduleName;
				var fieldName = fullFieldName;
			} else {
				var fieldModule = group[2];
				var fieldName = group[3];
			}
			return moduleFieldTypes[fieldModule][fieldName];
		}

		function fieldReferenceNames(referenceField) {
			var name = referenceField['name'];
			var label = referenceField['label'];
			function forModule(moduleName) {
				// If module is not accessible return no field information
				if (!contains(accessibleModulesInfo, moduleName)) {
					return [];
				}
				return map(
					function (field) {
						return ['('+name+' : ('+moduleName+') '+field['name']+')', label+' : ('+modules[moduleName]['label']+') '+field['label']];
					},
					filteredFields(modules[moduleName]['fields'])
				);
			}
			return reduceR(concat, map(forModule, referenceField['type']['refersTo']), []);
		}

		var referenceFields = reduceR(concat, map(fieldReferenceNames, referenceFieldTypes), []);
		var fieldLabels = dict(parentFields.concat(referenceFields));
		var select = $('#'+id);
		var optionClass = id+'_option';
		$.each(fieldLabels, function (k, v) {
			select.append('<option class="'+optionClass+'" value="'+k+'">' + v + '</option>');
		});
		if (cbGroups != null) {
			$.each(cbGroups, function (k, v) {
				var plval = '(general : (__VtigerMeta__) groupEmailList_' + v.groupname.replace(' ', '_') + ')';
				select.append('<option class="'+optionClass+'" value="'+plval+'">' + v.groupname + '</option>');
			});
		}
		if (parentModule=='Events') {
			select.append('<option class="'+optionClass+'" value="(general : (__VtigerMeta__) Events_Users_Invited)">Invited Users</option>');
			select.append('<option class="'+optionClass+'" value="(general : (__VtigerMeta__) Events_Related_Contacts)">Related Contacts</option>');
		}
	}

	$(document).ready(function () {
		vtinst.extendSession(handleError(function (result) {
			vtinst.query('select groupname from Groups;', function (resp, rdo) {
				if (resp) {
					cbGroups = rdo;
				}
			});
			vtinst.listTypes(handleError(function (accessibleModules) {
				accessibleModulesInfo = accessibleModules;

				getDescribeObjects(accessibleModules, moduleName, handleError(function (modules) {
					fillSelectBox('task-fieldnames', modules, moduleName);
					$('#task-fieldnames-busyicon').hide();
					$('#task-fieldnames').show();
					$('#task-fieldnames').change(function () {
						var textarea = CKEDITOR.instances.save_content;
						var value = '$'+jQuery(this).val();
						textarea.insertHtml(value);
					});

					fillSelectBox('attfieldnames', modules, moduleName);
					$('#attfieldnames').val(__attfieldnames);

					fillSelectBox('task-emailfieldsfrmname', modules, moduleName, function (e) {
						return (e['name'] == 'user_name');
					});
					$('#task-emailfieldsfrmname-busyicon').hide();
					$('#task-emailfieldsfrmname').show();
					$('#task-emailfieldsfrmname').change(function () {
						var input = $($('#save_fromname').get());
						var value = '$'+$(this).val();
						input.val(value);
					});

					fillSelectBox('task-emailfieldsfrmemail', modules, moduleName, function (e) {
						return e['type']['name']=='email';
					});
					$('#task-emailfieldsfrmemail-busyicon').hide();
					$('#task-emailfieldsfrmemail').show();
					$('#task-emailfieldsfrmemail').change(function () {
						var input = $($('#save_fromemail').get());
						var value = '$'+$(this).val();
						input.val(value);
					});

					fillSelectBox('task-emailfieldsreplyto', modules, moduleName, function (e) {
						return e['type']['name']=='email';
					});
					$('#task-emailfieldsreplyto-busyicon').hide();
					$('#task-emailfieldsreplyto').show();
					$('#task-emailfieldsreplyto').change(function () {
						var input = $($('#save_replyto').get());
						var value = '$'+$(this).val();
						input.val(value);
					});

					fillSelectBox('task-subjectfields', modules, moduleName, function (e) {
						return (e['type']['name']!='file' && e['type']['name']!='text' );
					});
					$('#task-subjectfields-busyicon').hide();
					$('#task-subjectfields').show();
					$('#task-subjectfields').change(function () {
						var input = $($('#save_subject').get());
						var value = '$'+$(this).val();
						input.val(input.val()+' '+value);
					});

					fillSelectBox('task-emailfields', modules, moduleName, function (e) {
						return e['type']['name']=='email';
					});
					$('#task-emailfields-busyicon').hide();
					$('#task-emailfields').show();
					$('#task-emailfields').change(function () {
						var input = $($('#save_recepient').get());
						var value = '$'+$(this).val();
						input.val(input.val()+','+value);
					});
					var selptype = document.getElementById('task-emailfields');
					var selecc = document.getElementById('task-emailfieldscc');
					for (var ops=0; ops<selptype.length; ops++) {
						selecc.options[ops] = new Option(selptype.options[ops].text, selptype.options[ops].value);
					}
					$('#task-emailfieldscc-busyicon').hide();
					$('#task-emailfieldscc').show();
					$('#task-emailfieldscc').change(function () {
						var input = $($('#save_emailcc').get());
						var value = '$'+$(this).val();
						input.val(input.val()+','+value);
					});
					var selebcc = document.getElementById('task-emailfieldsbcc');
					for (ops=0; ops<selptype.length; ops++) {
						selebcc.options[ops] = new Option(selptype.options[ops].text, selptype.options[ops].value);
					}
					$('#task-emailfieldsbcc-busyicon').hide();
					$('#task-emailfieldsbcc').show();
					$('#task-emailfieldsbcc').change(function () {
						var input = $($('#save_emailbcc').get());
						var value = '$'+$(this).val();
						input.val(input.val()+','+value);
					});

					//time_changes
					$('#task_timefields').change(function () {
						var textarea = CKEDITOR.instances.save_content;
						var value = '$'+$(this).val();
						textarea.insertHtml(value);
					});

					//changes
					fillSelectBox('task-group_usersnames', modules, moduleName);
					$('#task-fieldnames-busyicon').hide();
					$('#task-group_usersnames').show();
					$('#task-group_usersnames').change(function () {
						var textarea = $('#save_receipent').get(0);
						var value = '$'+$(this).val();
						insertAtCursor(textarea, value);
					});
				}));
			}));
		}));
		//Setup the validator
		validator.mandatoryFields.push('recepient');
		validator.mandatoryFields.push('subject');
	});
}
vtEmailTask = VTEmailTask(jQuery);
/*
 * Namespaced javascript class for attachmentManager
 */
var attachmentManager = {
	UploadLimit : 6,
	createUploader : function () {
		Dropzone.autoDiscover = false;
		var uploader = new Dropzone('#file-uploader', {
			url : 'index.php?module=Utilities&action=UtilitiesAjax&file=ExecuteFunctions&mode=ajax&functiontocall=saveAttachment',
			paramName: 'qqfile',
			parallelUploads: 1,
			addRemoveLinks: true,
			createImageThumbnails: true,
			dictRemoveFile: attachmentManager.i18n('JSLBL_Delete'),
			uploadMultiple: false,
			clickable: ['#file-uploader-message', '#file-uploader']
		});
		uploader.on('success', function (file, response) {
			var res = JSON.parse(response);
			file.docid = res.docid;
			file.attachid = res.attachid;
			attachmentManager.addAttachment(file.docid, this);
			var attcnt = document.getElementById('attachmentCount');
			attcnt.value = parseInt(attcnt.value) + 1;
		});
		uploader.on('removedfile', function (file) {
			attachmentManager.deleteAttachment(file.docid, this);
		});
		uploader.on('addedfile', function (file) {
			if (file.docid!=undefined) {
				attachmentManager.addAttachment(file.docid, this);
			}
		});
		return uploader;
	},
	addAttachment : function (docid, ele) {
		var attids = document.getElementById('attachmentids');
		if (attids.value.indexOf(docid) == -1) {
			attids.value = attids.value + docid + ',';
		}
	},
	deleteAttachment : function (docid, ele) {
		var attids = document.getElementById('attachmentids');
		attids.value = attids.value.replace(docid+',', '');
		var attcnt = document.getElementById('attachmentCount');
		attcnt.value = attcnt.value-1;
	},
	progress_show: function (msg, suffix) {
		if (typeof(suffix) == 'undefined') {
			suffix = '';
		}
		VtigerJS_DialogBox.block();
		if (typeof(msg) != 'undefined') {
			jQuery('#_progressmsg_').html(msg + suffix.toString());
		}
		jQuery('#_progress_').show();
	},
	progress_hide: function () {
		VtigerJS_DialogBox.unblock();
		jQuery('#_progressmsg_').html('');
		jQuery('#_progress_').hide();
	},
	show_error: function (message) {
		var errordiv = jQuery('#_messagediv_');
		if (message == '') {
			errordiv.text('').hide();
		} else {
			errordiv.html('<p>' + message + '</p>').css('display', 'block').addClass('mm_error').removeClass('mm_message');
			attachmentManager.placeAtCenter(errordiv);
		}
		attachmentManager.hide_error();
	},
	hide_error: function () {
		setTimeout(
			function () {
				jQuery('#_messagediv_').hide();
			},
			5000
		);
	},
	show_message: function (message) {
		var errordiv = jQuery('#_messagediv_');
		if (message == '') {
			errordiv.text('').hide();
		} else {
			errordiv.html('<p>' + message + '</p>').css('display', 'block').removeClass('mm_error').addClass('mm_message');
			attachmentManager.placeAtCenter(errordiv);
		}
		attachmentManager.hide_error();
	},
	i18n: function (key) {
		if (typeof(alert_arr) != 'undefined' && alert_arr[key]) {
			return alert_arr[key];
		}
		return key;
	},
	placeAtCenter : function (element) {
		element.css('position', 'absolute');
		element.css('top', ((jQuery(window).height() - element.outerHeight()) / 2) + jQuery(window).scrollTop() + 'px');
		element.css('left', ((jQuery(window).width() - element.outerWidth()) / 2) + jQuery(window).scrollLeft() + 'px');
	},
	getDocuments : function () {
		if (!attachmentManager.checkUploadCount()) {
			return false;
		}
		window.open('index.php?module=Documents&return_module=MailManager&action=Popup&popuptype=detailview&form=EditView&form_submit=false&recordid=&forrecord=&srcmodule=MailManager&popupmode=ajax&RLreturn_module=MailManager&callback=MailManager.add_data_to_relatedlist', 'test', cbPopupWindowSettings);
	},
	checkUploadCount : function () {
		var CurrentUploadCount = jQuery('#attachmentCount').val();
		if (CurrentUploadCount >= attachmentManager.UploadLimit) {
			attachmentManager.show_error(attachmentManager.i18n('JSLBL_FILEUPLOAD_LIMIT_EXCEEDED'));
			return false;
		}
		return true;
	}
};
jQuery(document).ready(function () {
	attachmentManager.createUploader();
	if (__attinfo.length>0) {
		var dzelem = document.getElementById('file-uploader');
		for (var i=0; i<__attinfo.length; i++) {
			dzelem.dropzone.emit('addedfile', {name:__attinfo[i]['name'], size:__attinfo[i]['size'], docid:__attinfo[i]['docid']});
			dzelem.dropzone.emit('complete', {name:__attinfo[i]['name'], size:__attinfo[i]['size'], docid:__attinfo[i]['docid']});
		}
	}
});

function addDocs(entity_id, recordid, mod, popupmode, callback) {
	var return_module = 'MailManager';
	if (popupmode == 'ajax') {
		VtigerJS_DialogBox.block();
		jQuery.ajax({
			method: 'POST',
			url: 'index.php?module='+return_module+'&action='+return_module+'Ajax&file=updateRelations&destination_module='+mod+'&entityid='+entity_id+'&parentid='+recordid+'&mode=Ajax'
		}).done(function (response) {
			VtigerJS_DialogBox.unblock();
			var res = JSON.parse(response);
			if (res.error != undefined) {
				alert('error');
				window.close();
				return false;
			}
			if (window.opener) {
				var dzelem = window.opener.document.getElementById('file-uploader');
			} else {
				var dzelem = document.getElementById('file-uploader');
			}
			if (dzelem.dropzone) {
				dzelem.dropzone.emit('addedfile', {name:res.name, size:res.size, emailid:res.emailid, docid:res.docid});
				dzelem.dropzone.emit('complete', {name:res.name, size:res.size, emailid:res.emailid, docid:res.docid});
			}
			uploadCountUpdater();
			if (window.opener) {
				window.close();
			}
		});
		return false;
	} else {
		opener.document.location.href='index.php?module='+return_module+'&action=updateRelations&destination_module='+mod+'&entityid='+entity_id+'&parentid='+recordid+'&return_module='+return_module+'&return_action='+gpopupReturnAction;
		if (document.getElementById('closewindow').value=='true') {
			window.close();
		}
	}
}
function uploadCountUpdater() {
	var countElement;
	if (jQuery('#attachmentCount').length) {
		countElement = jQuery('#attachmentCount');
	} else {
		countElement = jQuery(window.opener.document).find('#attachmentCount');
	}
	var MailManagerCurrentUploadCount = countElement.val();
	if (MailManagerCurrentUploadCount == null || MailManagerCurrentUploadCount == '') {
		MailManagerCurrentUploadCount = 0;
	}
	countElement.val(++MailManagerCurrentUploadCount);
}

$(document).ready(function () {
	let fileurl = 'module=MsgTemplate&action=MsgTemplateAjax&file=getSGTemplates';
	var templateBody = document.getElementById('sgMsgTemplate');
	if(templateBody.selectedIndex == 0) {
		document.getElementById('sgPreviewLink').setAttribute("disabled","disabled");
	}
	$.ajax({
		method: 'GET',
		url: 'index.php?' + fileurl
	}).done(function (templates) {
		response = $.parseJSON(templates);
		$.each(response, function (index, data) {
			var opt = document.createElement('option');
			opt.appendChild(document.createTextNode(data.templateName));
			opt.value = data.templateId;
			opt.setAttribute('versionid', data.versionId);
			if (data.templateId == selectedSGTemplate) {
				opt.setAttribute('selected', 'selected');
				previewLink = document.getElementById('sgPreviewLink');
				if (data.versionId !=null) {
					previewLink.href = "https://mc.sendgrid.com/dynamic-templates/"+data.templateId+"/version/"+data.versionId+"/preview";
					previewLink.disabled = false;
				} else {
					previewLink.setAttribute("disabled","disabled");
				}
			}
			templateBody.appendChild(opt);
		});
	});
	templateBody.addEventListener("change", function () {
		selvalue = document.getElementById('sgMsgTemplate').value;
		sel = document.getElementById('sgMsgTemplate');
		document.getElementById('sgmsgtemplate').value = selvalue;
		previewLink = document.getElementById('sgPreviewLink');
		templateVersion = sel.options[sel.selectedIndex].getAttribute('versionid');
		if (templateVersion !=null) {
			previewLink.href = "https://mc.sendgrid.com/dynamic-templates/"+selvalue+"/version/"+templateVersion+"/preview";
			previewLink.disabled = false;

		} else {
			previewLink.setAttribute("disabled","disabled");
		}
	});
});