$(function () {
    signInListener();

    var track = configure({
        model: "track",
        fieldId: "key",
        fields: [
            new FieldOption(FieldType.TEXT, "name"),
            new FieldOption(FieldType.COLOR, "color")
        ],
        data: {},
	load: [],
        databaseRef: firebase.database().ref().child("tracks"),
        databaseOrder: "name"
    });

    var room = configure({
        model: "room",
        fieldId: "key",
        fields: [
            new FieldOption(FieldType.TEXT, "name"),
            new FieldOption(FieldType.RADIO, "type", {values: [{value: "talk", description: "Talk"}, {value: "contest", description: "Contest"}]}),
            new FieldOption(FieldType.TEXT, "link")
        ],
        data: {},
	load: [],
        databaseRef: firebase.database().ref().child("rooms"),
        databaseOrder: "name"
    });

    var speaker = configure({
        model: "speaker",
        fieldId: "key",
        fields: [
            new FieldOption(FieldType.IMAGE, "avatar", {size: 50}),
            new FieldOption(FieldType.RADIO, "align", {values: [{value: "top", description: "Align avatar to TOP"}, {value: "center", description: "Align avatar to CENTER"},{value: "bottom", description: "Align avatar to BOTTOM"}]}),
	    new FieldOption(FieldType.TEXT, "name"),
            new FieldOption(FieldType.TEXT, "email"),
            new FieldOption(FieldType.TEXTAREA, "bio", {rows: 10, truncate: 70})
        ],
        data: {},
	load: [],
        databaseRef: firebase.database().ref().child("speakers"),
        databaseOrder: "name",
        storageRef: firebase.storage().ref("speakers")
    });

    var session = configure({
        model: "session",
        fieldId: "key",
        fields: [
            new FieldOption(FieldType.TEXT, "title"),
            new FieldOption(FieldType.RADIO, "type", {values: [{value: "talk", description: "Talk"}, {value: "contest", description: "Contest"}]}),
            new FieldOption(FieldType.SELECT, "track", {values: {}, multiple: "", replace: false}),
            new FieldOption(FieldType.RADIO, "difficulty",{values: [{value: "All", description: "All audiences"},{value: "Beginner", description: "Beginner"},{value: "Advanced", description: "Advanced"}]}),
            new FieldOption(FieldType.SELECT, "room", {values: {}, multiple: "", replace: true}),
            new FieldOption(FieldType.SELECT, "speakers", {values: {}, multiple: "multiple", replace: true}),
            new FieldOption(FieldType.TEXT, "start"), 
            new FieldOption(FieldType.TEXT, "duration"),
            new FieldOption(FieldType.TEXTAREA, "description", {rows: 10, truncate: 40})
        ],
        data: {},
	load: [
		{ref: firebase.database().ref().child("tracks"), order: "name", store: "track", what: {value: "name", description: ["name"]}},
		{ref: firebase.database().ref().child("rooms"), order: "name", store: "room", what: {value: "id", description: ["name", "type"]}},
		{ref: firebase.database().ref().child("speakers"), order: "name", store: "speakers", what: {value: "id", description: ["name"]}}
	],
        databaseRef: firebase.database().ref().child("sessions"),
        databaseOrder: "start",
        storageRef: firebase.storage().ref("sessions")
    });

    // Force select the first tab
    var firstTabName = $("ul.tabs li.tab:first a").attr('href').substring(1);
    $('ul.tabs').tabs('select_tab', firstTabName);
});

String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

var FieldType = {};
Object.defineProperty(FieldType, 'IMAGE', {value: "image"});
Object.defineProperty(FieldType, 'IMAGE_URL', {value: "image_url"});
Object.defineProperty(FieldType, 'TEXT', {value: "text"});
Object.defineProperty(FieldType, 'TEXTAREA', {value: "textarea"});
Object.defineProperty(FieldType, 'COLOR', {value: "hex"});
Object.defineProperty(FieldType, 'RADIO', {value: "radio"});
Object.defineProperty(FieldType, 'SELECT', {value: "select"});

var FieldOption = function (type, name, options) {
    this.type = type;
    this.name = name;
    this.options = options;
};

function signInListener() {
    firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $(".user-photo").attr("src", user.photoURL);
                $(".user-name").text(user.displayName);
                $(".user-email").text(user.email);

                $('ul.tabs').tabs();
                $(".button-collapse").sideNav();
                $('.modal').modal();

                $("#firebaseui-auth-container").hide();

                checkPermission();
            } else {
                $("#firebaseui-auth-container").show();
                $("#container").addClass("hide");

                login();
            }
        }, function (error) {
            console.log(error);
        }
    );

    // Signout
    $("#signout").click(function (event) {
        event.preventDefault();
        firebase.auth().signOut().then(function () {

        }, function (error) {
            console.error("Sign Out Error", error);
        });
    });
}

function checkPermission() {
    var checkAccessRef = firebase.database().ref().child("checkAccess");

    checkAccessRef.once('value', function (snapshot) {
        $("#container").removeClass("hide");
    }, function (error) {
        var html = "<div id='modal-permission' class='modal'>" +
            "<div class='modal-content'>" +
            "<h4>Permission Denied</h4>" +
            "<p>Sorry you don't have premission to access this page</p>" +
            "</div>" +
            "<div class='modal-footer'>" +
            "<a href='#!' class=' modal-action modal-close waves-effect waves-green btn-flat'>Ok!</a>" +
            "</div>" +
            "</div>";
        $("#container").html(html);
        $("#container").removeClass("hide");
        $('.modal').modal();
        $('#modal-permission').modal('open');
    });
}

function login() {
    var uiConfig = {
        "signInSuccessUrl": "/cz/admin",
        "signInOptions": [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
    };

    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui-auth-container", uiConfig);
}

function configure(config) {

    config.load.forEach( function (toLoad){
	toLoad.ref.orderByChild(toLoad.order).on("value", function (snapshot) {
                var shot = snapshot.val();
		var vals = {};
                $.each(shot, function (index, snap){
                        // Add new data to select menu
                        vals[index] = {};
                        $.each(toLoad.what, function (id, what){
			    if(id == 'value'){
		                vals[index]['value'] = snap[what];
			    }else{
				$.each(what, function(i, des){
				    if(vals[index]['description']){
					vals[index]['description'] += " - " + snap[des];
				    }else{ 	
					vals[index]['description'] = snap[des];
				    }
				});
			    }
			});
                });
		config.fields.forEach( function (element) {
			if(element.name == toLoad.store){
				element.options.values = vals;
				var code = createSelectOption(element.options.values);
				$("#" + createIdName(element.name)).html(code);
				$('select').material_select();
			}
		});
		
		
        });

    });

    // Add a new tab bar and a table to display data model list
    $("ul.tabs").append(createTab());
    $("#container").append(createDataModelTable());

    // Create a modal and a form to create/update a data model
    $("#container").append(createModalForm());
    $('select').material_select();

    // -- Buttons trigger ----------------------------------------------------------------------------------------

    $("body")
        .on("click", "#" + createIdName("item-add"), function (event) {
            event.preventDefault();
            openModalForm();
        })
        .on("click", "." + createIdName("item-edit"), function (event) {
            event.preventDefault();

            var key = $(this).closest("tr").find("." + config.fieldId).text();
            var itemSelected = config.data[key];

            // Add item id in the data to pass to edit form
            itemSelected[config.fieldId] = key;

            openModalForm(key, itemSelected);
        })
        .on("click", "." + createIdName("item-remove"), function (event) {
            event.preventDefault();

            var key = $(this).closest("tr").find("." + config.fieldId).text();

            removeData(key);
        })
        .on("click", "#" + createIdName('item-save'), function (event) {
            event.preventDefault();
            saveData($("#" + createIdName("form")));
            $("#" + createIdName("modal-form")).modal('close');
        })
	.on("click", ".modal-close", function (event) {
	    event.preventDefault();
	    $.each(config.fields, function (index, field) {
            switch (field.type) {
                case FieldType.RADIO:
		    field.options.values.forEach( function(option) {
                        $("#radio-" + option.value + "-" + config.model).attr('checked',false);
			$("#radio-" + option.value + "-" + config.model).prop("checked",false);
                    }); 
                    break;
                default:
                    break;
            }

        });

            $("#" + createIdName("modal-form")).modal('close');
	});

    // -- Firebase Database Triggers ----------------------------------------------------------------------------------

    /**
     * On new data was added in Firebase Database
     */
    config.databaseRef.orderByChild(config.databaseOrder).on("child_added", function (snapshot) {
        var dataModel = parseDataModelFromFirebaseSnapshot(snapshot);

        // Add new data to a local cache
        config.data[snapshot.key] = dataModel;

        addNewTableRow(snapshot.key, dataModel);
    });

    /**
     * On data was changed in Firebase Database
     */
    config.databaseRef.on("child_changed", function (snapshot) {

        var dataModel = parseDataModelFromFirebaseSnapshot(snapshot);

        // Update data in the local cache
        config.data[snapshot.key] = dataModel;

        updataTableRow(snapshot.key, dataModel);
    });

    /**
     * On data was removed in Firebase Database
     */
    config.databaseRef.on("child_removed", function (snapshot) {

        // Remove data from the local cache
        delete config.data[snapshot.key];

        removeTableRow(snapshot.key);
    });

    // -- Helper methods ----------------------------------------------------------------------------------------------

    /**
     * Centralize a way to create
     *
     * @param to Something to identify for where it will be used
     * @returns {*} Formatted name to use in HTML id or class
     */
    // TOOD Rename
    function createIdName(to) {
        return (to) ? config.model + "-" + to : config.model;
    }

    /**
     * Parse data model from Firebase snapshot
     *
     * @returns Data model
     */
    function parseDataModelFromFirebaseSnapshot(snapshot) {
        var data = {};

        $.each(config.fields, function (index, field) {
            data[field.name] = snapshot.val()[field.name];
        });

        return data;
    }

    /**
     * Parse data model from form
     *
     * @returns Data model
     */
    function parseDataModelFromForm(form) {
        var data = {};

        // Add item id in the data to pass to save method
        data[config.fieldId] = $(form).find("#" + createIdName(config.fieldId)).val();

        $.each(config.fields, function (index, field) {
            if (field.type != FieldType.IMAGE) {
	        data[field.name] = $(form).find("#" + createIdName(field.name)).val();
            }
        });

        return data;
    }

    /**
     * Create a html tab html for the data model
     *
     * @returns {string} Tab bar HTML
     */
    function createTab() {
        return "<li class='tab'><a href='#" + createIdName("tab") + "'>" + config.model + "</li>";
    }

    /**
     * Create a table to display a list of data model in the tab
     *
     * @returns {string} Tab content HTML
     */
    function createDataModelTable() {
        var html = "<div id='" + createIdName("tab") + "'>" +
            "<div id='" + createIdName() + "' class='page-content'>" +
            "<table id='" + createIdName("table") + "' class='model-table bordered highlight responsive-table'>" +
            "<thead>" +
            "<tr>" +
            "<th class='controls'></th><th style='display: none'>ID</th>";

        config.fields.forEach(function (field) {
            html += "<th data-field='" + field.name + "'>" + field.name + "</th>";
        });

        html += "</tr>" +
            "</thead>" +
            "<tbody>" +
            "</tbody>" +
            "</table>" +
            "<a href='#' id='" + createIdName("item-add") + "' class='btn-floating btn-large waves-effect waves-light red'><i class='material-icons'>add</i></a>" +
            "</div>" +
            "</div>";

        return html;
    }

    /**
     * Add a new row in the data model table
     *
     * @param key of the row/data
     * @param data Data model instance
     */
    function addNewTableRow(key, data) {
        var html = "<tr>" +
	    "<td class='edit'>" +
            "&nbsp;" +
            "<a href='#' class='" + createIdName("item-edit") + "'>" +
            "<i class='material-icons'>edit</i>" +
            "</a> &nbsp; &nbsp;" +
            "<a href='#' class='" + createIdName("item-remove") + "'>" +
            "<i class='material-icons'>delete</i>" +
            "</a>" +
            "&nbsp;" +
            "</td>";
	
        html += "<td class='" + config.fieldId + "' style='display: none;'>" + key + "</td>";

        $.each(config.fields, function (index, field) {
            switch (field.type) {
                case FieldType.IMAGE:
                case FieldType.IMAGE_URL:
                    var imageSrc = (data[field.name]) ? data[field.name] : "assets/imgs/person-placeholder.jpg";
                    html += "<td class='" + field.name + "'>" +
                        "<img src='" + imageSrc + "' class='circle' width='" + field.options.size + "px' height='" + field.options.size + "px' />" +
                        "</td>";
                    break;

		case FieldType.COLOR:
		    var val = "#000000";
		    if (data[field.name]) {
			val = data[field.name];
		    }
                    html += "<td class='" + field.name + " mdl-data-table__cell--non-numeric' style='color: white; background-color: " + val + "'>" + val + "</td>";
                    break;
       		
	       case FieldType.SELECT:
			var value = data[field.name],
			selectClass = field.name;

			if(field.options.replace == true && value != "" && value != undefined) {
				if(field.options.multiple != "") {
					var v = "";
					$.each(value, function (id, item){
						if(v != "") {
							v += ", " + field.options.values[item]['description'];
						} else {
							v = field.options.values[item]['description'];
						}
					});
					value = v;
						
				} else {
					value = field.options.values[value]['description'];
				}				
			}

			if( value == undefined ) {
                                value = "";
				selectClass += " missing";
                        }

			html += "<td class='" + selectClass + " mdl-data-table__cell--non-numeric'>" + value + "</td>";
			break;
			
	       default:
			var value = "",
			defClass = field.name;
			if (data[field.name]) {
				if (field.options && field.options.truncate && data[field.name].length > field.options.truncate) {
					value = data[field.name].substring(0, field.options.truncate) + "...";
				} else {
					value = data[field.name];
                        	}
			}
			
			if( value == undefined || value == "" ) {
                                value = "";
				defClass += " missing" 
                        }

			html += "<td class='" + defClass + " mdl-data-table__cell--non-numeric'>" + value + "</td>";
			break;
            }

        });

        html += "</tr>";

        $("#" + createIdName("table") + " > tbody:last-child").append(html);
    }

    /**
     * Update model value in the data model table
     *
     * @param key of the row/data
     * @param data Data model instance
     */
    function updataTableRow(key, data) {
        var tableRow = $("td." + config.fieldId).filter(function () {
            return $(this).text() == key;
        }).closest("tr");

        $.each(config.fields, function (index, field) {
            switch (field.type) {
                case FieldType.IMAGE:
                case FieldType.IMAGE_URL:
                    // Prevent update imagem until image was not completed uploaded
                    var imageSrc = data[field.name];
                    if ((imageSrc) && (!imageSrc.includes("fakepath"))) {
                        tableRow.find('td.' + field.name + " img").attr("src", imageSrc);
                    }
                    break;

		case FieldType.COLOR:
			tableRow.find('td.' + field.name).css({"background": data[field.name], "color": "white"});
			tableRow.find('td.' + field.name).text(data[field.name]);
		    break;

		case FieldType.SELECT:
                        var value = data[field.name];
                        if(field.options.replace == true && value != "" && value != undefined) {
                                if(field.options.multiple != "") {
                                        var v = "";
                                        $.each(value, function (id, item){
                                                if(v != "") {
                                                        v += ", " + field.options.values[item]['description'];
                                                } else {
                                                        v = field.options.values[item]['description'];
                                                }
                                        });
                                        value = v;

                                } else {
                                        value = field.options.values[value]['description'];
                                }
                        }

			if( value == undefined || value == "" ) {
				tableRow.find('td.' + field.name).addClass("missing");
				value = "";
			} else {
				if( tableRow.find('td.' + field.name).hasClass("missing") == true ) {
					tableRow.find('td.' + field.name).removeClass("missing");
				}
			}

			tableRow.find('td.' + field.name).text(value);
                    break;

                default:
			var value = (field.options && field.options.truncate) ?
			data[field.name].substring(0, field.options.truncate) + "..." : data[field.name];

			if( value == undefined || value == "" ) {
                                tableRow.find('td.' + field.name).addClass("missing");
                                value = "";
                        } else {
                                if( tableRow.find('td.' + field.name).hasClass("missing") == true ) {
                                        tableRow.find('td.' + field.name).removeClass("missing");
                                }
                        }


                    tableRow.find('td.' + field.name).text(value);
                    break;
            }

        });
    }

    /**
     *
     * Remove a row in the data model table
     *
     * @param key of the row/data
     */
    function removeTableRow(key) {
        var tableRow = $("td." + config.fieldId).filter(function () {
            return $(this).text() == key;
        }).closest("tr");

        // TODO Move to CSS
        tableRow.css("background-color", "#FF3700");
        tableRow.fadeOut(400, function () {
            tableRow.remove();
        });
    }

    /**
     * Create a form in a modal to create/update data model
     *
     * @returns {string} HTML modal form
     */
    function createModalForm() {
        var html = "<div id='" + createIdName("modal-form") + "' class='modal modal-fixed-footer'>" +
            "<div class='modal-content'>" +
            "<h4>" + config.model.capitalizeFirstLetter() + "</h4><form id='" + createIdName("form") + "'><fieldset>" +
            "<input type='hidden' id='" + createIdName(config.fieldId) + "'/>";

        config.fields.forEach(function (field) {
            switch (field.type) {
                case FieldType.IMAGE:
                    // Add a thumb image
                    // TODO
                    // if (getValue(field, data) != "") {
                    //     html += "<img class='form-image' src='" + getValue(field.name, data) + "' " +
                    //         "width='" + field.options.size + "px' height='" + field.options.size + "px' />";
                    // }
                    html += "<span class='form-file'>" +
                        "<label for='" + createIdName(field.name) + "'>" + field.name + ":</label>" +
                        "<input type='file' id='" + createIdName(field.name) + "' " +
                        "placeholder='" + field.name + "' class='text ui-widget-content ui-corner-all'/>" +
                        "</span>";
                    break;
                case FieldType.TEXTAREA:
                    html += "<div class='input-field'>" +
                        "<label for='" + createIdName(field.name) + "'>" + field.name + ":</label>" +
                        "<textarea id='" + createIdName(field.name) + "' " +
                        "class='materialize-textarea' rows='" + field.options.rows + "'></textarea>" +
                        "</div>";
                    break;
		case FieldType.SELECT:
		    html += "<div class='input-field'>" + 
			    "<select id='" + createIdName(field.name) + "' " + field.options.multiple + ">" + 
			    createSelectOption(field.options.values) + 
			    "</select>" +
			    "<label>" + field.name + ":</label>" +
			    "</div>";

		    break;
		case FieldType.RADIO:
		    html += "<div class='input-field' style='margin-bottom: 25px'>" +
                        "<label>" + field.name + ":</label>";
		
		    field.options.values.forEach( function(option) {
			html += "<p style='margin-left: 2em; margin-top: 2em;'><input type='radio' class='with-gap' name='group-" + field.name + "-" + config.model + "' id='radio-" + option.value + "-" + config.model + "'>" + 
			 	"<label for='radio-" + option.value + "-" + config.model + "'>" + option.description + "</label></p>";
		    });
		    
		    html += "</div>";
		    break;
		case FieldType.COLOR:
		    html += "<div class='input-field'>" +
                        "<label for='" + createIdName(field.name) + "' style='top: -1.5rem'>" + field.name + ":</label>" +
                        "<input type='color' id='" + createIdName(field.name) + "' />" +
                        "</div>";
                    break;
                default:
                    html += "<div class='input-field'>" +
                        "<label for='" + createIdName(field.name) + "'>" + field.name + ":</label>" +
                        "<input type='text' id='" + createIdName(field.name) + "' />" +
                        "</div>";
                    break;
            }
        });

        html += "</fieldset>" +
            "</form>" +
            "</div>" +
            "<div class='modal-footer'>" +
            "<a href='#!' class='modal-action modal-close waves-effect waves-green btn-flat'>Cancel</a>" +
            "<a href='#!' id='" + createIdName('item-save') + "' class='modal-action waves-effect waves-green btn-flat'>Save</a>" +
            "</div>" +
            "</div>";

        return html;
    }


    function createSelectOption(values){
	var options = "<option value='0' disabled selected>Choose your option</option>";
	
	$.each(values, function (index, val){
		// Add new data to select menu
	        options += "<option value='" + val.value + "'>" + val.description + "</option>";
	});

	return options;		
    }
    /**
     * Open a model window with the dinamic form created with createFormHtml
     *
     * @param data model data
     */
    function openModalForm(key, data) {
        // Put key temporarily in the data to use in the form
        $("#" + createIdName("form")).find("#" + createIdName(config.fieldId)).val(key);

        config.fields.forEach(function (field) {
	    if(field.type != FieldType.IMAGE){

                var formField = $("#" + createIdName("form")).find("#" + createIdName(field.name));
                var value = (data && data[field.name]) ? data[field.name] : "";
                formField.val(value);
                if (field.type == FieldType.TEXTAREA) {
                    formField.trigger('autoresize');
                }
		if (field.type == FieldType.RADIO) {
		    if(data && data[field.name]) {
 		        $("#radio-" + data[field.name] + "-" + config.model).attr('checked', true);
			$("#radio-" + data[field.name] + "-" + config.model).prop("checked", true);
		    }
		}
    	        if (field.type == FieldType.SELECT){
		    $('select').material_select();
	        }
	    } else {
		$("#" + createIdName("form")).find("#" + createIdName(field.name)).val("");
	    }
        });

        Materialize.updateTextFields();

        $("#" + createIdName('modal-form')).modal({
            ready: function (modal, trigger) {
                $('#' + createIdName("form") + ' :input:enabled:visible:first').focus();
            }
        });

        $("#" + createIdName('modal-form')).modal('open');
    }

    /**
     * Save a new model data in Firebase database
     */
    function saveData(form) {

        var data = parseDataModelFromForm(form);

        var key = (!data[config.fieldId]) ? config.databaseRef.push().key : data[config.fieldId];
        data["id"] = key;	

        // Remove key to not be saved with model data
        delete data[config.fieldId];

        // Update all image fields to Firebase storage
        config.fields.forEach(function (field) {
            if (field.type == FieldType.IMAGE) {
                var fileButton = $(form).find("#" + createIdName(field.name));

                if (fileButton.val() != "") {
                    var file = fileButton[0].files[0];
                    // key/model-fieldname.file_exetension
                    var absolutePath = "/" + createImageName(data) + "." + file.name.split('.').pop();

                    uploadImage(file, absolutePath, function (fileUrl) {
                        data[field.name] = fileUrl;
                        config.databaseRef.child(key).set(data);
                    });
                } else {
                    // Retrieve previous uploaded file URL (if exists)
                    data[field.name] = (config.data[key]) ? config.data[key][field.name] : "";
                }
            }
	    if (field.type == FieldType.RADIO) {
		field.options.values.forEach( function(option) {
                        var radio = $(form).find("#radio-" + option.value + "-" + config.model);
			if(radio.prop("checked") == true){
				data[field.name] = option.value;
			}
                    });
	    }

	    if (field.type == FieldType.SELECT){
		var select = $(form).find("#" + createIdName(field.name));
		if(select.val() == null){
			data[field.name] = [];
		} else {
			data[field.name] = select.val();
		}
	    }
        });

        config.databaseRef.child(key).update(data, function (error) {
            if (error) {
                alert("Data could not be saved." + error);
            }
        });

    }

    function createImageName(data) {
    	return data['email'];
    }

    /**
     * Remove data and files associated
     *
     * @param id Id of the data/file folder
     */
    function removeData(id) {
        config.databaseRef.child(id).remove(function (error) {
            if (error) {
                alert("Data could not be removed." + error);
            }
        });
        /**
         * There is not way to delete a folder from Firebase API
         * See: https://groups.google.com/forum/#!topic/firebase-talk/aG7GSR7kVtw
         */
        //config.storageRef.child(id).delete();
    }

    /**
     * Upload file (image) to the Firebase Storage
     *
     * @param file Local file path
     * @param absolutePath absolute file path (folder + file name)
     * @param callback Callback function called when successfully uploaded
     */
    function uploadImage(file, absolutePath, callback) {
        if (file) {
            var uploadTask = config.storageRef.child(absolutePath).put(file);
            uploadTask.on('state_changed', function (snapshot) {
            }, function (error) {
                // TODO Display error!
            }, function () {
                callback(uploadTask.snapshot.downloadURL);
            });
        }
    }

}
