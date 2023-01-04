//var controlJson = "";
var DateFormat = $("#hdnDateFormat").val();
$(document).ready(function () {
    //getControlJson();
    loadControls();
    DateFormat = $("#hdnDateFormat").val();
    //$('#previewform').validate({
    //    rules: {
    //        "CheckBox-1": { required: true, minlength: 1 }
    //    }
    //});
    $('[data-toggle=datepicker]').each(function () {
        var target = $(this).data('target-name');
        var t = $('input[name=' + target + ']');
        t.datetimepicker({
            format: DateFormat.toUpperCase()
        });
    });

    $('#btnCancle').on('click', function () {
        
        //var formId = $("#hdnFormId").val();
        //var requestURL = window.location.protocol + "//" + window.location.host + "/FormBuilder/FormBuilder/CreateDynamicForm?FormId=" + formId;
        //GetLayoutGroupUserData(RequestURL, "btnAddForm");
        $('#btnFormBuilder').trigger('click');
        return false;
    });
});

function EditFormControl() {
    var formId = $("#hdnFormId").val();
    var requestURL = window.location.protocol + "//" + window.location.host + "/FormBuilder/FormBuilder/CreateDynamicForm?FormId=" + formId;
    //RequestURL = window.location.protocol + "//" + window.location.host + "/Admin/AdmMIS/MISIndex";
    //'@Url.Action("CreateDynamicForm", "FormBuilder/FormBuilder")';
    GetLayoutGroupUserData(RequestURL, "btnEditFormControl");
}
/* Route Region */
function getControlJson() {

    try {
        var formId = $("#hdnFormId").val();
        var requestURL = window.location.protocol + "//" + window.location.host + "/FormBuilder/FormBuilder/ControlJson";
        var postData = JSON.stringify({ FormId: formId });;
        $.ajax({
            url: requestURL,
            data: postData,
            type: 'Post',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            success: function (data) {

                controlJson = jQuery.parseJSON(data.CJson);
                loadControls();
            },
            error: HandleError
        });

    }
    catch (exception) { dispConsoleMessage("getRouteDetails Error " + exception.message); }
}
function loadControls() {

    if (controlJson.length) {
        $("#maindiv").empty();
        $.each(controlJson, function (i, obj) {
            //alert(obj.divDataType);



            if (obj.divDataType == "TextBox")
                $("#editTextboxTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "CheckBox")
                $("#editCheckBoxTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "Radio")
                $("#editRadioTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "DropDownList")
                $("#editDropDownListTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "Calendar") {
           
                var maxDate = new Date(obj.validate.maxValue);
                var minDate = new Date(obj.validate.minValue);

                var options = {
                    viewMode: 'days',
                    format: DateFormat.toUpperCase(),
                    //changeYear: true,
                    //changeMonth: true,
                    maxDate: maxDate,
                    minDate: minDate
                };

                if (maxDate == "Invalid Date")
                    options = {
                        viewMode: 'days',
                        format: DateFormat.toUpperCase(),
                        minDate: minDate
                    };

                if (minDate == "Invalid Date")
                    options = {
                        viewMode: 'days',
                        format: DateFormat.toUpperCase(),
                        maxDate: maxDate
                    };
                if (maxDate == "Invalid Date" && minDate == "Invalid Date")
                    options = {
                        viewMode: 'days',
                        format: DateFormat.toUpperCase()
                    };

                $("#editCalendarTemplate").tmpl(obj).appendTo("#maindiv");
               

               

                $("#Div" + obj.controlId).datetimepicker(options);
                $('.open-datetimepicker').click(function (event) {
                    event.preventDefault();
                    $("#Div" + obj.controlId).focus();
                });

                //$("#" + obj.divId).find('[data-toggle=datepicker]').each(function () {
                //    var target = $(this).data('target-name');
                //    var t = $('input[name=' + target + ']');
                //    t.datetimepicker(options);
                //    $('.open-datetimepicker').click(function (event) {
                //        event.preventDefault();
                //        t.click();
                //    });
                //});
            }
            else if (obj.divDataType == "Header")
                $("#editHeaderTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "TextBox-MultiLine")
                $("#editTextAreaTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "PageHeader")
                $("#editPageHeaderTemplate").tmpl(obj).appendTo("#maindiv");
        });
        var requiredCheckboxes = $(':checkbox[required]');
       
        requiredCheckboxes.on('change', function (e) {
            
            var checkboxGroup = requiredCheckboxes.filter('[name="' + $(this).attr('name') + '"]');
            var isChecked = checkboxGroup.is(':checked');
            checkboxGroup.prop('required', !isChecked);
        });
    }
}