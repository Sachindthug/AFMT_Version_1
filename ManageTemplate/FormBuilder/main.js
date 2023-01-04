var formMode = "I";
var deletedFields = "";
var deletedOptions = "";
var controlJson = "";
var ContainerArray = ['Table', 'Grid', 'Tab','ExcelGrid'];
var templateId = 0;
var alphanumericPattern = "^(?!\\s*$)[a-zA-Z [a-zA-Z0-9\-\_\.]+$";
var alphaPattren = "^[a-zA-Z ]*$";
var numericWithDecialPointPattern = "/^[0-9]+\.?[0-9]*$/"
var alphanumericWithSecialCharPattern = "^(?!\\s*$)[ a-zA-Z0-9\b_@./#&+-]+$";
var alphanumericForSql = "^(?!\\s*$)[a-zA-Z [a-zA-Z0-9\*]+$";
var datePattern = "mm/dd/yy";
var specialKeys = [];
var alphabetDefaultMaxLength = 50;
var numericDefaultMaxlength = 10;
specialKeys.push(8); //Backspace
specialKeys.push(9); //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(37); //Left
specialKeys.push(39); //Right
var _URL = window.URL || window.webkitURL;
var onceDropped = false;
var typeModuleOpt = 0;
var IsDataDefault = false;
/*document.ready event*/
$(document).ready(function () {
    $(document).bind("contextmenu", function (e) {
        return false;
    });
    typeModuleOpt = localStorage.getItem('type');
    GetMasterTemplateType();
    editTemplate();
    controlDraggable();
    dropEventHandling();
    $('#TemplateName').focus();
});

function OnDragStart(event,ctrl) {
  switch (ctrl) {
    case 'btn':
      $(".lblBtnId").hide();
    break;
    case 'cal':
      $(".lblCalId").hide();
      break;
    case 'chk':
      $(".lblChkId").hide();
      break;
    case 'ddl':
      $(".lblDdlId").hide();
      break;
    case 'hdr':
      $(".lblHdrId").hide();
      break;
    case 'mul':
      $(".lblMulId").hide();
      break;
    case 'rdb':
      $(".lblRdbId").hide();
      break;
    case 'txta':
      $(".lblTxtaId").hide();
      break;
    case 'txt':
      $(".lblTxtId").hide();
      break;
  }
 
}


//bind template Type
function GetMasterTemplateType() {
    var requestURL = window.location.protocol + "//" + window.location.host + "/Template/getAllMasterTemplateType";
    $.ajax({
        url: requestURL,
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        // Fetch the stored token from localStorage and set in the header
        headers: {
            'PyramidTokenHeader': getTokenHeaders()
        },
        success: function (response) {
            response != null ? BindMasterTemplateType(response) : alert("error in form submitted.");
        }
    })
}

function BindMasterTemplateType(result) {
    $.each(result, function (key, value) {
        $("#TemplateType").append($("<option></option>").val(value.MasterTemplateTypeId).html(value.MasterTemplateTypeName));
    });
}

/*Make Edit mode of Template Form*/
var editTemplate = function () {
  templateId = localStorage.getItem('templateId');
    if (templateId > 0 && templateId != null)
        getControlJson(1);
}

/*Control list make draggable */
var controlDraggable = function () {
    $(".draggable").draggable({
        appendTo: "body",
        helper: "clone",
        cursor: "move",
      revert: function (event, ui) {
        var controlType = this.attr('data-type');
        switch (controlType) {
        case 'Button':
          $(".lblBtnId").show();
          break;
        case 'Calendar':
          $(".lblCalId").show();
          break;
        case 'CheckBox':
          $(".lblChkId").show();
          break;
        case 'DropDownList':
          $(".lblDdlId").show();
          break;
        case 'Header':
          $(".lblHdrId").show();
          break;
        case 'MultiSelect':
          $(".lblMulId").show();
          break;
        case 'Radio':
          $(".lblRdbId").show();
          break;
        case 'TextBox-MultiLine':
          $(".lblTxtaId").show();
          break;
        case 'TextBox':
          $(".lblTxtId").show();
          break;
        }
          //return "invalid";
        }
      
    });
}

//Handling form event
var dropEventHandling = function () {
  var formid = $(".form-body").find("Div:first").attr("id");
  $("#" + formid).mouseenter(function () {
    controlDroppable();
  });
}


/*dropppable control into container */
var controlDroppable = function () {
  onceDropped = false;
$(".droppable").droppable({
        accept: ".draggable",
        activeClass: "ui-state-default",
        helper: "clone",
        hoverClass: "droppable-active",
        greedy: true,
        tolerance: 'touch',
        drop: function (event, ui) {
  
          $(".empty-form").hide();
          document.getElementById("btnSaveForm").disabled = false;
          document.getElementById("btnSaveAndPublishForm").disabled = false;
          
            var $orig = $(ui.draggable);
            var controlId = uuidv4();

            var dataType = $(event.target).attr('data-type') //event.target.getAttribute('data-type');
            var targetControlId = $(event.target).attr('id') //event.target.getAttribute('id');
            var targetControlclass = $(event.target).attr('class')
            var controlType = '';
          if (dataType == 'FormType') {
           
              if (!$(ui.draggable).hasClass("dropped")) {
                
                    var $el = $orig
                        .clone()
                        .addClass("dropped")
                        .attr('id', controlId)
                        .css({
                            "position": "relative",
                            "left": null,
                            "right": null
                        })
                        .appendTo(this);

                    // update id
                    var id = typeof ($orig.find(":input").attr("id")) == 'undefined' ? $orig.find("div.controls div:first").attr("id") : $orig.find(":input").attr("id");

                    if (id == undefined) {
                        id = $orig.find("label").attr("for");
                    }

                    //for data table control
                    if ($.inArray(id.split('-')[0], ContainerArray) == 0) {
                        $("#" + controlId).find("#" + id).html("");
                        AddedTableWithRow(controlId);
                    }
                    //ExcelGrid control  
                    if ($.inArray(id.split('-')[0], ContainerArray) == 3) {
                        $("#" + controlId).find("#" + id).html("");
                        AddedExcelGridWithRow(controlId);
                    }

                    //for Grid control
                    if ($.inArray(id.split('-')[0], ContainerArray) == 1) {
                        $("#" + controlId).find("#" + id).html("");
                        AddedGridWithRow(controlId);
                        //$("#" + controlId).find("#" + id).find("td").mouseover(function (e) {
                        //    e.stopPropagation();
                        //    gridContentId = $(this).attr("id");
                        //});
                    }

                    //for tab Control
                    if ($.inArray(id.split('-')[0], ContainerArray) == 2) {
                        $("#" + controlId).find("#" + id).find('.tabcontent').html("");
                        tabflag = true;
                        AddedFirstTab(controlId);
                    }

                  controlType = id.split('-')[0];
                 switch (controlType) {
                  case 'Button':
                    $("#" + controlId).find("label:first").removeClass("lblBtnId");
                 break;
                  case 'Calendar':
                    $("#" + controlId).find("label:first").removeClass("lblCalId");
                  
                  break;
                  case 'CheckBox':
                    $("#" + controlId).find("label:first").removeClass("lblChkId");
                  
                  break;
                  case 'DropDownList':
                    $("#" + controlId).find("label:first").removeClass("lblDdlId");
                  
                  break;
                  case 'Header':
                    $("#" + controlId).find("label:first").removeClass("lblHdrId");
                  
                  break;
                  case 'MultiSelect':
                    $("#" + controlId).find("label:first").removeClass("lblMulId");
                  
                  break;
                  case 'RadioButton':
                    $("#" + controlId).find("label:first").removeClass("lblRdbId");
                 
                  break;
                  case 'TextArea':
                    $("#" + controlId).find("label:first").removeClass("lblTxtaId");
                 
                  break;
                  case 'TextBox':
                    $("#" + controlId).find("label:first").removeClass("lblTxtId");
                 
                  break;
                }
                    $("#" + controlId).find("label:first").css("display", "none");
                    $("#" + controlId).find(".conrolimage").css("display", "none");
                    //Create new control Id after drop
                    $("#" + controlId).find("label:first").text("");
                    $("#" + controlId).find("label:first").css("display", "none");
                    $("#" + controlId).find(".controls").css("display", "block");
                    $("#" + controlId).find("label")["0"].innerHTML = id;
                    $("#" + controlId).find("label").length > 1 ? $("#" + controlId).find("label")["1"].innerHTML = id : "";

                    if (id.split('-')[0] === "Header" || id.split('-')[0] === "PageHeader") {
                      $("#" + controlId).find("#headerTextdiv")[0].innerHTML = "<h1>" + id + "</h1>";
                      $("#" + controlId).find("#headerTextdiv").css("text-align", "left");
                      $("#" + controlId).find("#headerTextdiv").css("overflow-wrap", "break-word");
                    }

                    if (id) {
                        id = id.split("-").slice(0, -1).join("-") + "-" +
                            (parseInt(id.split("-").slice(-1)[0]) + 1);

                        $orig.find(":input").attr("id", id);
                        $orig.find(":input").attr("name", id);
                        $orig.find("label").attr("for", id);
                    }


                    if (id) {
                        //for tab,grid,table,ExcelGrid Control
                        if ($.inArray(id.split('-')[0], ContainerArray) >= 0) {
                            $orig.find("div.controls div:first").attr("id", id)[0];
                        }
                        //for grid, table,excelgrid control
                        if ($.inArray(id.split('-')[0], ContainerArray) == 1 || $.inArray(id.split('-')[0], ContainerArray) == 0 || $.inArray(id.split('-')[0], ContainerArray) == 3) {
                            $orig.find("div.controls div:first table").attr("id", id)[0];
                            $orig.find("div.controls div:first excelGrid").attr("id", id)[0];
                        }
                        //Added Droppable class
                        if ($.inArray(id.split('-')[0], ContainerArray) > 0) {
                            //$("#" + controlId).addClass("droppable");

                            $(".tabcontent").addClass("droppable");
                            if ($(".columncontent").parents("div .controls").parent().attr("data-type") == "Grid")
                                $(".columncontent").addClass("droppable");

                        }
                        $("#" + controlId).sortable();
                    }

                    // tools
                    $('<p class="tools">\
                    <a class="edit-link" onclick="showProperties(this);" data-id=' + controlId + '>Edit<a> | \
                    <a class="remove-link" onclick="RemoveControl(this)" data-id=' + controlId + '>Remove</a></p>').appendTo($el);
              }

            }
            else if (targetControlclass.toLowerCase().includes('tabcontent')) {
                dataType = "Tab";
                var ParentControlId = $(event.target).closest('div').parent().parent().parent().prop('id');
                var newCtrlType = typeof ($orig.find(":input").attr("id")) == 'undefined' ? $orig.find("div.controls div:first").attr("id") : $orig.find(":input").attr("id");
                controlType = newCtrlType.split('-')[0];
               if (!$(ui.draggable).hasClass("dropped") && targetControlId != null && CheckControlDropValidity($orig, dataType, controlId) == true) {
                  if (ParentControlId)
                    var tabid = $("#" + ParentControlId).find(".controls div:first").attr("id");

                    //Remove watermark text with class
                    if ($("#" + ParentControlId).find("#" + tabid).find("#" + targetControlId + ".tabcontent").find(".dropped").length == 0) {

                        $("#" + ParentControlId).find("#" + tabid).find("#" + targetControlId + ".tabcontent").removeClass("tabcontentitem").text("");
                    }
                    DroppedControlIntoContainer($orig, dataType, controlId, $("#" + ParentControlId).find("#" + tabid).find("#" + targetControlId + ".tabcontent"));

                    $(".tabcontent").find(".controls").css("display", "block");
                    $(".tabcontent").find(".conrolimage").css("display", "none");

                 

                }
            }
            else if (targetControlclass.toLowerCase().includes('columncontent')) {
                dataType = "Grid";
                var ParentControlId = $(event.target).closest('div').parent().parent().prop('id');
              var newCtrlType  = typeof ($orig.find(":input").attr("id")) == 'undefined' ? $orig.find("div.controls div:first").attr("id") : $orig.find(":input").attr("id");
              controlType = newCtrlType.split('-')[0];
                if (!$(ui.draggable).hasClass("dropped")) {

                    if (targetControlId != "" && CheckControlDropValidity($orig, dataType, controlId) == true) {
                        if ($(".form-body").find("#" + ParentControlId).find("#" + targetControlId + " .dropped").length > 0) {

                            if (confirm("Are sure you want remove child control from this cell?")) {

                                $(".form-body").find("#" + ParentControlId).find("#" + targetControlId).removeClass("watermark").text("");

                                DroppedControlIntoContainer($orig, dataType, controlId, $(".form-body").find("#" + ParentControlId).find("#" + targetControlId));
                                $(".columncontent").find(".controls").css("display", "block");
                                $(".columncontent").find(".conrolimage").css("display", "none");
                            }
                        }
                        else {
                          if (onceDropped === false) {
                            onceDropped = true;
                            $(".form-body").find("#" + ParentControlId).find("#" + targetControlId).removeClass("watermark").text("");
                            DroppedControlIntoContainer($orig, dataType, controlId, $(".form-body").find("#" + ParentControlId).find("#" + targetControlId));

                            if ($(".form-body").find("#" + ParentControlId).find("#" + targetControlId + " .dropped").length == 0) {
                              $(".form-body").find("#" + ParentControlId).find("#" + targetControlId).addClass("watermark").text("Control Placed");
                            }

                            $(".columncontent").find(".controls").css("display", "block");
                            $(".columncontent").find(".conrolimage").css("display", "none");
                          }
                           
                        }
                    }
                }
            }
            $("#maindiv").find(":input").on("cut copy paste keydown", function (e) {
                e.preventDefault();
            });
          if (controlType != "") {
          switch (controlType) {
            case 'Button':
              $(".lblBtnId").show();
              break;
            case 'Calendar':
              $(".lblCalId").show();
              break;
            case 'CheckBox':
              $(".lblChkId").show();
              break;
            case 'DropDownList':
              $(".lblDdlId").show();
              break;
            case 'Header':
              $(".lblHdrId").show();
              break;
            case 'MultiSelect':
              $(".lblMulId").show();
              break;
            case 'Radio':
              $(".lblRdbId").show();
              break;
            case 'TextBox-MultiLine':
              $(".lblTxtaId").show();
              break;
            case 'TextBox':
              $(".lblTxtId").show();
              break;
            }
          }
         
        }
    }).sortable({
        stop: function (event, ui) {
        },
    });
  
}

/*Create new control Id after drop*/
function CreateNewcontrolId($orig, controlId, id) {
  var controlType=id.split('-')[0];
  switch (controlType) {
  case 'Button':
    $("#" + controlId).find("label:first").removeClass("lblBtnId");
    break;
  case 'Calendar':
    $("#" + controlId).find("label:first").removeClass("lblCalId");

    break;
  case 'CheckBox':
    $("#" + controlId).find("label:first").removeClass("lblChkId");

    break;
  case 'DropDownList':
    $("#" + controlId).find("label:first").removeClass("lblDdlId");

    break;
  case 'Header':
    $("#" + controlId).find("label:first").removeClass("lblHdrId");

    break;
  case 'MultiSelect':
    $("#" + controlId).find("label:first").removeClass("lblMulId");

    break;
  case 'RadioButton':
    $("#" + controlId).find("label:first").removeClass("lblRdbId");

    break;
  case 'TextArea':
    $("#" + controlId).find("label:first").removeClass("lblTxtaId");

    break;
  case 'TextBox':
    $("#" + controlId).find("label:first").removeClass("lblTxtId");

    break;
  }
    $("#" + controlId).find("label:first").text("");
    $("#" + controlId).find("label:first").css("display", "none");
    $("#" + controlId).find(".controls").css("display", "block");
    $("#" + controlId).find("label")["0"].innerHTML = id;
    $("#" + controlId).find("label").length > 1 ? $("#" + controlId).find("label")["1"].innerHTML = id : "";


    if (id.split('-')[0] === "Header" || id.split('-')[0] === "PageHeader") {
      $("#" + controlId).find("#headerTextdiv")[0].innerHTML = "<h1>" + id + "</h1>";
      $("#" + controlId).find("#headerTextdiv").css("text-align", "left");
      $("#" + controlId).find("#headerTextdiv").css("overflow-wrap", "break-word");
    }

    if (id) {
        id = id.split("-").slice(0, -1).join("-") + "-" +
            (parseInt(id.split("-").slice(-1)[0]) + 1);

        $orig.find(":input").attr("id", id);
        $orig.find(":input").attr("name", id);
        $orig.find("label").attr("for", id);

        if ($.inArray(id.split('-')[0], ContainerArray) == 0 || $.inArray(id.split('-')[0], ContainerArray) == 3) {
            $orig.find("div.controls div:first").attr("id", id);
        }

    }
}

/*Check Controls dropping validaity*/
function CheckControlDropValidity($orig, dataType, controlId) {
    var id = typeof ($orig.find(":input").attr("id")) == 'undefined' ? $orig.find("div.controls div:first").attr("id") : $orig.find(":input").attr("id");
    var dropflag = false;

    if (dataType == 'Grid' && ($.inArray(id.split('-')[0], ContainerArray) < 0)) {
        dropflag = true;
    }
    else if (dataType == 'Tab' && (($.inArray(id.split('-')[0], ContainerArray) <= 0) || ($.inArray(id.split('-')[0], ContainerArray) == 3)) && (dataType == 'Tab' && ($.inArray(id.split('-')[0], ContainerArray) != 1) || ($.inArray(id.split('-')[0], ContainerArray) != 2))) {
        dropflag = true;
    }
    return dropflag;
}

/*Append control into container control*/
function DroppedControlIntoContainer($orig, dataType, controlId, containerId) {
    var id = typeof ($orig.find(":input").attr("id")) == 'undefined' ? $orig.find("div.controls div:first").attr("id") : $orig.find(":input").attr("id");
    var flag = false;
    var tabcontrolflag = false;
    flag = CheckControlDropValidity($orig, dataType, controlId);

    if (dataType == 'Tab') {
        tabcontrolflag = true;
    }
   
    if (typeof (id) != 'undefined' && flag) {
        var $el = $orig
           .clone()
           .addClass("dropped")
           .attr('id', controlId)
           .css({
               "position": "static",
               "left": null,
               "right": null
           }).appendTo(containerId);

        //Create new control Id after drop
        CreateNewcontrolId($orig, controlId, id)
        if (tabcontrolflag == true) {
            if (id.includes("Table")) {
                //Added table into div container
                AddedTableWithRow(controlId);
            }
            else if (id.includes("ExcelGrid")) {
                AddedExcelGridWithRow(controlId);
            }
        }
        // tools
        $('<p class="tools">\
                    <a class="edit-link" onclick="showProperties(this);" data-id=' + controlId + '>Edit<a> | \
                    <a class="remove-link" onclick="RemoveControl(this)" data-id=' + controlId + '>Remove</a></p>').appendTo($el);
    }

}

/*Added Grid with Row*/
function AddedGridWithRow(sControlId) {
    if ($("#" + sControlId).find(".controls div:first table").length == 0) {
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id") + "").html("");
        //Added table into div container
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id")).append("<table cellpadding='0' cellspacing='0' border='1' id='" + $("#" + sControlId).find("div.controls div:first").attr("id") + "' style='border-color:#d3d3d3; border-style: dotted solid; width:100%'><tbody><tr id='Row0'><td id='ColumnContent-0-1' class='columncontent watermark'>Control Placed</td><td id='ColumnContent-0-2' class='columncontent watermark'>Control Placed</td><td id='ColumnContent-0-3' class='columncontent watermark'>Control Placed</td></tr><tr id='Row1'><td id='ColumnContent-1-1' class='columncontent watermark'>Control Placed</td><td id='ColumnContent-1-2' class='columncontent watermark'>Control Placed</td><td id='ColumnContent-1-3' class='columncontent watermark'>Control Placed</td></tr></tbody></table>");
    }
}

/*Added data table with Row*/
function AddedTableWithRow(sControlId) {
    if ($("#" + sControlId).find(".controls div:first table").length == 0) {
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id") + "").html("");
        //Added table into div container
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id")).append("<table cellpadding='0' cellspacing='0' border='1' id='" + $("#" + sControlId).find("div.controls div:first").attr("id") + "' style='border-color:#d3d3d3; border-style: dotted solid; width:100%'><tbody><tr id='Row0' style='background-color:lightgray'><th class='columnheadercontent' id='ColumnContent-01'>Column1</th><th class='columnheadercontent' id='ColumnContent-02'>Column2</th><th class='columnheadercontent' id='ColumnContent-03'>Column3</th></tr><tr id='Row1'><td id='ColumnContent-11' class='rowcontent'><textarea class='form-control textareaTableContent' rows='1' cols='4' placeholder='Enter text'></textarea></td><td id='ColumnContent-12' class='rowcontent'><textarea class='form-control textareaTableContent' rows='1' cols='4' placeholder='Enter text'></textarea></td><td id='ColumnContent-13' class='rowcontent'><textarea class='form-control textareaTableContent' rows='1' cols='4' placeholder='Enter text'></textarea></td></tr></tbody></table>");
    }
}

/*Added data Excel Grid with Row*/
function AddedExcelGridWithRow(sControlId) {
    if ($("#" + sControlId).find(".controls div:first excelGrid").length == 0) {
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id") + "").html("");
        //Added table into div container
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id")).append("<table cellpadding='0' cellspacing='0' border='1' id='" + $("#" + sControlId).find("div.controls div:first").attr("id") + "' style='border-color:#gay; border-style: solid; width:100%'><tbody><tr id='Row0' style='background-color:lightgray;border:gray 1px solid'><th class='columnheaderexcelcontent' id='ColumnContent-01' columntype='text' columnsource=''>Column1</th><th class='columnheaderexcelcontent' id='ColumnContent-02' columntype='text' columnsource=''>Column2</th><th class='columnheaderexcelcontent' id='ColumnContent-03' columntype='text' columnsource=''>Column3</th><th class='columnheaderexcelcontent' id='ColumnContent-04' columntype='text' columnsource=''>Column4</th><th class='columnheaderexcelcontent' id='ColumnContent-05' columntype='text' columnsource=''>Column5</th></tr><tr id='Row1'><td id='ColumnContent-11' class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'></textarea></td><td id='ColumnContent-12' class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'></textarea></td><td id='ColumnContent-13' class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'></textarea></td><td id='ColumnContent-14' class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'></textarea></td><td id='ColumnContent-15' class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'></textarea></td></tr></tbody></table>");
    }
}

/*Added Tab with first sub tab*/
function AddedFirstTab(sControlId) {

    if ($("#" + sControlId).find(".tab").length == 0) {
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id") + "").html("");
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id") + "").append("<div class='tab'></div>");
        var i = 1;
        //Added Tab into Tab control
        $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id")).append("<div id='tab" + i + "content' class='tabcontent tabcontentitem'>Control Placed</div>");
        $("#" + sControlId).find(".tab").append('<input type="button" id=Tab-' + i + '\ class="tablinks" value="tab' + i + '\" onclick="OpenSelectedTab(this,\'' + ('tab' + i + '\content') + '\')" />')

        $("#" + sControlId + " .tablinks:first").trigger('click');
    }

}

/*Used for to Eanbled Tab section */
function OpenSelectedTab(evt, tabName) {

    var i, tabcontent, tablinks;
    var divcontainerID = $(evt).closest("div").parents("div.dropped").attr("id")
    tabcontent = $("#" + divcontainerID).find("#" + $(evt).parent().parent().attr("id") + " .tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].id != tabName) {
            tabcontent[i].style.display = "none";
        }
        else {
            tabcontent[i].style.display = "block";
        }
    }
    tablinks = $("#" + $("#" + divcontainerID).find(evt).parent().parent().attr("id") + " .tablinks");
    for (i = 0; i < tablinks.length; i++) {
        if ($(tablinks[i]).attr("id") == $(evt).attr("id")) {
            $(tablinks[i]).addClass("active")
            $("#" + divcontainerID).find("#" + $(evt).attr("id") + " #" + tabName + "").show();
        }
        else {
            $(tablinks[i]).removeClass("active");
        }
    }
}

/* Used For removing Control*/
function RemoveControl(control) {
    var fieldid = "";
    var divDataType = $(control).parent().parent().attr("data-type");

    var fieldid = $(control).parent().parent().find(":input").attr("fieldid");
    if (divDataType == "Header" || divDataType == "PageHeader") {
        fieldid = $(control).parent().parent().find("#headerTextdiv").attr("fieldid");
    }
    else if (divDataType == "Radio") {
        fieldid = "";
        $(control).parent().parent().find(":Radio").each(function () {
            if (fieldid.length == 0)
                fieldid = $(this).attr("fieldid");
        });
    }

    //Get control container type
    var containerdatatype = $(control).parents('div .controls').parent().attr("data-type")

    deletedFields += fieldid + ",";
    $(control).parent().parent().remove();

    //Add watermark text and class on control removed grid cell
    if (containerdatatype == "Grid") {
        $(".columncontent").each(function () {
            if ($(this).find(".dropped").length == 0) {
                $(this).addClass("watermark").text("Control Placed");
            }
        })
    }
    //Add watermark text and class on control removed tab
    if (containerdatatype == "Tab") {
        $(".tabcontent").each(function () {
            if ($(this).find(".dropped").length == 0) {
                $(this).addClass("tabcontentitem").text("Control Placed");
            }
        })
  }
    CancelProperties();

  $(".propertyDiv").css("display", "none");
  if ($('#maindiv').children().length === 0) {
    $(".empty-form").show();
    document.getElementById("btnSaveForm").disabled = true;
    document.getElementById("btnSaveAndPublishForm").disabled = true;
  }
}

/*Generating Unique Ids for Control*/
function uuidv4() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

/*Generating template form */
function getfromControlData(className) {
    var controlDataArr = [];
    var controlDataObj = {};
    if (className.match(/sortable/g)) {
        $('.sortable').children().each(function (i) {
            controlDataObj = {
                controlId: $(this).attr('id'),
                controlType: $(this).attr('data-type'),
                controlPosition: i
            };
            controlDataArr.push(controlDataObj);
        });
    }
    else {
        $('.' + className).children().each(function (i) {
            controlDataObj = {
                controlId: $(this).attr('id'),
                controlType: $(this).attr('data-type'),
                controlPosition: i
            };
            controlDataArr.push(controlDataObj);
        });
    }
    return controlDataArr;
}

/*show template form properties*/
function showProperties(controlId) {

  document.getElementById("btnSaveForm").disabled = true;
  document.getElementById("btnSaveAndPublishForm").disabled = true;

    $(".propertyDiv").css("display", "block");
    var selectedControlId = $(controlId).attr('data-id');
    var parentclass = $(controlId).parent().parent().parent().attr("class");
    //for get grid control property
    if (parentclass.toLowerCase().includes('columncontent')) {
        parentclass = "columncontent";
    }
    //for get tab control property
    if (parentclass.toLowerCase().includes('tabcontent')) {
        parentclass = "tabcontent";
    }
    var controlsData = getfromControlData(parentclass);

    //Used for selecting specific control
    var selControl = _.find(controlsData, {
        'controlId': selectedControlId
    });
    $('#hdnSelectedControlType').val(selControl.controlType);
    $('#hdnSelectedControlId').val(selControl.controlId);
    var setData = getControlProperties(selControl.controlType);
    $('#Properties').html(setData);
    populateControlProperties(selectedControlId, selControl.controlType);

}

/*Get control properties*/
function getControlProperties(type) {
    var html = "";
    switch (type) {
        case "TextBox":
            html = getTextBox();
            break;
        case "TextBox-MultiLine":
            html = getTextArea();
            break;
        case "DropDownList":
            html = getDropdown();
            break;
        case "Grid":
            html = getHtmlForGrid();
            break;
        case "Table":
            html = getHtmlForTable();
            break;
        case "ExcelGrid":
            html = getHtmlForExcelGrid();
            break;
        case "Radio":
            html = getRadioButton();
            break;
        case "CheckBox":
            html = getCheckBox();
            break;
        case "Label":
            html = "This is Label";
            break;
        case "PageHeader":
            html = getPageHeader();
            break;
        case "Header":
            html = getHeader();
            break;
        case "Calendar":
            html = getCalendar();
            break;
        case "Button":
            html = getButton();
            break;
        case "Tab":
            html = getTab();
            break;
        case "MultiSelect":
            html = getMultiSelect();
            break;

        default:
            html = "No Control Selected";
            break;
    }
    return html;
}

/*Get HTML for MultiSelect*/
function getMultiSelect() {
    var html = $("#multiSelectPropertiesTemplate").html();
    return html;
}

/*Get HTML for button*/
function getButton() {
    var html = $("#buttonPropertiesTemplate").html();
    return html;
}

/*Get HTML for Dropdown*/
function getDropdown() {

    var html = $("#dropdownPropertiesTemplate").html();
    return html;
}

/*Get HTML for TextBox*/
function getTextBox() {
    var html = $("#textboxPropertiesTemplate").html();
    return html;
}

/*Get HTML for TextArea*/
function getTextArea() {
    var html = $("#textareaPropertiesTemplate").html();
    return html;
}

/*Get HTML for Radio button*/
function getRadioButton() {

    var html = $("#radioPropertiesTemplate").html();
    return html;
}

/*Get HTML for Checkbox*/
function getCheckBox() {

    var html = $("#checkBoxPropertiesTemplate").html();
    return html;
}

/*Get HTML for Page Header*/
function getPageHeader() {

    var html = $("#pageHeaderPropertiesTemplate").html();
    return html;
}

/*Get HTML for Page Header*/
function getHeader() {

    var html = $("#headerPropertiesTemplate").html();
    return html;
}

/*Get HTML for Calendar*/
function getCalendar() {
    var html = $("#CalendarPropertiesTemplate").html();
    return html;
}

/*Get HTML for Tab*/
function getTab() {
    var html = $("#pageTabPropertiesTemplate").html();
    return html;
}

/*Get HTML for Grid*/
function getHtmlForGrid() {
    var html = $("#pageGridPropertiesTemplate").html();
    return html;
}

/*Get HTML for Table*/
function getHtmlForTable() {
    var html = $("#pageTablePropertiesTemplate").html();
    return html;
}

/*Get HTML for ExcelGrid*/
function getHtmlForExcelGrid() {
    var html = $("#pageExcelGridPropertiesTemplate").html();
    return html;
}

/* Get Tempalte Form Json */
function getControlJson(editControl) {
  
    //try {
    var formId = $("#hdnFormId").val();
    var requestURL = window.location.protocol + "//" + window.location.host + "/Template/TemplateJson/" + templateId;

    $.ajax({
        url: requestURL,
        type: 'Get',
        headers: {
            'PyramidTokenHeader': getTokenHeaders()
        },
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        success: function (data) {
          controlJson = jQuery.parseJSON(data.TemplateJson);
          if (editControl === 0) {
            $("#TemplateName").val('');
          } else {

            $("#TemplateName").val(data.TemplateName);
            setTimeout(function() {
                $("#TemplateType").val(data.TemplateTypeId).change();
              },
              2000);
          }
          setTimeout(function () {
              $("#TemplateType").attr('disabled', 'disabled');
              if (data.IsDefault) {
                IsDataDefault = true;
              } else {
                IsDataDefault = false;

              }
              if (data.IsPublished === false) {
                $("#btnSaveForm").attr('title', 'Update unpublished Template');
                $("#btnSaveAndPublishForm").attr('title', 'Update and Publish Template');
              } else {
                $("#btnSaveForm").attr('title', 'Create unpublished Template');
                $("#btnSaveAndPublishForm").attr('title', 'Update published Template');
              }
              loadControls();
             
            }, 2000);
           
          
       
           
         
          
        
         // setTimeout(function () {
           
         // }, 2000);
         
        }
    });

    //}
    //catch (exception) { dispConsoleMessage("getRouteDetails Error " + exception.message); }
}

/* Load Tempalte Form Json for Edit Form*/
function loadControls() {

    if (controlJson.length) {
        formMode = "U";
        $("#maindiv").empty();
        $(".empty-form").show();
       
        $.each(controlJson, function (i, obj) {

            if (obj.divDataType == "TextBox") {
                $("#editTextboxTemplate").tmpl(obj).appendTo("#maindiv");
                if (obj.validate.eventValidation != "")
                    $("#maindiv").find("#" + obj.divId).find("#" + obj.controlId).attr("onkeydown", obj.validate.eventValidation);
            }
            else if (obj.divDataType == "CheckBox")
                $("#editCheckBoxTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "Radio")
                $("#editRadioTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "DropDownList")
                $("#editDropDownListTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "Calendar")
                $("#editCalendarTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "Header")
                $("#editHeaderTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "TextBox-MultiLine") {
                $("#editTextAreaTemplate").tmpl(obj).appendTo("#maindiv");
                if (obj.validate.eventValidation != "")
                    $("#maindiv").find("#" + obj.divId).find("#" + obj.controlId).attr("onkeydown", obj.validate.eventValidation);
            }
            else if (obj.divDataType == "MultiSelect")
                $("#editMultiSelectTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "PageHeader")
                $("#editPageHeaderTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "Button")
                $("#editButtonTemplate").tmpl(obj).appendTo("#maindiv");
            else if (obj.divDataType == "Tab")
                RenderTabControl(obj)
            else if (obj.divDataType == "Grid")
                RenderGridControl(obj);
            else if (obj.divDataType == "Table")
                RenderTableControl(obj);
            else if (obj.divDataType == "ExcelGrid")
                RenderExcelGridControl(obj);
        });

        $("#maindiv").find(":input").on("cut copy paste keydown", function (e) {
            e.preventDefault();
        });

        $(".tabcontent").addClass("droppable");
        if ($(".columncontent").parents("div .controls").parent().attr("data-type") == "Grid")
            $(".columncontent").addClass("droppable");

        $("#controiList").find('[data-type]').each(function () {
            //alert($("#maindiv").find('[data-type='+$(this).attr("data-type")+']').length);
            var count = $("#maindiv").find('[data-type=' + $(this).attr("data-type") + ']').length;
            if (count > 0) {
                //alert($(this).find(":input").attr("id"));
                //var id = $(this).find(":input").attr("id");

                var id = typeof ($(this).find(":input").attr("id")) == 'undefined' ? $(this).find("div.controls div:first").attr("id") : $(this).find(":input").attr("id");
                id = id.split("-").slice(0, -1).join("-") + "-" +
                    (parseInt(id.split("-").slice(-1)[0]) + count);

                while ($("#maindiv input[name=" + id + "]").length != 0) {
                    id = id.split("-").slice(0, -1).join("-") + "-" +
                    (parseInt(id.split("-").slice(-1)[0]) + 1);
                }

                if ($.inArray(id.split('-')[0], ContainerArray) > 0) {
                    while ($("#maindiv").find(".controls").find("div:first[id=" + id + "]").length != 0) {
                        id = id.split("-").slice(0, -1).join("-") + "-" +
                        (parseInt(id.split("-").slice(-1)[0]) + 1);
                    }
                }

                $(id).length;
                $("#maindiv").find(id).length;
                $("#maindiv input[name=" + id + "]").length;
                $(this).find(":input").attr("id", id);
                $(this).find(":input").attr("name", id);
                $(this).find("label").attr("for", id);
                if (typeof (id) != 'undefined')
                    $(this).find("div.controls div:first").attr("id", id)[0];
            }
        });
    }
}

/*Render tab control*/
function RenderTabControl(obj) {
    $("#editTabTemplate").tmpl(obj).appendTo("#maindiv");

    $.each(obj.options.option, function (j, objNestedTab) {

        if (objNestedTab.ContentItem.length > 0) {

            $.each(objNestedTab.ContentItem, function (k, objNestedTabContrl) {

                if (objNestedTabContrl.divDataType == "TextBox") {
                    $("#editTextboxTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                    $("#" + obj.divId).find("#" + objNestedTab.contentId).find("#" + objNestedTabContrl.divId).find("#" + objNestedTabContrl.controlId).attr("onkeydown", objNestedTabContrl.validate.eventValidation);
                }
                else if (objNestedTabContrl.divDataType == "CheckBox")
                    $("#editCheckBoxTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                else if (objNestedTabContrl.divDataType == "Radio")
                    $("#editRadioTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                else if (objNestedTabContrl.divDataType == "DropDownList")
                    $("#editDropDownListTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                else if (objNestedTabContrl.divDataType == "MultiSelect")
                    $("#editMultiSelectTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                else if (objNestedTabContrl.divDataType == "Calendar")
                    $("#editCalendarTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                else if (objNestedTabContrl.divDataType == "Header")
                    $("#editHeaderTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                else if (objNestedTabContrl.divDataType == "TextBox-MultiLine") {
                    $("#editTextAreaTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                    $("#" + obj.divId).find("#" + objNestedTab.contentId).find("#" + objNestedTabContrl.divId).find("#" + objNestedTabContrl.controlId).attr("onkeydown", objNestedTabContrl.validate.eventValidation);
                }
                else if (objNestedTabContrl.divDataType == "PageHeader")
                    $("#editPageHeaderTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                else if (objNestedTabContrl.divDataType == "Button")
                    $("#editButtonTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                else if (objNestedTabContrl.divDataType == "Table") {

                    $("#editTableTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));

                    $.each(objNestedTabContrl.options.option, function (k, objNestedTabContrlTableRow) {
                        $("<tr id=" + objNestedTabContrlTableRow.rowId + "></tr>").appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId).find("#" + objNestedTabContrl.divId).find("#" + objNestedTabContrl.divContainerId + " tbody"));

                        $.each(objNestedTabContrlTableRow.rowItem, function (r, objNestedTabContrlTableRowval) {

                            if (k == 0) {
                                $("<th class='columnheadercontent' id=" + objNestedTabContrlTableRowval.rowCellId + " style='background-color:lightgray'>" + objNestedTabContrlTableRowval.rowCellValue + "</th>").appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId).find("#" + objNestedTabContrl.divId).find("#" + objNestedTabContrl.divContainerId + " tbody " + "tr#" + objNestedTabContrlTableRow.rowId));
                            }
                            else {
                                $("<td id=" + objNestedTabContrlTableRowval.rowCellId + " class='rowcontent'><textarea class='form-control textareaTableContent' rows='1' cols='4' placeholder='Enter text'>" + objNestedTabContrlTableRowval.rowCellValue + "</textarea></td>").appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId).find("#" + objNestedTabContrl.divId).find("#" + objNestedTabContrl.divContainerId + " tbody " + "tr#" + objNestedTabContrlTableRow.rowId));
                            }
                        });
                    });
                }
                else if (objNestedTabContrl.divDataType == "ExcelGrid") {
                    $("#editExcelGridTemplate").tmpl(objNestedTabContrl).appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId));
                    $.each(objNestedTabContrl.options.option, function (k, objNestedTabContrlExcelGridRow) {
                        $("<tr id=" + objNestedTabContrlExcelGridRow.rowId + "></tr>").appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId).find("#" + objNestedTabContrl.divId).find("#" + objNestedTabContrl.divContainerId + " tbody"));

                        $.each(objNestedTabContrlExcelGridRow.rowItem, function (r, objNestedTabContrlExcelGridRowval) {

                            if (k == 0) {
                                $("<th class='columnheaderexcelcontent' id=" + objNestedTabContrlExcelGridRowval.rowCellId + " columnType=" + objNestedTabContrlExcelGridRowval.columnType + " columnSource=" + objNestedTabContrlExcelGridRowval.columnSource + " style='background-color:lightgray'>" + objNestedTabContrlExcelGridRowval.rowCellValue + "</th>").appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId).find("#" + objNestedTabContrl.divId).find("#" + objNestedTabContrl.divContainerId + " tbody " + "tr#" + objNestedTabContrlExcelGridRow.rowId));
                            }
                            else {
                                $("<td id=" + objNestedTabContrlExcelGridRowval.rowCellId + " class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'>" + objNestedTabContrlExcelGridRowval.rowCellValue + "</textarea></td>").appendTo($("#" + obj.divId).find("#" + objNestedTab.contentId).find("#" + objNestedTabContrl.divId).find("#" + objNestedTabContrl.divContainerId + " tbody " + "tr#" + objNestedTabContrlExcelGridRow.rowId));
                            }
                        });

                    });
                }
            });
        }
        else {
            $("#" + obj.divId).find("#" + objNestedTab.contentId).addClass("tabcontentitem").text("Control Placed");
        }

    });

    $("#" + obj.divId).find("#" + obj.divContainerId).find(".tab .tablinks:first").trigger('click');
}

/*Render Grid control*/
function RenderGridControl(obj) {
    $("#editGridTemplate").tmpl(obj).appendTo("#maindiv");
    $.each(obj.options.option, function (l, objNestedGrid) {
        $("<tr id=" + objNestedGrid.rowId + "></tr>").appendTo("#" + obj.divContainerId + " tbody");

        $.each(objNestedGrid.rowCellContent, function (m, objNestedGridContrl) {

            $("<td id=" + objNestedGridContrl.cellContainerId + " class='columncontent'></td>").appendTo("#" + obj.divContainerId + " tbody " + "tr#" + objNestedGrid.rowId);

            //check the table cell have any control or not
            //if (objNestedGridContrl.cellContainerItem.length > 0) {
            if (objNestedGridContrl.cellContainerItem != null) {

                //$.each(objNestedGridContrl.cellContainerItem, function (m, objNestedGridInnerContrl) {

                if (objNestedGridContrl.cellContainerItem.divDataType == "TextBox") {
                    $("#editTextboxTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                    $("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId).find("#" + objNestedGridContrl.cellContainerItem.divId).find("#" + objNestedGridContrl.cellContainerItem.controlId).attr("onkeydown", objNestedGridContrl.cellContainerItem.validate.eventValidation);
                }
                else if (objNestedGridContrl.cellContainerItem.divDataType == "CheckBox")
                    $("#editCheckBoxTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                else if (objNestedGridContrl.cellContainerItem.divDataType == "Radio")
                    $("#editRadioTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                else if (objNestedGridContrl.cellContainerItem.divDataType == "DropDownList")
                    $("#editDropDownListTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                else if (objNestedGridContrl.cellContainerItem.divDataType == "MultiSelect")
                    $("#editMultiSelectTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                else if (objNestedGridContrl.cellContainerItem.divDataType == "Calendar")
                    $("#editCalendarTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                else if (objNestedGridContrl.cellContainerItem.divDataType == "Header")
                    $("#editHeaderTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                else if (objNestedGridContrl.cellContainerItem.divDataType == "TextBox-MultiLine") {
                    $("#editTextAreaTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                    $("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId).find("#" + objNestedGridContrl.cellContainerItem.divId).find("#" + objNestedGridContrl.cellContainerItem.controlId).attr("onkeydown", objNestedGridContrl.cellContainerItem.validate.eventValidation);
                }
                else if (objNestedGridContrl.cellContainerItem.divDataType == "PageHeader")
                    $("#editPageHeaderTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                else if (objNestedGridContrl.cellContainerItem.divDataType == "Button")
                    $("#editButtonTemplate").tmpl(objNestedGridContrl.cellContainerItem).appendTo("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId);
                //});
            }
            else {
                $("#" + obj.divId + " #" + obj.divContainerId + " tr " + "td#" + objNestedGridContrl.cellContainerId).addClass("watermark").text("Control Placed");
            }
        });
    });
}

/*Render Table control*/
function RenderTableControl(obj) {
    $("#editTableTemplate").tmpl(obj).appendTo("#maindiv");
    $.each(obj.options.option, function (t, objNestedTable) {
        $("<tr id=" + objNestedTable.rowId + "></tr>").appendTo("#" + obj.divContainerId + " tbody");
        $.each(objNestedTable.rowItem, function (r, objNestedTableContrl) {

            if (t == 0) {
                $("<th class='columnheadercontent' id=" + objNestedTableContrl.rowCellId + " style='background-color:lightgray'>" + objNestedTableContrl.rowCellValue + "</th>").appendTo("#" + obj.divContainerId + " tbody " + "tr#" + objNestedTable.rowId);
            }
            else {
                $("<td id=" + objNestedTableContrl.rowCellId + " class='rowcontent'><textarea class='form-control textareaTableContent' rows='1' cols='4' placeholder='Enter text'>" + objNestedTableContrl.rowCellValue + "</textarea></td>").appendTo("#" + obj.divContainerId + " tbody " + "tr#" + objNestedTable.rowId);
            }
        });


    });
}

/*Render excel Grid control*/
function RenderExcelGridControl(obj) {

    $("#editExcelGridTemplate").tmpl(obj).appendTo("#maindiv");
    $.each(obj.options.option, function (t, objNestedTable) {
        $("<tr id=" + objNestedTable.rowId + "></tr>").appendTo("#" + obj.divContainerId + " tbody");
        $.each(objNestedTable.rowItem, function (r, objNestedTableContrl) {

            if (t == 0) {
                $("<th class='columnheaderexcelcontent' id=" + objNestedTableContrl.rowCellId + " columnType=" + objNestedTableContrl.columnType + " columnSource=" + objNestedTableContrl.columnSource + "  style='background-color:lightgray'>" + objNestedTableContrl.rowCellValue + "</th>").appendTo("#" + obj.divContainerId + " tbody " + "tr#" + objNestedTable.rowId);
            }
            else {
                $("<td id=" + objNestedTableContrl.rowCellId + " class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'>" + objNestedTableContrl.rowCellValue + "</textarea></td>").appendTo("#" + obj.divContainerId + " tbody " + "tr#" + objNestedTable.rowId);
            }
        });
    });
}

/* show Auto fill container*/
function showAutoFillContainer(element) {
    var seletedDataType = $(element).val();
    var divAutofillSection = $("#divAutofillSection");
    if (seletedDataType !== "Select") {
        divAutofillSection.show();
    } else {
        divAutofillSection.hide();
    }
}

/* Set Properties for control*/
function SetProperties(element) {

    var sControlId = $('#hdnSelectedControlId').val();
    var sControlType = $("#hdnSelectedControlType").val();
    var LabelText = $("#Properties").find('.LabelText').length ? $("#Properties").find('.LabelText').val().trim() : "";
    var chkShowLabel = $("#Properties").find('#chkShowLabel').length ? $("#Properties").find('#chkShowLabel').is(':checked') : false;
    var ControlName = $("#Properties").find('.ControlName').length ? $("#Properties").find('.ControlName').val().trim() : "";
    var ButtonName = $("#Properties").find('.ButtonName').length ? $("#Properties").find('.ButtonName').val().trim()  : "";
    var ButtonControlName = $("#Properties").find('.ButtonControlName').length ? $("#Properties").find('.ButtonControlName').val().trim()  : "";
      var TextBoxPlaceholder = $("#Properties").find('.TextBoxPlaceholder').length ? $("#Properties").find('.TextBoxPlaceholder').val().trim() : "";
    var MaxLength = $("#Properties").find('.MaxLength').length ? $("#Properties").find('.MaxLength').val() : "";
    var ControlWidth = $("#Properties").find('.ControlWidth').length ? $("#Properties").find('.ControlWidth').val().trim() : "";
    var chkRequired = $("#Properties").find('#chkRequired').length ? $("#Properties").find('#chkRequired').is(':checked') : false;
    var chkDisabled = $("#Properties").find('#chkDisabled').length ? $("#Properties").find('#chkDisabled').is(':checked') : false;
    var chkAutoGenerated = $("#Properties").find('#chkAutoGenerated').length ? $("#Properties").find('#chkAutoGenerated').is(':checked') : false;
    var AutoGeneratedVal = $("#Properties").find('.autoGeneratedVal').length ? $("#Properties").find('.autoGeneratedVal').val() : "";
    var AutoGeneratedValDig = $("#Properties").find('.autoGeneratedValDig').length ? $("#Properties").find('.autoGeneratedValDig').val() : "";
    var DataType = $("#Properties").find('.DataType').length ? $("#Properties").find('.DataType').val() : "";
    var MinValue = $("#Properties").find('.MinValue').length ? $("#Properties").find('.MinValue').val() : "";
    var MaxValue = $("#Properties").find('.MaxValue').length ? $("#Properties").find('.MaxValue').val() : "";
    var SectionName = $("#Properties").find('.SectionName').length ? $("#Properties").find('.SectionName').val().trim() : "";
    var Tooltip = $("#Properties").find('.Tooltip').length ? $("#Properties").find('.Tooltip').val().trim() : "";
    var DataFormat = $("#Properties").find('.DataFormat').length ? $("#Properties").find('.DataFormat').val().trim() : "";
    var Precisiondigit = $("#Properties").find('.Precisiondigit').length ? $("#Properties").find('.Precisiondigit').val() : "";
    var chkAutofill = $("#Properties").find('#chkAutofill').length ? $("#Properties").find('#chkAutofill').is(':checked') : false;
 
    

    var patternval, eventval, optionOrder;
    var exit = false;
    LabelText = LabelText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    ControlName = ControlName.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\\\$&");
    $("#maindiv input[id=" + ControlName + "]").each(function () {
         if (sControlId != $(this).closest('.dropped').attr('id')) {
            exit = true;
            $("#Properties").find('.ControlName').attr("style", "border:1px solid #f10c0c");
            $("#Properties").find('.ControlName').attr("title", "Control with the same name already exists");
        }
    });

  ButtonName = ButtonName.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, "\\\\$&");
  ButtonControlName = ButtonControlName.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^` {|}~]/g, "a");
  $("#maindiv input[id=" + ButtonControlName + "]").each(function () {
        if (sControlId != $(this).closest('.dropped').attr('id')) {
            exit = true;
          $("#Properties").find('.ButtonControlName').attr("style", "border:1px solid #f10c0c");
          $("#Properties").find('.ButtonControlName').attr("title", "Button with the same name already exists");
        }
    });
    if (exit)
        return false;
  if (chkAutofill) {
    MaxLength = 0;
    MinValue = 0;
    MaxValue = 0;
    Precisiondigit = 0;
    var AutoFillDbType = $("#ddlDbType").val();
    var AutoFillServer = $("#txtServerName").val().trim();
    var AutoFillAuthMode = $("input[name='rblAuthenticationMode']:checked").val();
    var AutoFillUserName = $("#txtUserName").val().trim();
    var AutoFillPassword = $("#txtPassword").val().trim();
    var AutoFillPort = $("#txtPort").val().trim();
    var AutoFillDatabase = $("#ddlDatabase").val();
    var AutoFillTable = $("#ddlTablesList").val();
    var AutoFillTableColumn = $("#ddlColumn").val()
    var AutoFillSqlQuery = $("#txtSqlQuery").val().trim();
    var AutoFillValue = $("#txtColValues").val();

    if (AutoFillServer.trim().length === 0) {
      $("#txtServerName").attr("style", "border:1px solid #f10c0c");
      return false;
    }
    else
      $("#txtServerName").css("border", "");

    if (AutoFillDbType != "SQL") {
      if (AutoFillPort.trim().length === 0) {
        $("#txtPort").attr("style", "border:1px solid #f10c0c");
        return false;
      }
      else
        $("#txtPort").css("border", "");
    }

    if ((AutoFillDbType === "SQL") && (AutoFillAuthMode === "Windows")) {

    }
    else {
      if (AutoFillUserName.trim().length === 0) {
        $("#txtUserName").attr("style", "border:1px solid #f10c0c");
        return false;
      }
      else
        $("#txtUserName").css("border", "");

      if (AutoFillPassword.trim().length === 0) {
        $("#txtPassword").attr("style", "border:1px solid #f10c0c");
        return false;
      }
      else
        $("#txtPassword").css("border", "");
    }

    if (AutoFillDatabase.trim() == "Select") {
      $("#ddlDatabase").attr("style", "border:1px solid #f10c0c");
      return false;
    }
    else
      $("#ddlDatabase").css("border", "");

    if ($("input[name='rblTableSql']:checked").val() === "Table") {
      if (AutoFillTable.trim() == "Select") {
        $("#ddlTablesList").attr("style", "border:1px solid #f10c0c");
        return false;
      }
      else
        $("#ddlTablesList").css("border", "");

      if (AutoFillTableColumn.trim() == "Select") {
        $("#ddlColumn").attr("style", "border:1px solid #f10c0c");
        return false;
      }
      else
        $("#ddlColumn").css("border", "");
    }
    else {
      if (AutoFillSqlQuery.trim().length === 0) {
        $("#txtSqlQuery").attr("style", "border:1px solid #f10c0c");
        return false;
      }
      else
        $("#txtSqlQuery").css("border", "");
    }

    if ((chkAutofill) && (sControlType != "CheckBox") && (sControlType != "Radio"))
      $("#" + sControlId).find(":input").attr("chkAutofill", chkAutofill);
    else
      $("#" + sControlId).find(":input").removeAttr("chkAutofill");

    if (AutoFillDbType != null)
      $("#" + sControlId).find(":input").attr("AutoFillDbType", AutoFillDbType);
    else
      $("#" + sControlId).find(":input").removeAttr("AutoFillDbType");

    if (AutoFillServer != null)
      $("#" + sControlId).find(":input").attr("AutoFillServer", AutoFillServer);
    else
      $("#" + sControlId).find(":input").removeAttr("AutoFillServer");

    if ((AutoFillAuthMode == null) || (AutoFillAuthMode == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillAuthMode");
    else
      $("#" + sControlId).find(":input").attr("AutoFillAuthMode", AutoFillAuthMode);

    if ((AutoFillUserName == null) || (AutoFillUserName == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillUserName");
    else
      $("#" + sControlId).find(":input").attr("AutoFillUserName", AutoFillUserName);

    if ((AutoFillPassword == null) || (AutoFillPassword == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillPassword");
    else
      $("#" + sControlId).find(":input").attr("AutoFillPassword", AutoFillPassword);

    if ((AutoFillPort == null) || (AutoFillPort == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillPort");
    else
      $("#" + sControlId).find(":input").attr("AutoFillPort", AutoFillPort);

    if ((AutoFillDatabase == null) || (AutoFillDatabase == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillDatabase");
    else
      $("#" + sControlId).find(":input").attr("AutoFillDatabase", AutoFillDatabase);

    if ((AutoFillTable == null) || (AutoFillTable == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillTable");
    else
      $("#" + sControlId).find(":input").attr("AutoFillTable", AutoFillTable);

    if ((AutoFillTable == null) || (AutoFillTable == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillTableColumn");
    else
      $("#" + sControlId).find(":input").attr("AutoFillTableColumn", AutoFillTableColumn);

    if ((AutoFillSqlQuery == null) || (AutoFillSqlQuery == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillSqlQuery");
    else
      $("#" + sControlId).find(":input").attr("AutoFillSqlQuery", AutoFillSqlQuery);

    if ((AutoFillValue == null) || (AutoFillValue == ""))
      $("#" + sControlId).find(":input").removeAttr("AutoFillValue");
    else
      $("#" + sControlId).find(":input").attr("AutoFillValue", AutoFillValue);

  }
  else {
    $("#" + sControlId).find(":input").removeAttr("chkAutofill");
    $("#" + sControlId).find(":input").removeAttr("AutoFillDbType");
    $("#" + sControlId).find(":input").removeAttr("AutoFillServer");
    $("#" + sControlId).find(":input").removeAttr("AutoFillAuthMode");
    $("#" + sControlId).find(":input").removeAttr("AutoFillUserName");
    $("#" + sControlId).find(":input").removeAttr("AutoFillPassword");
    $("#" + sControlId).find(":input").removeAttr("AutoFillPort");
    $("#" + sControlId).find(":input").removeAttr("AutoFillDatabase");
    $("#" + sControlId).find(":input").removeAttr("AutoFillTable");
    $("#" + sControlId).find(":input").removeAttr("AutoFillTableColumn");
    $("#" + sControlId).find(":input").removeAttr("AutoFillSqlQuery");
    $("#" + sControlId).find(":input").removeAttr("AutoFillValue");
  }
    //Validate for no of autogenerated control
  if (chkAutoGenerated) {
    MaxLength = 0;
      $("#Properties").find('.minmaxcontrol').hide();
      $("#Properties").find("#dvErrorAutogenerated").css("display", "none");
      $("#Properties").find("#dvErrorAutogeneratedDig").css("display", "none");
      if (sControlType == "TextBox") {

        if (($("#maindiv input[type=text][isautogenerated=true]").length > 0) &&
          (ControlName != $("#maindiv input[type=text][isautogenerated=true]").attr("id"))) {
          $("#Properties").find("#dvErrorAutogenerated").css("display", "block");
          $("#Properties").find("#dvErrorAutogenerated")
            .text("Only one auto generated control is allowed in template.");
          return false;
        }


        if (AutoGeneratedValDig.length < 1) {
          $("#Properties").find("#dvErrorAutogeneratedDig").css("display", "block");
          $("#Properties").find("#dvErrorAutogeneratedDig").text("Please enter minimum length");
          return false;
        } else {
          if (AutoGeneratedValDig > 15) {
            $("#Properties").find("#dvErrorAutogeneratedDig").css("display", "block");
            $("#Properties").find("#dvErrorAutogeneratedDig").text("Minimum length cannot be greater than 15");
            return false;
          }
        }
      }
    }


    //Validate Template form Properties for label
  var IsValidformLabelProperty = ValidateControlLabelProperties(LabelText, sControlType, ControlName, chkRequired);
    if (!IsValidformLabelProperty)
        return false;

    //validate for button Name
    if (sControlType == "Button") {
        $("#Properties").find("#dvbuttonname").css("display", "none");
      if (ButtonControlName.length == 0) {
            $("#Properties").find("#dvbuttonname").css("display", "block");
            $("#Properties").find("#dvbuttonname").text("Button name can not be left blank.");
            return false;
      }
      //$("#Properties").find("#dvbuttontooltip").css("display", "none");
      //if (Tooltip.length == 0) {
      //  $("#Properties").find("#dvbuttontooltip").css("display", "block");
      //  $("#Properties").find("#dvbuttontooltip").text("Tooltip can not be left blank.");
      //    return false;
      //  }
    }

    //Validate min value less then max value if selecetd numeric datatype
    if (MinValue != "" && MaxValue != "")
        if (DataType == "Numeric") {

            $("#Properties").find("#dvminmaxvalue").css("display", "none");
            if (parseFloat(MinValue) > parseFloat(MaxValue)) {
                $("#Properties").find("#dvminmaxvalue").css("display", "block");
                $("#Properties").find("#dvminmaxvalue").text("Minimum value should be less then maximum value.");
                return false;
            }
    }
  if (sControlType == "Calendar") {
    var isValidDate = true;
      if (MinValue != "" ) {
         isValidDate = validateDate(MinValue);
        if (isValidDate === false) {
          $("#Properties").find("#dvStartEndDate").css("display", "block");
          $("#Properties").find("#dvStartEndDate").text("Start date should be in MM/dd/YYYY format.");
          return false;
        }
      
      }
      if (MaxValue != "") {
         isValidDate = validateDate(MaxValue);
        if (isValidDate === false) {
          $("#Properties").find("#dvStartEndDate").css("display", "block");
          $("#Properties").find("#dvStartEndDate").text("End date should be in MM/dd/YYYY format.");
          return false;

        }
      }
    }
   

    
    //Validate start and end date in calendar control
    if (MinValue != "" && MaxValue != "")
        if (sControlType == "Calendar") {
            var startDate = new Date(MinValue);
            var endDate = new Date(MaxValue);
            $("#Properties").find("#dvStartEndDate").css("display", "none");
            if (startDate > endDate) {
                $("#Properties").find("#dvStartEndDate").css("display", "block");
                $("#Properties").find("#dvStartEndDate").text("Start date should be less then end date.");
                return false;
            }
        }
    ////Validate Template form List Option value
   var tabID=$("#" + sControlId).find(".controls div").attr("id");
   var IsValidformListOptionText = ValidateOptionValueinControls(sControlType, tabID);
    if (!IsValidformListOptionText)
        return false;
    //Validate Template form Properties for Placeholder
    var IsValidformPlaceHolderProperty = ValidateControlPlaceholderProperties(TextBoxPlaceholder, sControlType);
    if (!IsValidformPlaceHolderProperty)
        return false;
    //validate grid
    if (sControlType == "Grid") {
        var IsValidGrid = validateGrid(sControlType);
        if (!IsValidGrid)
            return false;
    }


    //----------------------->
    if  ($("#" + sControlId).find("label").length > 1) {
        $("#" + sControlId).find("label")["1"].innerHTML = LabelText;
    }

    if (ControlName.length > 0) {
        //$("#" + sControlId).find("label")["0"].innerHTML = ControlName + " :";
        $("#" + sControlId).find(":input").attr("id", ControlName);
        $("#" + sControlId).find(":input").attr("name", ControlName);
    }

    if (sControlType != "Tab") {
        if (TextBoxPlaceholder.length > 0)
            $("#" + sControlId).find(":input").attr("placeholder", TextBoxPlaceholder);
        else
            $("#" + sControlId).find(":input").removeAttr("placeholder");


        if (Tooltip.length > 0)
            $("#" + sControlId).find(":input").attr("title", Tooltip);
        else
            $("#" + sControlId).find(":input").removeAttr("title");

        if (DataFormat.length > 0)
            $("#" + sControlId).find(":input").attr("dataformat", DataFormat);
        else
            $("#" + sControlId).find(":input").removeAttr("dataformat");

        if (MaxLength > 0)
            $("#" + sControlId).find(":input").attr("maxlength", MaxLength);
        else
            $("#" + sControlId).find(":input").removeAttr("maxlength");

        if (ControlWidth > 0)
            $("#" + sControlId).find(":input").attr("style", "width:" + ControlWidth + "px");
        else
            $("#" + sControlId).find(":input").css("width", "");

        if (chkRequired)
            $("#" + sControlId).find(":input").attr("isrequired", chkRequired);
        else
        $("#" + sControlId).find(":input").removeAttr("isrequired");

      if (chkShowLabel)
        $("#" + sControlId).find(":input").attr("isshowlabel", chkShowLabel);
        else
        $("#" + sControlId).find(":input").removeAttr("isshowlabel");

        

        if (chkDisabled)
            $("#" + sControlId).find(":input").attr("isDisabled", chkDisabled);
        else
            $("#" + sControlId).find(":input").removeAttr("isDisabled");

        if (chkAutoGenerated) {
            $("#" + sControlId).find(":input").attr("isAutoGenerated", chkAutoGenerated);
          if (DataType == "Numeric") {
            $("#" + sControlId).find(":input").removeAttr("autoGeneratedVal");
          } else {
            if (AutoGeneratedVal.length > 0)
              $("#" + sControlId).find(":input").attr("autoGeneratedVal", AutoGeneratedVal);
            else
              $("#" + sControlId).find(":input").removeAttr("autoGeneratedVal");
          }
           

            if (AutoGeneratedValDig.length > 0)
              $("#" + sControlId).find(":input").attr("autoGeneratedValDig", AutoGeneratedValDig);
            else
              $("#" + sControlId).find(":input").removeAttr("autoGeneratedValDig");
        }
        else
            $("#" + sControlId).find(":input").removeAttr("isAutoGenerated");
        
        if (DataType.length > 0) {
            $("#" + sControlId).find(":input").attr("DataType", DataType);
            SetDataTypeinFormAddMode(sControlId, DataType);
        }
        else
            $("#" + sControlId).find(":input").removeAttr("DataType");

        if (MinValue.length > 0)
            $("#" + sControlId).find(":input").attr("min", MinValue);
        else
            $("#" + sControlId).find(":input").removeAttr("min");

        if (MaxValue.length > 0)
            $("#" + sControlId).find(":input").attr("max", MaxValue);
        else
            $("#" + sControlId).find(":input").removeAttr("max");

        if (Precisiondigit.length > 0)
            $("#" + sControlId).find(":input").attr("Precisiondigit", Precisiondigit);
        else
            $("#" + sControlId).find(":input").removeAttr("Precisiondigit");

        if (SectionName.length > 0)
            $("#" + sControlId).find(":input").attr("SectionName", SectionName);
        else
            $("#" + sControlId).find(":input").removeAttr("SectionName");
    }

    //Added validation pattern attributes
    var optionFormat = "";
    if (DataType.length > 0) {
      if (DataType == "Alpha") {
        patternval = alphaPattren;
        optionFormat = new RegExp('^[a-zA-Z ]*$');
      }
      else if (DataType == "AlphaNumeric") {
        patternval = alphanumericPattern;
        optionFormat = new RegExp('^(?!\\s*$)[a-zA-Z [a-zA-Z0-9\-\_\.]+$');
      }
      else if (DataType == "Numeric") {
        patternval = numericWithDecialPointPattern;
        //optionFormat = new RegExp('/^[0-9]+\.?[0-9]*$/');
        optionFormat = /^[0-9]+([,.][0-9]+)?$/g;
      }
      else if (DataType == "FreeText") {
        patternval = alphanumericWithSecialCharPattern;
        optionFormat = new RegExp('^(?!\\s*$)[ a-zA-Z0-9\b_@./#&+-]+$');
      }
      else if (DataType == "Date") {
        patternval = "dd/mm/yyyy";
       }
  }
  if (sControlType === "DropDownList")
  {
    optionOrder=$("input[name='rdbDdl']:checked").val();
  }
  if (sControlType === "MultiSelect") {
    optionOrder = $("input[name='rdbMSel']:checked").val();
  }
 
  if ((sControlType === "CheckBox") ||
    (sControlType === "DropDownList") ||
    (sControlType === "Radio") ||
    (sControlType === "MultiSelect")) {
    var errorFlagOption = true;

    if (!chkAutofill) {
       $("#Properties").find('.option-value').each(function () {
        var option = this.value.trim();

        if ((option.length > 0)) {
          if (DataType === "Numeric") {
            if (isNaN(option)) {
              errorFlagOption = false;
              return false;
            }
          } else {
            if (!optionFormat.test(option)) {
              errorFlagOption = false;
              return false;
            }
          }

        }
      });

      if (errorFlagOption === false) {
        alert("Value in option is not in correct format");
        return false;
      }
    }
   
  }
  
  if (sControlType == "CheckBox") {
    var divcontrols = $("#" + sControlId).find(".controls");
    divcontrols.empty();
    if (chkAutofill) {
      patternval = alphanumericPattern;

      $("#ddlColValues").find("option").each(function () {
        var option = this.value.trim();
        var selecetd = $(this).next().next().is(':checked');
        if (option.length > 0) {
          if (chkRequired)
            if (selecetd) {

              divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="CheckBox" name="' + ControlName + '" id="' + ControlName + '" value="' + option + '" maxlength="50" chkAutofill="' + chkAutofill +'" AutoFillDbType="' + AutoFillDbType + '" AutoFillServer="' + AutoFillServer + '" AutoFillAuthMode="' + AutoFillAuthMode + '" AutoFillUserName="' + AutoFillUserName + '" AutoFillPassword="' + AutoFillPassword + '" AutoFillPort="' + AutoFillPort + '" AutoFillDatabase="' + AutoFillDatabase + '" AutoFillTable="' + AutoFillTable + '" AutoFillTableColumn="' + AutoFillTableColumn + '" AutoFillSqlQuery="' + AutoFillSqlQuery + '"  pattern="' + patternval + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" isrequired="true"  checked>' + option + '</label>');
            }
            else {
              divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="CheckBox" name="' + ControlName + '" id="' + ControlName + '" value="' + option + '" maxlength="50" chkAutofill="' + chkAutofill +'" AutoFillDbType="' + AutoFillDbType + '" AutoFillServer="' + AutoFillServer + '" AutoFillAuthMode="' + AutoFillAuthMode + '" AutoFillUserName="' + AutoFillUserName + '" AutoFillPassword="' + AutoFillPassword + '" AutoFillPort="' + AutoFillPort + '" AutoFillDatabase="' + AutoFillDatabase + '" AutoFillTable="' + AutoFillTable + '" AutoFillTableColumn="' + AutoFillTableColumn + '" AutoFillSqlQuery="' + AutoFillSqlQuery + '"  pattern="' + patternval + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" isrequired="true">' + option + '</label>');
            }
          else
            if (selecetd) {
              divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="CheckBox" name="' + ControlName + '" id="' + ControlName + '" value="' + option + '" maxlength="50" chkAutofill="' + chkAutofill +'" AutoFillDbType="' + AutoFillDbType + '" AutoFillServer="' + AutoFillServer + '" AutoFillAuthMode="' + AutoFillAuthMode + '" AutoFillUserName="' + AutoFillUserName + '" AutoFillPassword="' + AutoFillPassword + '" AutoFillPort="' + AutoFillPort + '" AutoFillDatabase="' + AutoFillDatabase + '" AutoFillTable="' + AutoFillTable + '" AutoFillTableColumn="' + AutoFillTableColumn + '" AutoFillSqlQuery="' + AutoFillSqlQuery + '"  pattern="' + patternval + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" checked>' + option + '</label>');
            }
            else {
              divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="CheckBox" name="' + ControlName + '" id="' + ControlName + '" value="' + option + '" maxlength="50" chkAutofill="' + chkAutofill +'" AutoFillDbType="' + AutoFillDbType + '" AutoFillServer="' + AutoFillServer + '" AutoFillAuthMode="' + AutoFillAuthMode + '" AutoFillUserName="' + AutoFillUserName + '" AutoFillPassword="' + AutoFillPassword + '" AutoFillPort="' + AutoFillPort + '" AutoFillDatabase="' + AutoFillDatabase + '" AutoFillTable="' + AutoFillTable + '" AutoFillTableColumn="' + AutoFillTableColumn + '" AutoFillSqlQuery="' + AutoFillSqlQuery + '"  pattern="' + patternval + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '"  >' + option + '</label>');
            }
        }
       
      });


    }
    else {
    $("#Properties").find('.option-value').each(function () {

      var option = this.value.trim();
      var selecetd = $(this).next().next().is(':checked');
      if (option.length > 0) {
        if (chkRequired)
          if (selecetd) {

            divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="CheckBox" name="' + ControlName + '" id="' + ControlName + '" value="' + option + '" maxlength="50" pattern="' + patternval + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" isrequired="true"  checked>' + option + '</label>');
          }
          else {
            divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="CheckBox" name="' + ControlName + '" id="' + ControlName + '" value="' + option + '" maxlength="50" pattern="' + patternval + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" isrequired="true">' + option + '</label>');
          }
        else
          if (selecetd) {
            divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="CheckBox" name="' + ControlName + '" id="' + ControlName + '" value="' + option + '" maxlength="50" pattern="' + patternval + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" checked>' + option + '</label>');
          }
          else {
            divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="CheckBox" name="' + ControlName + '" id="' + ControlName + '" value="' + option + '" maxlength="50" pattern="' + patternval + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '"  >' + option + '</label>');
          }
      }
    });
  }
        if (Tooltip.length > 0)
            $("#" + sControlId).find(":input").attr("title", Tooltip);
        else
            $("#" + sControlId).find(":input").removeAttr("title");

        if (DataType.length > 0) {
            $("#" + sControlId).find(":input").attr("DataType", DataType);
        }
        else
            $("#" + sControlId).find(":input").removeAttr("DataType");

        if (chkRequired)
            $("#" + sControlId).find(":input").attr("isrequired", chkRequired);
        else
            $("#" + sControlId).find(":input").removeAttr("isrequired");

        $('input[type=checkbox]').css("margin", "4px 3px 3px 0px");
  }

  if (sControlType == "MultiSelect") {
    var divcontrols = $("#" + sControlId).find(":input");
    divcontrols.empty();
    //$("#" + sControlId).html('');
    if (chkAutofill) {
      patternval = alphanumericPattern;

      $("#ddlColValues").find("option").each(function () {

        var option = this.value.trim();
        if (option.length > 0) {
          if (option == "Select")
            divcontrols.append($("<option></option>")
              .attr("value", "")
              .attr("autofillid", $(this).attr("autofillid"))
              .attr("fieldid", $(this).attr("fieldid"))
              .attr("isshowlabel", chkShowLabel)
              .attr("pattern", patternval)
              .text(option));
          else
            divcontrols.append($("<option></option>")
              .attr("value", option)
              .attr("autofillid", $(this).attr("autofillid"))
              .attr("fieldid", $(this).attr("fieldid"))
              .attr("isshowlabel", chkShowLabel)
              .attr("pattern", patternval)
              .text(option));
        }
      });


    }
    else {
    $("#Properties").find('.option-value').each(function () {

      var option = this.value.trim();
      if (option.length > 0) {
        if (option == "Select")
          divcontrols.append($("<option></option>")
            .attr("value", "")
            .attr("autofillid", $(this).attr("autofillid"))
            .attr("fieldid", $(this).attr("fieldid"))
            .attr("isshowlabel", chkShowLabel)
            .attr("pattern", patternval)
            .text(option));
        else
          divcontrols.append($("<option></option>")
            .attr("value", option)
            .attr("autofillid", $(this).attr("autofillid"))
            .attr("fieldid", $(this).attr("fieldid"))
            .attr("isshowlabel", chkShowLabel)
            .attr("pattern", patternval)
            .text(option));
      }
    });
  }
        if (Tooltip.length > 0)
            $("#" + sControlId).find(":input").attr("title", Tooltip);
        else
            $("#" + sControlId).find(":input").removeAttr("title");

        if (DataType.length > 0) {
            $("#" + sControlId).find(":input").attr("DataType", DataType);
        }
        else
            $("#" + sControlId).find(":input").removeAttr("DataType");

        if (chkRequired)
            $("#" + sControlId).find(":input").attr("isrequired", chkRequired);
        else
            $("#" + sControlId).find(":input").removeAttr("isrequired");

        if (optionOrder)
          $("#" + sControlId).find(":input").attr("optionOrder", optionOrder);
        else
          $("#" + sControlId).find(":input").removeAttr("optionOrder");
    }
  if (sControlType == "Radio") {
    var divcontrols = $("#" + sControlId).find(".controls");
    divcontrols.empty();
    if (chkAutofill) {
      patternval = alphanumericPattern;
     
      var intCtr = 0;
      $("#ddlColValues").find("option").each(function () {
        intCtr = intCtr + 1;
       
        var option = this.value.trim();
        if (option.length > 0) {
          if (chkRequired)
            if (intCtr == 1) {

              divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="radio" name="' + ControlName + '" id="' + ControlName + '" chkAutofill="' + chkAutofill +'" AutoFillDbType="' + AutoFillDbType + '" AutoFillServer="' + AutoFillServer + '" AutoFillAuthMode="' + AutoFillAuthMode + '" AutoFillUserName="' + AutoFillUserName + '" AutoFillPassword="' + AutoFillPassword + '" AutoFillPort="' + AutoFillPort + '" AutoFillDatabase="' + AutoFillDatabase + '" AutoFillTable="' + AutoFillTable + '" AutoFillTableColumn="' + AutoFillTableColumn + '" AutoFillSqlQuery="' + AutoFillSqlQuery + '" pattern="' + patternval + '" value="' + option + '" maxlength="50" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '"  isrequired="true"  checked>' + option + '</label>');
            }
            else {
              divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="radio" name="' + ControlName + '" id="' + ControlName + '" chkAutofill="' + chkAutofill +'" AutoFillDbType="' + AutoFillDbType + '" AutoFillServer="' + AutoFillServer + '" AutoFillAuthMode="' + AutoFillAuthMode + '" AutoFillUserName="' + AutoFillUserName + '" AutoFillPassword="' + AutoFillPassword + '" AutoFillPort="' + AutoFillPort + '" AutoFillDatabase="' + AutoFillDatabase + '" AutoFillTable="' + AutoFillTable + '" AutoFillTableColumn="' + AutoFillTableColumn + '" AutoFillSqlQuery="' + AutoFillSqlQuery + '"  pattern="' + patternval + '" value="' + option + '" maxlength="50" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" isrequired="true">' + option + '</label>');
            }
          else
            if (intCtr==1) {
              divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="radio" name="' + ControlName + '" id="' + ControlName + '" chkAutofill="' + chkAutofill +'" AutoFillDbType="' + AutoFillDbType + '" AutoFillServer="' + AutoFillServer + '" AutoFillAuthMode="' + AutoFillAuthMode + '" AutoFillUserName="' + AutoFillUserName + '" AutoFillPassword="' + AutoFillPassword + '" AutoFillPort="' + AutoFillPort + '" AutoFillDatabase="' + AutoFillDatabase + '" AutoFillTable="' + AutoFillTable + '" AutoFillTableColumn="' + AutoFillTableColumn + '" AutoFillSqlQuery="' + AutoFillSqlQuery + '"  pattern="' + patternval + '" value="' + option + '" maxlength="50" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" checked>' + option + '</label>');
            }
            else {
              divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="radio" name="' + ControlName + '" id="' + ControlName + '" chkAutofill="' + chkAutofill +'" AutoFillDbType="' + AutoFillDbType + '" AutoFillServer="' + AutoFillServer + '" AutoFillAuthMode="' + AutoFillAuthMode + '" AutoFillUserName="' + AutoFillUserName + '" AutoFillPassword="' + AutoFillPassword + '" AutoFillPort="' + AutoFillPort + '" AutoFillDatabase="' + AutoFillDatabase + '" AutoFillTable="' + AutoFillTable + '" AutoFillTableColumn="' + AutoFillTableColumn + '" AutoFillSqlQuery="' + AutoFillSqlQuery + '"  pattern="' + patternval + '" value="' + option + '" maxlength="50" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '">' + option + '</label>');
            }
        }
      });


    }
    else {
    var isSelected = false;
    $("#Properties").find('.option-value').each(function () {

      if ($(this).next().next().is(':checked') === true) {
        isSelected = true;
      }

    });
    if (isSelected === false) {
      alert('Select option');
      return false;
    }
    $("#Properties").find('.option-value').each(function () {
      //alert(this.value );
      var selecetd = $(this).next().next().is(':checked');

      var option = this.value.trim();
      if (option.length > 0) {
        if (chkRequired)
          if (selecetd) {

            divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="radio" name="' + ControlName + '" id="' + ControlName + '" pattern="' + patternval + '" value="' + option + '" maxlength="50" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" isrequired="true" checked>' + option + '</label>');
          }
          else {
            divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="radio" name="' + ControlName + '" id="' + ControlName + '" pattern="' + patternval + '" value="' + option + '" maxlength="50" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" isrequired="true">' + option + '</label>');
          }
        else
          if (selecetd) {
            divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="radio" name="' + ControlName + '" id="' + ControlName + '" pattern="' + patternval + '" value="' + option + '" maxlength="50" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '" checked>' + option + '</label>');
          }
          else {
            divcontrols.append('<label class="radio" for="' + ControlName + '"><input type="radio" name="' + ControlName + '" id="' + ControlName + '" pattern="' + patternval + '" value="' + option + '" maxlength="50" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" isshowlabel="' + chkShowLabel + '">' + option + '</label>');
          }
      }
    });
  }

        if (Tooltip.length > 0)
            $("#" + sControlId).find(":input").attr("title", Tooltip);
        else
            $("#" + sControlId).find(":input").removeAttr("title");

        if (DataType.length > 0) {
            $("#" + sControlId).find(":input").attr("DataType", DataType);
        }
        else
            $("#" + sControlId).find(":input").removeAttr("DataType");

        if (chkRequired)
            $("#" + sControlId).find(":input").attr("isrequired", chkRequired);
        else
            $("#" + sControlId).find(":input").removeAttr("isrequired");
        $('input[type=radio]').css("margin", "4px 3px 3px 0px");
    }

    if (sControlType == "DropDownList") {
        var divcontrols = $("#" + sControlId).find(":input");
        divcontrols.empty();
        //$("#" + sControlId).html('');
      if (chkAutofill) {
        patternval = alphanumericPattern;
       
        $("#ddlColValues").find("option").each(function () {

          var option = this.value.trim();
          if (option.length > 0) {
            if (option == "Select")
              divcontrols.append($("<option></option>")
                .attr("value", "")
                .attr("autofillid", $(this).attr("autofillid"))
                .attr("fieldid", $(this).attr("fieldid"))
                .attr("isshowlabel", chkShowLabel)
                .attr("pattern", patternval)
                .text(option));
            else
              divcontrols.append($("<option></option>")
                .attr("value", option)
                .attr("autofillid", $(this).attr("autofillid"))
                .attr("fieldid", $(this).attr("fieldid"))
                .attr("isshowlabel", chkShowLabel)
                .attr("pattern", patternval)
                .text(option));
          }
        });


      }
      else {
        $("#Properties").find('.option-value').each(function () {

          var option = this.value.trim();
          if (option.length > 0) {
            if (option == "Select")
              divcontrols.append($("<option></option>")
                .attr("value", "")
                .attr("autofillid", $(this).attr("autofillid"))
                .attr("fieldid", $(this).attr("fieldid"))
                .attr("isshowlabel", chkShowLabel)
                .attr("pattern", patternval)
                .text(option));
            else
              divcontrols.append($("<option></option>")
                .attr("value", option)
                .attr("autofillid", $(this).attr("autofillid"))
                .attr("fieldid", $(this).attr("fieldid"))
                .attr("isshowlabel", chkShowLabel)
                .attr("pattern", patternval)
                .text(option));
          }
        });
      }
        
        if (Tooltip.length > 0)
            $("#" + sControlId).find(":input").attr("title", Tooltip);
        else
            $("#" + sControlId).find(":input").removeAttr("title");

        if (DataType.length > 0) {
            $("#" + sControlId).find(":input").attr("DataType", DataType);
        }
        else
            $("#" + sControlId).find(":input").removeAttr("DataType");

        if (chkRequired)
            $("#" + sControlId).find(":input").attr("isrequired", chkRequired);
        else
        $("#" + sControlId).find(":input").removeAttr("isrequired");

      if (optionOrder)
        $("#" + sControlId).find(":input").attr("optionOrder", optionOrder);
      else
        $("#" + sControlId).find(":input").removeAttr("optionOrder");
    }

    if (sControlType == "PageHeader") {

        $("#HeaderImageMain").attr("src", $("#Properties").find('#HeaderImage').attr("src"));
        var width = $("#Properties").find('.ControlWidth').val().trim();
        var height = $("#Properties").find('.ControlHeight').val().trim();
        $("#HeaderImageMain").css("width", (width == "" ? 100 : width) + "px");
        $("#HeaderImageMain").css("height", (height == "" ? 100 : height) + "px");
    }
    if (sControlType == "Button") {

        if (ButtonName.length > 0)
            $("#" + sControlId).find(":input").attr("value", ButtonName);
        else
            $("#" + sControlId).find(":input").removeAttr("value");
        var buttonColor = $('#Properties').find('#ButtonColor').val();
        $("#" + sControlId).find(":input").attr('class', buttonColor);
        var buttonType = $('#Properties').find('#ButtonType').val();
        $("#" + sControlId).find(":input").attr('type', buttonType);
        $("#" + sControlId).find(":input").prop('value', ButtonName);
    }

    if (sControlType == "Header" || sControlType == "PageHeader") {

        var type = $("#Properties").find('#Type').val();
        var text = $("#Properties").find('.HeaderText').val().trim();
        var textAlign = $("#Properties").find('#TextAlign').val();

        $("#" + sControlId).find("#headerTextdiv")[0].innerHTML = "<" + type + ">" + text + "</" + type + ">";
        $("#" + sControlId).find("#headerTextdiv").css("text-align", textAlign);
        $("#" + sControlId).find("#headerTextdiv").css("overflow-wrap" ,"break-word");
    }
  $(".propertyDiv").css("display", "none");

  document.getElementById("btnSaveForm").disabled = false;
  document.getElementById("btnSaveAndPublishForm").disabled = false;

    if (sControlType == "Tab") {
        OperationOnTabControl(sControlId);
    }

    if (sControlType == "Grid") {
        OperationOnGridControl(sControlId);
    }

    if (sControlType == "Table") {
        OperationOnTableControl(sControlId);
    }

    if (sControlType == "ExcelGrid") {
        OperationOnExcelGridControl(sControlId);
    }
    $("#maindiv").find(":input").on("cut copy paste keydown", function (e) {
        e.preventDefault();
    });


}

/*Operation apply on Tab control*/
function OperationOnTabControl(sControlId) {
    //Add tab into main tab
    var OptionTabArray = [];
    var Tabarray = [];

    //transfer tab item into array
    $("#" + sControlId).find(".tablinks").map(function () {
        OptionTabArray.push($(this).attr("id"))
    });

    //transfer option tab item into array
    $(".TabListProp li .option-value").map(function () {
        //Tabarray.push($(this).val().replace('t', 'T').slice(0, 3) + '-' + $(this).val().replace('t', 'T').slice(3, 4));
        Tabarray.push($(this).attr("fieldid"));
    });
   
    var tabNewItemArray = $(Tabarray).not(OptionTabArray).get();
    var tabDeletedItemArray = $(OptionTabArray).not(Tabarray).get();

    if (tabNewItemArray.length > 0) {
        var i = 1;
        while (i <= tabNewItemArray.length) {
            var newTabid = tabNewItemArray[i - 1].split('-')[1];
            //Added Tab into Tab control
            $("#" + sControlId).find(".tab").append('<input type="button" id=Tab-' + newTabid + '\ class="tablinks" value="tab' + newTabid + '\" onclick="OpenSelectedTab(this,\'' + ('tab' + newTabid + '\content') + '\')" />')
            $("#" + sControlId).find("#" + $("#" + sControlId).find("div.controls div:first").attr("id") + ".tabcontrol").append("<div id='tab" + newTabid + "content' class='tabcontent tabcontentitem'>Control Placed</div>");
            i++;
        } 
    }

    if (tabDeletedItemArray.length > 0) {
        var j = 1;
        while (j <= tabDeletedItemArray.length) {
            var getTabccontentid = $("#" + sControlId).find(".tablinks").filter(function () { return $(this).attr("id") === tabDeletedItemArray[j - 1] }).attr("onclick").split("OpenSelectedTab(")[1].split(',')[1].trim().replace("')", '').replace("'", '');

            if ($("#" + sControlId).find(".tabcontent").filter(function () { return $(this).attr("id") === getTabccontentid }).find(".dropped").length > 0) {
                if (confirm("Are you sure to remove this tab with controls?")) {
                    $("#" + sControlId).find(".tablinks").filter(function () { return $(this).attr("id") === tabDeletedItemArray[j - 1] }).remove();
                    $("#" + sControlId).find(".tabcontent").filter(function () { return $(this).attr("id") === getTabccontentid }).remove();
                }
            }
            else {
                $("#" + sControlId).find(".tablinks").filter(function () { return $(this).attr("id") === tabDeletedItemArray[j - 1] }).remove();
                $("#" + sControlId).find(".tabcontent").filter(function () { return $(this).attr("id") === getTabccontentid }).remove();
            }
            j++;
        }
    }
    $(".tabcontent").addClass("droppable");

    //Update tab header text
    $(".TabListProp li .option-value").each(function (indexouter) {
        var settxttab = $(this).val();
        $("#" + sControlId).find(".tablinks").each(function (indexinner) {
            if (indexouter == indexinner) {
                $(this).val(settxttab);
            }
        });
    });

    $("#" + sControlId).find(".tab").find(".tablinks:first").trigger("click");
}

/*Operation apply on Grid control*/
function OperationOnGridControl(sControlId) {
    var gridId = $("#" + sControlId).find(".controls div:first").attr("id");

    var countNewrows = $('#Properties').find('#txtGridRow').val();
    var countExistRows = $("#" + sControlId).find("#" + gridId).find("tr").length;

    //Added rows into grid
    if (countNewrows > countExistRows) {
        var countcols = $("#" + sControlId).find("#" + gridId).find("tr:first").find("td").length;

        var i = 1;

        while (i < countNewrows && countExistRows > 0) {
            countExistRows = $("#" + sControlId).find("#" + gridId).find("tr").length;
            var newrow = "";
            var j = 1;
            //Set Column script 
            while (j <= countcols) {
                newrow += "<td id='ColumnContent-" + (countExistRows) + "-" + j + "' class='columncontent watermark'><div style='width:200px;'>Control Placed</div></td>";
                j++;
            }
            if (countNewrows > countExistRows) {
                $("#" + sControlId).find("#" + gridId).find("tbody").append("<tr id='Row" + (countExistRows) + "'>" + newrow + "</tr>");
            }
            i++;
        }
    }

    //Added new column
    var noOfAddedCols = $('#Properties').find('#txtGridColumn').val();
    var existsCols = $("#" + sControlId).find("#" + gridId).find("tr:first").find("td").length;

    while (noOfAddedCols > existsCols) {

        $("#" + sControlId).find("#" + gridId).find("tbody").find('tr').each(function (index) {
          $(this).find('td').eq(-1).after("<td id='ColumnContent-" + index + "-" + (existsCols + 1) + "' class='columncontent watermark'><div style='width:200px;'>Control Placed</div></td>");
        });
        existsCols++;
    }
    //Remove  column from Grid
    if (noOfAddedCols < existsCols) {
        var c = 1;
        while (c <= (existsCols - noOfAddedCols)) {
            if ($("#" + sControlId).find("#" + gridId + " tr").find('td:last').find(".dropped").length > 0) {
                if (confirm("Are you sure to remove column with control?")) {
                    $("#" + sControlId).find("#" + gridId + " tr").find('td:last').remove();
                }
            }
            else {
                $("#" + sControlId).find("#" + gridId + " tr").find('td:last').remove();
            }
            c++;
        }
    }

    //Remove Rows from Grid
    if (countNewrows < countExistRows) {
        var r = 1;
        while (r <= (countExistRows - countNewrows)) {

            if ($("#" + sControlId).find("#" + gridId + " tr").eq(-1).find(".dropped").length > 0) {
                if (confirm("Are you sure to remove row with child control?")) {
                    $("#" + sControlId).find("#" + gridId).find('tr').eq(-1).remove();
                }
            }
            else {
                $("#" + sControlId).find("#" + gridId).find('tr').eq(-1).remove();
            }
            r++;
        }
    }
    //Set placeholder for text or textarea control
    $(".columncontent").find("input[type=text]").attr("placeholder", "Enter text");
    $(".columncontent").find("textarea").attr("placeholder", "Enter text");
    //set droppable class on added new columns
    if ($(".columncontent").parents("div .controls").parent().attr("data-type") == "Grid")
        $(".columncontent").addClass("droppable");
}

/*Operation apply on Table control*/
function OperationOnTableControl(sControlId) {
    var OptionTableColArray = [];
    var TableColArray = [];
    var tblId = $("#" + sControlId).find(".controls div:first").attr("id");
    var countNewtblrows = $('#Properties').find('#txtTableRow').val();
    var countExisttblRows = $("#" + sControlId).find("#" + tblId).find("tr").length;

    //transfer table item into array
    $("#" + sControlId).find(".columnheadercontent").map(function () {
        TableColArray.push($(this).attr("id"))
    });

    //transfer option tab item into array
    $(".TableColumnListProp li .option-value").map(function () {
        var OptioncolValue = $(this).attr("value");
        var optionColumnId = $("#" + sControlId).find(".columnheadercontent").filter(function () { return $(this).text() === OptioncolValue }).attr("id")

        if (typeof (optionColumnId) == 'undefined') {
            var newColumnId = "ColumnContent-0" + parseInt(parseInt(OptionTableColArray[OptionTableColArray.length - 1].split('-')[1]) + 1);
            optionColumnId = newColumnId;
        }
        OptionTableColArray.push(optionColumnId);
    });

    var tableNewColArray = $(OptionTableColArray).not(TableColArray).get();
    var tableDeletedColArray = $(TableColArray).not(OptionTableColArray).get();

    //Added rows into table
    if (countNewtblrows > countExisttblRows) {
        var countcols = $("#" + sControlId).find("#" + tblId).find("tr").find("th").length;

        var i = 1;

        while (i < countNewtblrows && countExisttblRows >= 2) {
            countExisttblRows = $("#" + sControlId).find("#" + tblId).find("tr").length;
            var tblnewrow = "";
            var j = 1;
            //Set Column script 
            while (j <= countcols) {
                tblnewrow += "<td id='ColumnContent-" + (countExisttblRows) + "" + j + "' class='rowcontent'><textarea class='form-control textareaTableContent' rows='1' cols='4' placeholder='Enter text'></textarea></td>";
                j++;
            }
            if (countNewtblrows > countExisttblRows) {
                $("#" + sControlId).find("#" + tblId).find("tbody").append("<tr id='Row" + (countExisttblRows) + "'>" + tblnewrow + "</tr>");
            }
            i++;
        }
    }

    if (tableNewColArray.length > 0) {
        var m = 0;
        //Added new column
        while (m < tableNewColArray.length) {
            $("#" + sControlId).find("#" + tblId).find("tbody").find('tr').each(function (index) {
                if (index == 0) {
                    $(this).find('th').eq(-1).after("<th class='columnheadercontent'  id='" + tableNewColArray[m] + "' style='background-color:lightgray'>Column" + parseInt($.inArray(tableNewColArray[m], OptionTableColArray) + 1) + "</th>");
                }
                if (index > 0) {
                    $(this).find('td').eq(-1).after("<td id='ColumnContent-" + index + "" + parseInt($.inArray(tableNewColArray[m], OptionTableColArray) + 1) + "' class='rowcontent'><textarea class='form-control textareaTableContent' rows='1' cols='4' placeholder='Enter text'></textarea></td>");
                }
            });
            m++;
        }
        //Remove  column from Table
        if (tableDeletedColArray.length > 0) {
            var n = 0;
            while (n < tableDeletedColArray.length) {
                $("#" + sControlId).find("#" + tblId + " tr th.columnheadercontent").each(function (index) {
                    if ($(this).attr("id") == tableDeletedColArray[n]) {
                        $("#" + sControlId).find("#" + tblId).find("tr").each(function () {
                            $(this).find('th:eq(' + index + '),td:eq(' + index + ')').remove();
                        });
                    }
                });
                n++
            }
        }
    }
    if (tableNewColArray.length == 0) {
        //Remove  column from Table
        if (tableDeletedColArray.length > 0) {
            var n = 0;
            while (n < tableDeletedColArray.length) {
                $("#" + sControlId).find("#" + tblId + " tr th.columnheadercontent").each(function (index) {
                    if ($(this).attr("id") == tableDeletedColArray[n]) {
                        $("#" + sControlId).find("#" + tblId).find("tr").each(function () {
                            $(this).find('th:eq(' + index + '),td:eq(' + index + ')').remove();
                        });
                    }
                });
                n++
            }
        }
    }

    //Remove Rows from Table
    if (countNewtblrows < countExisttblRows) {
        var r = 1;
        while (r <= (countExisttblRows - countNewtblrows)) {
            $("#" + sControlId).find("#" + tblId).find('tr').eq(-1).remove();
            r++;
        }
    }

    //Set placeholder into row content
    $("#" + sControlId).find("#" + tblId + " tr td").find("textarea").each(function (index) {
        $(this).attr("placeholder", "Enter text");
    });


    //Set column header text
    $(".TableColumnListProp li .option-value").each(function (indexouter) {
        var settxtcol = $(this).val();

        $("#" + sControlId).find("#" + tblId + " tr th.columnheadercontent").each(function (indexinner) {
            if (indexouter == indexinner) {
                $(this).text(settxtcol);
            }
        });
    });
}

/*Operation apply on ExcelGrid control*/
function OperationOnExcelGridControl(sControlId) {
    var OptionTableColArray = [];
    var OptionTableColTypeArray = [];
    var OptionTableColSourceArray = [];
    var TableColArray = [];
    var tblId = $("#" + sControlId).find(".controls div:first").attr("id");
    var countNewtblrows = $('#Properties').find('#txtExcelGridRow').val();
    var countExisttblRows = $("#" + sControlId).find("#" + tblId).find("tr").length;

    //transfer table item into array
    $("#" + sControlId).find(".columnheaderexcelcontent").map(function () {
        TableColArray.push($(this).attr("id"))
    });

    //transfer option tab item type into array
    $(".ExcelGridColumnListProp li .ColumnType").map(function () {
        var OptioncolTypeValue = $(this).find(":selected").val();
        var OptioncolSourceValue = $(this).next().find("input[type='text']").val();
        OptionTableColSourceArray.push(OptioncolSourceValue)
        OptionTableColTypeArray.push(OptioncolTypeValue);
    });

    //transfer option tab item into array
    $(".ExcelGridColumnListProp li .option-value").map(function () {
        var OptioncolValue = $(this).attr("value");
        var optionColumnId = $("#" + sControlId).find(".columnheaderexcelcontent").filter(function () { return $(this).text() === OptioncolValue }).attr("id")

        if (typeof (optionColumnId) == 'undefined') {
            var newColumnId = "ColumnContent-0" + parseInt(parseInt(OptionTableColArray[OptionTableColArray.length - 1].split('-')[1]) + 1);
            optionColumnId = newColumnId;
        }
        OptionTableColArray.push(optionColumnId);
    });

    var tableNewColArray = $(OptionTableColArray).not(TableColArray).get();
    var tableDeletedColArray = $(TableColArray).not(OptionTableColArray).get();

    //Added rows into table
    if (countNewtblrows > countExisttblRows) {
        var countcols = $("#" + sControlId).find("#" + tblId).find("tr").find("th").length;

        var i = 1;

        while (i < countNewtblrows && countExisttblRows >= 2) {
            countExisttblRows = $("#" + sControlId).find("#" + tblId).find("tr").length;
            var tblnewrow = "";
            var j = 1;
            //Set Column script 
            while (j <= countcols) {
                tblnewrow += "<td id='ColumnContent-" + (countExisttblRows) + "" + j + "' class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'></textarea></td>";
                j++;
            }
            if (countNewtblrows > countExisttblRows) {
                $("#" + sControlId).find("#" + tblId).find("tbody").append("<tr id='Row" + (countExisttblRows) + "'>" + tblnewrow + "</tr>");
            }
            i++;
        }
    }

    if (tableNewColArray.length > 0) {
        var m = 0;
        //Added new column
        while (m < tableNewColArray.length) {
            $("#" + sControlId).find("#" + tblId).find("tbody").find('tr').each(function (index) {
                if (index == 0) {
                    $(this).find('th').eq(-1).after("<th class='columnheaderexcelcontent'  id='" + tableNewColArray[m] + "' style='background-color:lightgray'>Column" + parseInt($.inArray(tableNewColArray[m], OptionTableColArray) + 1) + "</th>");
                }
                if (index > 0) {
                    $(this).find('td').eq(-1).after("<td id='ColumnContent-" + index + "" + parseInt($.inArray(tableNewColArray[m], OptionTableColArray) + 1) + "' class='rowcontent'><textarea class='form-control textareaExcelGridContent' rows='1' cols='4' placeholder='Enter text'></textarea></td>");
                }
            });
            m++;
        }
        //Remove  column from Table
        if (tableDeletedColArray.length > 0) {
            var n = 0;
            while (n < tableDeletedColArray.length) {
                $("#" + sControlId).find("#" + tblId + " tr th.columnheaderexcelcontent").each(function (index) {
                    if ($(this).attr("id") == tableDeletedColArray[n]) {
                        $("#" + sControlId).find("#" + tblId).find("tr").each(function () {
                            $(this).find('th:eq(' + index + '),td:eq(' + index + ')').remove();
                        });
                    }
                });
                n++
            }
        }
    }
    else if (tableNewColArray.length == 0) {
        //Remove  column from Table
        if (tableDeletedColArray.length > 0) {
            var n = 0;
            while (n < tableDeletedColArray.length) {
                $("#" + sControlId).find("#" + tblId + " tr th.columnheaderexcelcontent").each(function (index) {
                    if ($(this).attr("id") == tableDeletedColArray[n]) {
                        $("#" + sControlId).find("#" + tblId).find("tr").each(function () {
                            $(this).find('th:eq(' + index + '),td:eq(' + index + ')').remove();
                        });
                    }
                });
                n++
            }
        }
    }
    //Remove Rows from Table
    if (countNewtblrows < countExisttblRows) {
        var r = 1;
        while (r <= (countExisttblRows - countNewtblrows)) {
            $("#" + sControlId).find("#" + tblId).find('tr').eq(-1).remove();
            r++;
        }
    }

    //Set placeholder into row content
    $("#" + sControlId).find("#" + tblId + " tr td").find("textarea").each(function (index) {
        $(this).attr("placeholder", "Enter text");
    });


    //Set column header text
    $(".ExcelGridColumnListProp li .option-value").each(function (indexouter) {
        var settxtcol = $(this).val();

        $("#" + sControlId).find("#" + tblId + " tr th.columnheaderexcelcontent").each(function (indexinner) {
            //update type value with column
            $(this).attr("columnType", OptionTableColTypeArray[indexinner]);
            $(this).attr("columnsource", OptionTableColSourceArray[indexinner]);
            if (indexouter == indexinner) {
                $(this).text(settxtcol);

            }
        });
    });
}

/*Set Data Type of controls in Form Add Mode*/
function SetDataTypeinFormAddMode(sControlId, DataType) {

    if (DataType == "Alpha") {
        $("#" + $("#" + sControlId).find(":input").attr("id")).attr("pattern", alphaPattren);
        $("#" + $("#" + sControlId).find(":input").attr("id")).attr("onkeydown", "return alphabetsOnly(event)")
    }
    else if (DataType == "AlphaNumeric") {
        $("#" + $("#" + sControlId).find(":input").attr("id")).attr("pattern", alphanumericPattern);
        $("#" + $("#" + sControlId).find(":input").attr("id")).attr("onkeydown", "return alphabetsAndNumericOnly(event)")
    }
    else if (DataType == "Numeric") {
        $("#" + $("#" + sControlId).find(":input").attr("id")).attr("pattern", numericWithDecialPointPattern);
        $("#" + $("#" + sControlId).find(":input").attr("id")).attr("onkeydown", "return numericWithDecimalPoint(event,$(this).val())")
    }
    else if (DataType == "FreeText") {
        $("#" + $("#" + sControlId).find(":input").attr("id")).attr("pattern", alphanumericWithSecialCharPattern);
        $("#" + $("#" + sControlId).find(":input").attr("id")).attr("onkeydown", "return alphanumericWithSpecialCharacter(event)")
    }
}

/* Validate Template form Properties for Label */
function ValidateControlLabelProperties(LabelText, sControlType, ControlName, chkRequired) {
    //Validation on Form control Properties--------------->
    var errorflaglbl = true;

    $("#Properties").find("#dvTxtBoxlbl").css("display", "none");
    $("#Properties").find("#dvTxtarealbl").css("display", "none");
    $("#Properties").find("#dvradiolbl").css("display", "none");
    $("#Properties").find("#dvCheckBoxlbl").css("display", "none");
    $("#Properties").find("#dvbuttonlbl").css("display", "none");
    $("#Properties").find("#dvDropDownlbl").css("display", "none");
    $("#Properties").find("#dvCalendarlbl").css("display", "none");
    $("#Properties").find("#dvTablbl").css("display", "none");

  if (LabelText === '') 
  {
      var errormsg = "Label can not be left blank.";
      //Header text validation
      if (sControlType == "Header") {
        LabelText = $("#Properties").find('.HeaderText').val().trim();
        $("#Properties").find("#dvHeaderlbl").css("display", "none");
        if (LabelText == '') {
          $("#Properties").find("#dvHeaderlbl").text("Header can not be left blank.");
          $("#Properties").find("#dvHeaderlbl").css("display", "block");
          errorflaglbl = false;
        }
      } else if (sControlType == "TextBox") {
        //Textbox Label text Validation
        $("#Properties").find("#dvTxtBoxlbl").text(errormsg);
        $("#Properties").find("#dvTxtBoxlbl").css("display", "block");
        errorflaglbl = false;
      } else if (sControlType == "TextBox-MultiLine") {
        //Textbox Area Label text Validation
        $("#Properties").find("#dvTxtarealbl").text(errormsg);
        $("#Properties").find("#dvTxtarealbl").css("display", "block");
        errorflaglbl = false;
      } else if (sControlType == "Radio") {
        //Radio label Text Validation
        $("#Properties").find("#dvradiolbl").text(errormsg);
        $("#Properties").find("#dvradiolbl").css("display", "block");
        errorflaglbl = false;
      } else if (sControlType == "CheckBox") {
        //Checkbox label Text Validation
        $("#Properties").find("#dvCheckBoxlbl").text(errormsg);
        $("#Properties").find("#dvCheckBoxlbl").css("display", "block");
        errorflaglbl = false;
      } else if (sControlType == "DropDownList") {
        //Dropdown label Text Validation
        $("#Properties").find("#dvDropDownlbl").text(errormsg);
        $("#Properties").find("#dvDropDownlbl").css("display", "block");
        errorflaglbl = false;
      } else if (sControlType == "MultiSelect") {
        //Dropdown label Text Validation
        $("#Properties").find("#dvMultiSelectlbl").text(errormsg);
        $("#Properties").find("#dvMultiSelectlbl").css("display", "block");
        errorflaglbl = false;
      }
      //else if (sControlType == "Button") {
      //  //Button Label Text Validation
      //  $("#Properties").find("#dvbuttonlbl").text(errormsg);
      //  $("#Properties").find("#dvbuttonlbl").css("display", "block");
      //  errorflaglbl = false;
      //}
      else if (sControlType == "Calendar") {
        //Calendar Label Text Validation
        $("#Properties").find("#dvCalendarlbl").text(errormsg);
        $("#Properties").find("#dvCalendarlbl").css("display", "block");
        errorflaglbl = false;
      }
      //else if (sControlType == "Tab") {
      //  //Tab Label Text Validation
      //  $("#Properties").find("#dvTablbl").text("Tab header can not be left blank.");
      //  $("#Properties").find("#dvTablbl").css("display", "block");
      //  errorflaglbl = false;
      //}
    }
  
    else {
        var errormsglblText = "Label name already exists into form.";
        //Make array for label text values of controls on form

      var lbltxtarray=[];
      $("#maindiv").find('[data-label=lbl]').each(function() {
        lbltxtarray.push($(this).text().toLowerCase());
      });

      var lblctrlIDarray=[];
      $("#maindiv").find('[data-label=ctrlId]').each(function () {
        lblctrlIDarray.push($(this).text().replace(" :", ""));
      });
   
      if (($.inArray(LabelText.toLowerCase(), lbltxtarray) > -1) && lblctrlIDarray[$.inArray(LabelText.toLowerCase(), lbltxtarray)] != ControlName) {
            if (sControlType == "TextBox") {
                    $("#Properties").find("#dvTxtBoxlbl").text(errormsglblText);
                    $("#Properties").find("#dvTxtBoxlbl").css("display", "block");
                    errorflaglbl = false;
            }
            else if (sControlType == "TextBox-MultiLine") {
                //Textbox Area Label text Validation
                    $("#Properties").find("#dvTxtarealbl").text(errormsglblText);
                    $("#Properties").find("#dvTxtarealbl").css("display", "block");
                    errorflaglbl = false;
            }
            else if (sControlType == "Radio") {
                //Radio label Text Validation
                    $("#Properties").find("#dvradiolbl").text(errormsglblText);
                    $("#Properties").find("#dvradiolbl").css("display", "block");
                    errorflaglbl = false;
            }
            else if (sControlType == "CheckBox") {
                //Checkbox label Text Validation
                    $("#Properties").find("#dvCheckBoxlbl").text(errormsglblText);
                    $("#Properties").find("#dvCheckBoxlbl").css("display", "block");
                    errorflaglbl = false;
            }
            else if (sControlType == "DropDownList") {
                //Dropdown label Text Validation
                    $("#Properties").find("#dvDropDownlbl").text(errormsglblText);
                    $("#Properties").find("#dvDropDownlbl").css("display", "block");
                    errorflaglbl = false;
            }
            else if (sControlType == "MultiSelect") {
                //Dropdown label Text Validation
                    $("#Properties").find("#dvMultiSelectlbl").text(errormsglblText);
                    $("#Properties").find("#dvMultiSelectlbl").css("display", "block");
                    errorflaglbl = false;
            }
            else if (sControlType == "Button") {
                //Button Label Text Validation
                    $("#Properties").find("#dvbuttonlbl").text(errormsglblText);
                    $("#Properties").find("#dvbuttonlbl").css("display", "block");
                    errorflaglbl = false;
            }
            else if (sControlType == "Calendar") {
                //Calendar Label Text Validation
                    $("#Properties").find("#dvCalendarlbl").text(errormsglblText);
                    $("#Properties").find("#dvCalendarlbl").css("display", "block");
                    errorflaglbl = false;
            }
        }
    }
    return errorflaglbl;
}

/* Validate Template form Properties for tooltip */
function ValidateControlTooltipProperties(tooltiptext, sControlType) {
    //Validation on Form control Properties--------------->
    var errorflagtooltip = true;

    $("#Properties").find("#dvTxtBoxtooltip").css("display", "none");
    $("#Properties").find("#dvTxtareatooltip").css("display", "none");
    $("#Properties").find("#dvradiotooltip").css("display", "none");
    $("#Properties").find("#dvCheckBoxtooltip").css("display", "none");
    $("#Properties").find("#dvbuttontooltip").css("display", "none");
    $("#Properties").find("#dvDropDowntooltip").css("display", "none");
    $("#Properties").find("#dvCalendartooltip").css("display", "none");

    if (tooltiptext == '') {
        var errormsgtooltip = "Tooltip can not be left blank.";
        if (sControlType == "TextBox") {
            //Textbox Label text Validation
            $("#Properties").find("#dvTxtBoxtooltip").text(errormsgtooltip);
            $("#Properties").find("#dvTxtBoxtooltip").css("display", "block");
            errorflagtooltip = false;
        }
        else if (sControlType == "TextBox-MultiLine") {
            //Textbox Area Label text Validation
            $("#Properties").find("#dvTxtareatooltip").text(errormsgtooltip);
            $("#Properties").find("#dvTxtareatooltip").css("display", "block");
            errorflagtooltip = false;
        }
        else if (sControlType == "Radio") {
            //Radio label Text Validation
            $("#Properties").find("#dvradiotooltip").text(errormsgtooltip);
            $("#Properties").find("#dvradiotooltip").css("display", "block");
            errorflagtooltip = false;
        }
        else if (sControlType == "CheckBox") {
            //Checkbox label Text Validation
            $("#Properties").find("#dvCheckBoxtooltip").text(errormsgtooltip);
            $("#Properties").find("#dvCheckBoxtooltip").css("display", "block");
            errorflagtooltip = false;
        }
        else if (sControlType == "DropDownList") {
            //Dropdown label Text Validation
            $("#Properties").find("#dvDropDowntooltip").text(errormsgtooltip);
            $("#Properties").find("#dvDropDowntooltip").css("display", "block");
            errorflagtooltip = false;
        }
        else if (sControlType == "MultiSelect") {
            //Dropdown label Text Validation
            $("#Properties").find("#dvMultiSelecttooltip").text(errormsgtooltip);
            $("#Properties").find("#dvMultiSelecttooltip").css("display", "block");
            errorflagtooltip = false;
        }
        else if (sControlType == "Button") {
            //Button Label Text Validation
            $("#Properties").find("#dvbuttontooltip").text(errormsgtooltip);
            $("#Properties").find("#dvbuttontooltip").css("display", "block");
            errorflagtooltip = false;
        }
        else if (sControlType == "Calendar") {
            //Calendar Label Text Validation
            $("#Properties").find("#dvCalendartooltip").text(errormsgtooltip);
            $("#Properties").find("#dvCalendartooltip").css("display", "block");
            errorflagtooltip = false;
        }

    }
    return errorflagtooltip;
}

/* Validate Template form Properties for placeholder */
function ValidateControlPlaceholderProperties(textPlaceholder, sControlType) {
    //Validation on Form control Properties--------------->
    var errorflagplaceholder = true;

    $("#Properties").find("#dvTxtBoxplaceholder").css("display", "none");
    $("#Properties").find("#dvTxtareaplaceholder").css("display", "none");
    $("#Properties").find("#dvCalendarplaceholder").css("display", "none");

    if (textPlaceholder == '') {
        var errormsgplaceholder = "Watermark can not be left blank.";

        if (sControlType == "TextBox") {
            //Textbox Label text Validation
            $("#Properties").find("#dvTxtBoxplaceholder").text(errormsgplaceholder);
            $("#Properties").find("#dvTxtBoxplaceholder").css("display", "block");
            errorflagplaceholder = false;
        }
        else if (sControlType == "TextBox-MultiLine") {
            //Textbox Area Label text Validation
            $("#Properties").find("#dvTxtareaplaceholder").text(errormsgplaceholder);
            $("#Properties").find("#dvTxtareaplaceholder").css("display", "block");
            errorflagplaceholder = false;
        }
        else if (sControlType == "Calendar") {
            //Calendar Label Text Validation
            $("#Properties").find("#dvCalendarplaceholder").text(errormsgplaceholder);
            $("#Properties").find("#dvCalendarplaceholder").css("display", "block");
            errorflagplaceholder = false;
        }
    }
    return errorflagplaceholder;
}

/*Validate Option Value in Controls*/
function ValidateOptionValueinControls(sControlType, ControlName) {
    //Validation on Form control Properties--------------->
    var errorflagoption = true;
    var errormsgOption = "Value can not be left blank.";
    var errormsgDuplicateOption = "Option name already exists.";

    //Validate no of row value
    if (sControlType == "Table") {
        var tblrowval = $("#Properties").find("#txtTableRow").val();
        if (tblrowval == 0) {
            $("#Properties").find("#dvTablerow").css("display", "block");
            $("#Properties").find("#dvTablerow").text("Value can not be left blank or zero.");
            errorflagoption = false;
            return errorflagoption;
        }
        else if (tblrowval == 1) {
            $("#Properties").find("#dvTablerow").css("display", "block");
            $("#Properties").find("#dvTablerow").text("Value can not be less then 2");
            errorflagoption = false;
            return errorflagoption;
        }
    }

    //Validate no of row value in excel grid
    if (sControlType == "ExcelGrid") {
        var exlrowval = $("#Properties").find("#txtExcelGridRow").val();
        if (exlrowval == 0) {
            $("#Properties").find("#dvExcelGridrow").css("display", "block");
            $("#Properties").find("#dvExcelGridrow").text("Value can not be left blank or zero.");
            errorflagoption = false;
            return errorflagoption;
        }
        else if (exlrowval == 1) {
            $("#Properties").find("#dvExcelGridrow").css("display", "block");
            $("#Properties").find("#dvExcelGridrow").text("Value can not be less then 2");
            errorflagoption = false;
            return errorflagoption;
        }
    }

    if (sControlType == "DropDownList" || sControlType == "MultiSelect" || sControlType == "Tab" || sControlType == "Table" || sControlType == "ExcelGrid") {
        //Dropdown , MultiSelect ,Tab and Table Option Text Validation

        $("#Properties").find('.option-value').each(function (OuterIndex) {
            var errorMsgobj = $(this).next().next().next();
            var columnTypeSource = "";
            var columnType = "";

            if (sControlType == "ExcelGrid") {
                $(errorMsgobj).next().next().css("display", "none");
                columnType = $(this).next().next().find(":selected").val();
                columnTypeSource = $(errorMsgobj).find("input[type='text']").val().trim();
            }
            else {
                $(errorMsgobj).css("display", "none");
            }
            
            var columnName = $(this).val().trim().toLowerCase();
            
            if (columnName == "") {
                errorflagoption = false;
                if (sControlType == "ExcelGrid") {
                    $(errorMsgobj).next().next().text(errormsgOption);
                    $(errorMsgobj).next().next().css("display", "block");
                }
                else {
                    $(errorMsgobj).text(errormsgOption);
                    $(errorMsgobj).css("display", "block");
                }
                return errorflagoption
            }
            else if (columnTypeSource == "" && columnType =="dropdown") {
                errorflagoption = false;
                if (sControlType == "ExcelGrid") {
                    $(errorMsgobj).next().next().text(errormsgOption);
                    $(errorMsgobj).next().next().css("display", "block");
                }
                return errorflagoption
            }
            else if (columnTypeSource != "" && columnType =="dropdown") {
                var stringFormat = new RegExp('^[a-zA-Z0-9]+(,[a-zA-Z0-9]+)*$');
                if (!stringFormat.test(columnTypeSource)) {
                    $(errorMsgobj).next().next().text("Value not in correct format");
                    $(errorMsgobj).next().next().css("display", "block");
                    errorflagoption = false;
                }
                return errorflagoption
            }
            else {

                //check Duplicate column name in form or table
                if (sControlType == "Table") {
                    var tableControlarray = [];

                    //Make array for tab controls on form
                    $("#maindiv").find("[id*=" + sControlType + "]").each(function () {
                        if ($(this).prop("tagName").toLowerCase() == "div") {
                            tableControlarray.push($(this).attr("id"))
                        }
                        else {
                            $(this).find("th").map(function () {
                                tableControlarray.push($(this).text().toLowerCase());
                                return;
                            });
                        }
                    });

                    var findTablecontrolcount = $.grep(tableControlarray, function (elem) {
                        return elem == columnName;
                    }).length;

                    var IsParenttable = false;
                    var findTablecontrolIndex = $.inArray(columnName, tableControlarray);
                    var findTabledivcontrolIndex = $.inArray(ControlName, tableControlarray);

                    if (findTablecontrolIndex > findTabledivcontrolIndex)
                        IsParenttable = true;
                    //same option value
                    if ($(".TableColumnListProp").find('.option-value').filter(function (InnerIndex) { return $(this).val().toLowerCase() == columnName }).length > 1) {
                        errorflagoption = false;
                        $(errorMsgobj).text("Column name already exists.");
                        $(errorMsgobj).css("display", "block");
                        return errorflagoption
                    }
                    //on form in different tabs
                    if ((findTablecontrolcount > 1) || (findTablecontrolcount == 1 && !IsParenttable)) {
                        errorflagoption = false;
                        $(errorMsgobj).text("Column name already exists.");
                        $(errorMsgobj).css("display", "block");
                        return errorflagoption
                    }
                }
                else if (sControlType == "ExcelGrid") {
                    var excelGridControlarray = [];

                    //Make array for tab controls on form
                    $("#maindiv").find("[id*=" + sControlType + "]").each(function () {
                        if ($(this).prop("tagName").toLowerCase() == "div") {
                            excelGridControlarray.push($(this).attr("id"))
                        }
                        else {
                            $(this).find("th").map(function () {
                                excelGridControlarray.push($(this).text().toLowerCase());
                                return;
                            });
                        }
                    });

                    var findExcelGridcontrolcount = $.grep(excelGridControlarray, function (elem) {
                        return elem == columnName;
                    }).length;

                    var IsParentExcelGrid = false;
                    var findExcelGridcontrolIndex = $.inArray(columnName, excelGridControlarray);
                    var findExcelGriddivcontrolIndex = $.inArray(ControlName, excelGridControlarray);

                    if (findExcelGridcontrolIndex > findExcelGriddivcontrolIndex)
                        IsParentExcelGrid = true;
                    //same option value
                    if ($(".ExcelGridColumnListProp").find('.option-value').filter(function (InnerIndex) { return $(this).val().toLowerCase() == columnName }).length > 1) {
                        errorflagoption = false;
                        $(errorMsgobj).next().next().text("Column name already exists.");
                        $(errorMsgobj).next().next().css("display", "block");
                        return errorflagoption
                    }
                    //on form in different tabs
                    if ((findExcelGridcontrolcount > 1) || (findExcelGridcontrolcount == 1 && !IsParentExcelGrid)) {
                        errorflagoption = false;
                        $(errorMsgobj).next().next().text("Column name already exists.");
                        $(errorMsgobj).next().next().css("display", "block");
                        return errorflagoption
                    }
                }
                else if (sControlType == "Tab") {//check Duplicate tab name in form or table
                    //Make array for tab controls on form
                    var tabControlarray = $("#maindiv").find("[id*=" + sControlType + "]").map(function () {
                        return $(this).prop("tagName").toLowerCase() == "div" ? $(this).attr("id") : $(this).attr("value");
                    });

                    var findTabcontrolcount = $.grep(tabControlarray, function (elem) {
                        return elem == columnName;
                    }).length;

                    var IsParenttab = false;
                    var findTabcontrolIndex = $.inArray(columnName, tabControlarray);
                    var findTabdivcontrolIndex = $.inArray(ControlName, tabControlarray);

                    if (findTabcontrolIndex > findTabdivcontrolIndex)
                        IsParenttab = true;
                    //same option value
                    if ($(".TabListProp").find('.option-value').filter(function () { return $(this).val().toLowerCase() == columnName }).length > 1) {
                        errorflagoption = false;
                        $(errorMsgobj).text("Tab name already exists.");
                        $(errorMsgobj).css("display", "block");
                        return errorflagoption
                    }

                    //on form in different tabs
                    if ((findTabcontrolcount > 1) || (findTabcontrolcount == 1 && !IsParenttab)) {
                        errorflagoption = false;
                        $(errorMsgobj).text("Tab name already exists.");
                        $(errorMsgobj).css("display", "block");
                        return errorflagoption
                    }

                }
                else if (sControlType == "MultiSelect") {//check multiselect duplicate Option name in form or table
                    if ($(".MultiSelectProp").find('.option-value').filter(function () { return $(this).val().toLowerCase() == columnName }).length > 1) {
                        errorflagoption = false;
                        $(errorMsgobj).text(errormsgDuplicateOption);
                        $(errorMsgobj).css("display", "block");
                        return errorflagoption
                    }
                }
                else if (sControlType == "DropDownList") {
                    if ($(".DropDownListProp").find('.option-value').filter(function () { return $(this).val().toLowerCase() == columnName }).length > 1) {
                        errorflagoption = false;
                        $(errorMsgobj).text(errormsgDuplicateOption);
                        $(errorMsgobj).css("display", "block");
                        return errorflagoption
                    }
                }
            }
        });
    }
    else if (sControlType == "CheckBox" || sControlType == "Radio") {
        //checkbox and Radio Option Text Validation
        $("#Properties").find('.option-value').each(function (OuterIndex) {
            var errorMsgobj = $(this).next().next().next().next();
            $(errorMsgobj).css("display", "none");
            var columnName = $(this).val().trim().toLowerCase();
            if (columnName == "") {
                errorflagoption = false;
                $(errorMsgobj).text(errormsgOption);
                $(errorMsgobj).css("display", "block");
                return errorflagoption
            }
            else {
                if (sControlType == "CheckBox") {
                    if ($(".CheckBoxListProp").find('.option-value').filter(function () { return $(this).val().toLowerCase() == columnName }).length > 1) {
                        errorflagoption = false;
                        $(errorMsgobj).text(errormsgDuplicateOption);
                        $(errorMsgobj).css("display", "block");
                        return errorflagoption
                    }               
                }
                else if (sControlType == "Radio") {
                    if ($(".RadioGroupProp").find('.option-value').filter(function () { return $(this).val().toLowerCase() == columnName }).length > 1) {
                        errorflagoption = false;
                        $(errorMsgobj).text(errormsgDuplicateOption);
                        $(errorMsgobj).css("display", "block");
                        return errorflagoption
                    }
                }
            }
        });
    }

    return errorflagoption;
}

/*Validate Grid row and columns*/
function validateGrid(sControlType) {
    var errorgridflag = true;

    var colval = $("#Properties").find("#txtGridColumn").val();
    var rowval = $("#Properties").find("#txtGridRow").val();
    $("#Properties").find("#dvGridcol").css("display", "none");
    $("#Properties").find("#dvGridrow").css("display", "none");

    if (colval == 0) {
        $("#Properties").find("#dvGridcol").css("display", "block");
        $("#Properties").find("#dvGridcol").text("Columns value can not be left blank or zero.");
        errorgridflag = false;
    }
    if (rowval == 0) {
        $("#Properties").find("#dvGridrow").css("display", "block");
        $("#Properties").find("#dvGridrow").text("Rows value can not be left blank or zero.");
        errorgridflag = false;
    }

    if (colval > 50) {
        $("#Properties").find("#dvGridcol").css("display", "block");
        $("#Properties").find("#dvGridcol").text("Columns value can not be greater than 50.");
        errorgridflag = false;
    }

    if (rowval > 50) {
        $("#Properties").find("#dvGridrow").css("display", "block");
        $("#Properties").find("#dvGridrow").text("Rows value can not be greater than 50.");
        errorgridflag = false;
    }

    return errorgridflag;
}

/* Populate control Properties*/
function populateControlProperties(sControlId, sControlType) {


    //var sControlId = $('#hdnSelectedControlId').val();
    var LabelText = $("#" + sControlId).find("label").length > 1 ? $("#" + sControlId).find("label")["1"].innerText : "";
    var chkShowLabel = $("#" + sControlId).find(":input").attr("isshowlabel");
    var ControlName = $("#" + sControlId).find(":input").attr("id");
    var ButtonName = $("#" + sControlId).find(":input").attr("value");
    var TextBoxPlaceholder = $("#" + sControlId).find(":input").attr("placeholder");
    var MaxLength = $("#" + sControlId).find(":input").attr("maxlength");
    //var ControlWidth = $("#" + sControlId).find(":input").length ? $("#" + sControlId).find(":input").css("width").replace("px", "") : "";
    var ControlWidth = $("#" + sControlId).find(":input").length ? $("#" + sControlId).find(":input").outerWidth() : "";
    var chkRequired = $("#" + sControlId).find(":input").attr("isrequired");
    var chkDisabled = $("#" + sControlId).find(":input").attr("isDisabled");
    var chkAutoGenerated = $("#" + sControlId).find(":input").attr("isAutoGenerated");
    var AutoGeneratedVal = $("#" + sControlId).find(":input").attr("autoGeneratedVal");
    var AutoGeneratedValDig = $("#" + sControlId).find(":input").attr("autoGeneratedValDig");
    var DataType = typeof ($("#" + sControlId).find(":input").attr("DataType")) != 'undefined' ? $("#" + sControlId).find(":input").attr("DataType") : $("#Properties").find("select").val();
    var MinValue = $("#" + sControlId).find(":input").attr("min");
    var MaxValue = $("#" + sControlId).find(":input").attr("max");
    var Precisiondigit = $("#" + sControlId).find(":input").attr("Precisiondigit");
    var SectionName = $("#" + sControlId).find(":input").attr("SectionName");
    var Tooltip = $("#" + sControlId).find(":input").attr("title");
    var DataFormat = $("#" + sControlId).find(":input").attr("dataformat");
    var chkAutofill = $("#" + sControlId).find(":input").attr("chkAutofill");
    
  
    // $("input:text:visible:first").focus();
    $("#Properties").find('.LabelText').focus();
    $("#Properties").find('.LabelText').val(LabelText);
    $("#Properties").find('.ControlName').val(ControlName);
    $("#Properties").find('.ButtonName').val(ButtonName);
    $("#Properties").find('.TextBoxPlaceholder').val(TextBoxPlaceholder);
    $("#Properties").find('.MaxLength').val(MaxLength);
    $("#Properties").find('.ControlWidth').val(ControlWidth);
    $("#Properties").find('.Tooltip').val(Tooltip == '' ? TextBoxPlaceholder : Tooltip);
    $("#Properties").find('.MaxLength').val(MaxLength);
    

  
    var patternpopuval;
    var keyval = "";
    //Added Pattren attributes for controls
    if (typeof (DataType) != 'undefined')
        if (DataType.length > 0) {
            if (DataType == "Alpha") {
                patternpopuval = alphaPattren;
                keyval = "return alphabetsOnly(event)";
            }
            else if (DataType == "AlphaNumeric") {
                patternpopuval = alphanumericPattern;
                keyval = "return alphabetsAndNumericOnly(event)";
            }
            else if (DataType == "Numeric") {
                keyval = "return numericWithDecimalPoint(event,$(this).val())";
                patternpopuval = numericWithDecialPointPattern;
            }
            else if (DataType == "FreeText") {
                keyval = "return alphanumericWithSpecialCharacter(event)"
                patternpopuval = alphanumericWithSecialCharPattern;
            }
            else if (DataType == "Date") {
                patternpopuval = datePattern;
            }

            //Enable date picker if datatype date
            if (DataType == "Date")
                EnabledDatePickerForOptions();
            else DisabledDatePickerForOptions();
        }

    if (chkRequired == "true")
        $("#Properties").find('#chkRequired').attr('checked', true);

    if (chkDisabled == "true")
      $("#Properties").find('#chkDisabled').attr('checked', true);

    if (chkShowLabel == "true")
      $("#Properties").find('#chkShowLabel').attr('checked', true);

  if (chkAutofill == "true")
    $("#Properties").find('#chkAutofill').attr('checked', true);
 
  
  if (sControlType == "TextBox") {

    if (chkAutofill) {
      if (DataType != "Select")
        $("#Properties").find('.DataType').val(DataType);

      $("#dvAGenerated").css("display", "none");
      $("#customtxt").css("display", "none");
      $("#autofilloptionstxt").css("display", "block");
      var AutoFillDbType = $("#" + sControlId).find(":input").attr("AutoFillDbType");
      var AutoFillServer = $("#" + sControlId).find(":input").attr("AutoFillServer");
      var AutoFillAuthMode = $("#" + sControlId).find(":input").attr("AutoFillAuthMode");
      var AutoFillUserName = $("#" + sControlId).find(":input").attr("AutoFillUserName");
      var AutoFillPassword = $("#" + sControlId).find(":input").attr("AutoFillPassword");
      var AutoFillPort = $("#" + sControlId).find(":input").attr("AutoFillPort");
      var AutoFillDatabase = $("#" + sControlId).find(":input").attr("AutoFillDatabase");
      var AutoFillTable = $("#" + sControlId).find(":input").attr("AutoFillTable");
      var AutoFillTableColumn = $("#" + sControlId).find(":input").attr("AutoFillTableColumn");
      var AutoFillSqlQuery = $("#" + sControlId).find(":input").attr("AutoFillSqlQuery");
      var AutoFillValue = $("#" + sControlId).find(":input").attr("AutoFillValue");


      var OptionArray = {};
      OptionArray["dbType"] = AutoFillDbType;
      if (AutoFillDbType === "SQL") {
        $("#dvAuthMode").css("display", "block");
        $("#dvPort").css("display", "none");

      } else {
        $("#dvAuthMode").css("display", "none");
        $("#dvPort").css("display", "block");
        $("#dvUsr").css("display", "block");
      }
      OptionArray["serverName"] = AutoFillServer;
      OptionArray["authMode"] = AutoFillAuthMode;
      //if (AutoFillAuthMode === "Windows") {
      //  $("#dvUsr").css("display", "none");

      //} else {
      //  $("#dvUsr").css("display", "block");
      //}
      OptionArray["userName"] = AutoFillUserName;
      OptionArray["password"] = AutoFillPassword;
      OptionArray["port"] = AutoFillPort;
      OptionArray["database"] = null;
      OptionArray["table"] = null;
      OptionArray["tableColumn"] = null;
      OptionArray["sqlQuery"] = null;
      getDBDetailsFill(OptionArray, "ddlDatabase", AutoFillDatabase);
      OptionArray["database"] = AutoFillDatabase;
      if ((AutoFillSqlQuery == "") || (AutoFillSqlQuery == null)) {
        $('input[name="rblTableSql"]').filter("[value=Table]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "none");
        $("#divOptTable").css("display", "block");

        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = null;
        getDBDetailsFill(OptionArray, "ddlTablesList", AutoFillTable);

        OptionArray["table"] = AutoFillTable;
        getDBDetailsFill(OptionArray, "ddlColumn", AutoFillTableColumn);
        OptionArray["tableColumn"] = AutoFillTableColumn;
        OptionArray["sqlQuery"] = null;
      }
      else {
        $('input[name="rblTableSql"]').filter("[value=SQLQuery]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "block");
        $("#divOptTable").css("display", "none");
        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = AutoFillSqlQuery;
      }

      getDBDetails(OptionArray, "ddlColValues");
      if ((AutoFillValue == "") || (AutoFillValue == null)) { }
      getDBDetailsforTxt(OptionArray);

      if (AutoFillDbType != undefined)
        $("#Properties").find('.AutoFillDbType').val(AutoFillDbType);

      $("#Properties").find('.AutoFillServer').val(AutoFillServer);

      if (AutoFillAuthMode != undefined)
        $('input[name="rblAuthenticationMode"]').filter("[value=" + AutoFillAuthMode + "]").attr('checked', 'checked');

      $("#Properties").find('.AutoFillUserName').val(AutoFillUserName);

      $("#Properties").find('.AutoFillPassword').val(AutoFillPassword);

      $("#Properties").find('.AutoFillPort').val(AutoFillPort);

      $("#Properties").find('.AutoFillSqlQuery').val(AutoFillSqlQuery);
    }
    else {
    
      $("#dvAGenerated").css("display", "block");
      $("#dvAFill").css("display", "block");
     
      $("#customtxt").css("display", "block");
      $("#autofilloptionstxt").css("display", "none");

      if (DataType != "Select")
        $("#Properties").find('.DataType').val(DataType);
      if (DataType == "Numeric") {
        $("#Properties").find('.minmaxcontrol').show();
        $("#Properties").find('.MinValue').val(MinValue);
        $("#Properties").find('.MaxValue').val(MaxValue);
        $("#Properties").find('.Precisiondigit').val(Precisiondigit);
        $("#Properties").find('.MinValue').attr("pattern", patternpopuval);
        $("#Properties").find('.MinValue').attr("onkeydown", keyval);
        $("#Properties").find('.MaxValue').attr("pattern", patternpopuval);
        $("#Properties").find('.MaxValue').attr("onkeydown", keyval);
        $("#Properties").find('.Precisiondigit').attr("pattern", patternpopuval);
        $("#Properties").find('.Precisiondigit').attr("onkeydown", keyval);

      }
    }
       
        //var type = $("#" + sControlId).find("#headerTextdiv").children().first()[0].localName;
  }

    $("#dvAutoGenerated").hide();
    if (chkAutoGenerated == "true") {

      $("#selectDataType option[value='Alpha']").remove();
      $("#selectDataType option[value='FreeText']").remove();
      $("#dvMaxLength").hide();
      $("#dvminmaxcontrol").hide();

      var AutoGenerated = $("#" + sControlId).find(":input").attr("AutoGenerated");
      $("#Properties").find('#chkAutoGenerated').attr('checked', true);
      $("#dvAutoGenerated").show();
      $("#Properties").find('.autoGeneratedVal').val(AutoGeneratedVal);
      $("#Properties").find('.autoGeneratedValDig').val(AutoGeneratedValDig);
      if (DataType === "Numeric") {
        $("#dvAutoGeneratedPrefix").hide();
      } else {
        $("#dvAutoGeneratedPrefix").show();
      }

    }
  if (sControlType == "Calendar") {
    if (chkAutofill) {
      $("#customCal").css("display", "none");
      $("#autofilloptionsCal").css("display", "block");
      var AutoFillDbType = $("#" + sControlId).find(":input").attr("AutoFillDbType");
      var AutoFillServer = $("#" + sControlId).find(":input").attr("AutoFillServer");
      var AutoFillAuthMode = $("#" + sControlId).find(":input").attr("AutoFillAuthMode");
      var AutoFillUserName = $("#" + sControlId).find(":input").attr("AutoFillUserName");
      var AutoFillPassword = $("#" + sControlId).find(":input").attr("AutoFillPassword");
      var AutoFillPort = $("#" + sControlId).find(":input").attr("AutoFillPort");
      var AutoFillDatabase = $("#" + sControlId).find(":input").attr("AutoFillDatabase");
      var AutoFillTable = $("#" + sControlId).find(":input").attr("AutoFillTable");
      var AutoFillTableColumn = $("#" + sControlId).find(":input").attr("AutoFillTableColumn");
      var AutoFillSqlQuery = $("#" + sControlId).find(":input").attr("AutoFillSqlQuery");
      var AutoFillValue = $("#" + sControlId).find(":input").attr("AutoFillValue");


      var OptionArray = {};
      OptionArray["dbType"] = AutoFillDbType;
      if (AutoFillDbType === "SQL") {
        $("#dvAuthMode").css("display", "block");
        $("#dvPort").css("display", "none");

      } else {
        $("#dvAuthMode").css("display", "none");
        $("#dvPort").css("display", "block");
        $("#dvUsr").css("display", "block");
      }
      OptionArray["serverName"] = AutoFillServer;
      OptionArray["authMode"] = AutoFillAuthMode;
      //if (AutoFillAuthMode === "Windows") {
      //  $("#dvUsr").css("display", "none");

      //} else {
      //  $("#dvUsr").css("display", "block");
      //}
      OptionArray["userName"] = AutoFillUserName;
      OptionArray["password"] = AutoFillPassword;
      OptionArray["port"] = AutoFillPort;
      OptionArray["database"] = null;
      OptionArray["table"] = null;
      OptionArray["tableColumn"] = null;
      OptionArray["sqlQuery"] = null;
      getDBDetailsFill(OptionArray, "ddlDatabase", AutoFillDatabase);
      OptionArray["database"] = AutoFillDatabase;
      if ((AutoFillSqlQuery == "") || (AutoFillSqlQuery == null)) {
        $('input[name="rblTableSql"]').filter("[value=Table]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "none");
        $("#divOptTable").css("display", "block");

        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = null;
        getDBDetailsFill(OptionArray, "ddlTablesList", AutoFillTable);

        OptionArray["table"] = AutoFillTable;
        getDBDetailsFill(OptionArray, "ddlColumn", AutoFillTableColumn);
        OptionArray["tableColumn"] = AutoFillTableColumn;
        OptionArray["sqlQuery"] = null;
      }
      else {
        $('input[name="rblTableSql"]').filter("[value=SQLQuery]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "block");
        $("#divOptTable").css("display", "none");
        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = AutoFillSqlQuery;
      }

      getDBDetails(OptionArray, "ddlColValues");
      if ((AutoFillValue == "") || (AutoFillValue == null)) { }
      getDBDetailsforTxt(OptionArray);

      if (AutoFillDbType != undefined)
        $("#Properties").find('.AutoFillDbType').val(AutoFillDbType);

      $("#Properties").find('.AutoFillServer').val(AutoFillServer);

      if (AutoFillAuthMode != undefined)
        $('input[name="rblAuthenticationMode"]').filter("[value=" + AutoFillAuthMode + "]").attr('checked', 'checked');

      $("#Properties").find('.AutoFillUserName').val(AutoFillUserName);

      $("#Properties").find('.AutoFillPassword').val(AutoFillPassword);

      $("#Properties").find('.AutoFillPort').val(AutoFillPort);

      $("#Properties").find('.AutoFillSqlQuery').val(AutoFillSqlQuery);
    }
    else {
      $("#customCal").css("display", "block");
      $("#autofilloptionsCal").css("display", "none");
      $("#Properties").find('.MinValue').val(MinValue);
      $("#Properties").find('.MaxValue').val(MaxValue);
      $("#Properties").find('.DataFormat').val(DataFormat);
      $("#Properties").find('.MinValue').datepicker({ dateFormat: datePattern });
      $("#Properties").find('.MaxValue').datepicker({ dateFormat: datePattern });
     
    }
        

    }

    var SectionName = $("#Properties").find('.SectionName').val(SectionName);
  if (sControlType == "CheckBox") {

    if (chkAutofill) {

      $("#customoptions").css("display", "none");
      $("#autofilloptions").css("display", "block");
      var AutoFillDbType = $("#" + sControlId).find(":input").attr("AutoFillDbType");
      var AutoFillServer = $("#" + sControlId).find(":input").attr("AutoFillServer");
      var AutoFillAuthMode = $("#" + sControlId).find(":input").attr("AutoFillAuthMode");
      var AutoFillUserName = $("#" + sControlId).find(":input").attr("AutoFillUserName");
      var AutoFillPassword = $("#" + sControlId).find(":input").attr("AutoFillPassword");
      var AutoFillPort = $("#" + sControlId).find(":input").attr("AutoFillPort");
      var AutoFillDatabase = $("#" + sControlId).find(":input").attr("AutoFillDatabase");
      var AutoFillTable = $("#" + sControlId).find(":input").attr("AutoFillTable");
      var AutoFillTableColumn = $("#" + sControlId).find(":input").attr("AutoFillTableColumn");
      var AutoFillSqlQuery = $("#" + sControlId).find(":input").attr("AutoFillSqlQuery");
      var AutoFillValue = $("#" + sControlId).find(":input").attr("AutoFillValue");
      

      var OptionArray = {};
      OptionArray["dbType"] = AutoFillDbType;
      if (AutoFillDbType === "SQL") {
        $("#dvAuthMode").css("display", "block");
        $("#dvPort").css("display", "none");

      } else {
        $("#dvAuthMode").css("display", "none");
        $("#dvPort").css("display", "block");
        $("#dvUsr").css("display", "block");
      }
      OptionArray["serverName"] = AutoFillServer;
      OptionArray["authMode"] = AutoFillAuthMode;
      //if (AutoFillAuthMode === "Windows") {
      //  $("#dvUsr").css("display", "none");

      //} else {
      //  $("#dvUsr").css("display", "block");
      //}
      OptionArray["userName"] = AutoFillUserName;
      OptionArray["password"] = AutoFillPassword;
      OptionArray["port"] = AutoFillPort;
      OptionArray["database"] = null;
      OptionArray["table"] = null;
      OptionArray["tableColumn"] = null;
      OptionArray["sqlQuery"] = null;
      getDBDetailsFill(OptionArray, "ddlDatabase", AutoFillDatabase);
      OptionArray["database"] = AutoFillDatabase;
      if ((AutoFillSqlQuery == "") || (AutoFillSqlQuery == null)) {
        $('input[name="rblTableSql"]').filter("[value=Table]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "none");
        $("#divOptTable").css("display", "block");

        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = null;
        getDBDetailsFill(OptionArray, "ddlTablesList", AutoFillTable);

        OptionArray["table"] = AutoFillTable;
        getDBDetailsFill(OptionArray, "ddlColumn", AutoFillTableColumn);
        OptionArray["tableColumn"] = AutoFillTableColumn;
        OptionArray["sqlQuery"] = null;
      }
      else {
        $('input[name="rblTableSql"]').filter("[value=SQLQuery]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "block");
        $("#divOptTable").css("display", "none");
        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = AutoFillSqlQuery;
      }

      getDBDetails(OptionArray, "ddlColValues");
      if ((AutoFillValue == "") || (AutoFillValue == null)) { }
      getDBDetailsforTxt(OptionArray);

      if (AutoFillDbType != undefined)
        $("#Properties").find('.AutoFillDbType').val(AutoFillDbType);

      $("#Properties").find('.AutoFillServer').val(AutoFillServer);

      if (AutoFillAuthMode != undefined)
        $('input[name="rblAuthenticationMode"]').filter("[value=" + AutoFillAuthMode + "]").attr('checked', 'checked');

      $("#Properties").find('.AutoFillUserName').val(AutoFillUserName);

      $("#Properties").find('.AutoFillPassword').val(AutoFillPassword);

      $("#Properties").find('.AutoFillPort').val(AutoFillPort);

      $("#Properties").find('.AutoFillSqlQuery').val(AutoFillSqlQuery);
    }
    else {
      $("#customoptions").css("display", "block");
      $("#autofilloptions").css("display", "none");
    if (DataType != "Select")
      $("#Properties").find('.DataType').val(DataType);

    $(".CheckBoxProp li").remove();
    $("#" + sControlId).find(":CheckBox").each(function () {
      if ($(this).is(':checked'))
        $("ol").append('<li class=""><div style="position:relative"><input  pattern="' + patternpopuval + '" onkeydown="' + keyval + '" class="option-value" value="' + this.value + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" name="radio-group-option" placeholder="Value" maxlength="50" type="text" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span>&nbsp;<input type="checkbox" class="selected" style="height:15px;width:15px;" title="Default selected" checked /> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
      else
        $("ol").append('<li class=""><div style="position:relative"><input pattern="' + patternpopuval + '" onkeydown="' + keyval + '" class="option-value" value="' + this.value + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" name="radio-group-option" placeholder="Value" maxlength="50" type="text" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span>&nbsp;<input type="checkbox" class="selected" style="height:15px;width:15px;" title="Default selected" /> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');

      if ($(this).attr("isrequired") == "true")
        $("#Properties").find('#chkRequired').attr('checked', true);
    });
  }
    }
  if (sControlType == "Radio") {

    if (chkAutofill) {

      $("#customoptions").css("display", "none");
      $("#autofilloptions").css("display", "block");
      var AutoFillDbType = $("#" + sControlId).find(":Radio").attr("AutoFillDbType");
      var AutoFillServer = $("#" + sControlId).find(":Radio").attr("AutoFillServer");
      var AutoFillAuthMode = $("#" + sControlId).find(":Radio").attr("AutoFillAuthMode");
      var AutoFillUserName = $("#" + sControlId).find(":Radio").attr("AutoFillUserName");
      var AutoFillPassword = $("#" + sControlId).find(":Radio").attr("AutoFillPassword");
      var AutoFillPort = $("#" + sControlId).find(":Radio").attr("AutoFillPort");
      var AutoFillDatabase = $("#" + sControlId).find(":Radio").attr("AutoFillDatabase");
      var AutoFillTable = $("#" + sControlId).find(":Radio").attr("AutoFillTable");
      var AutoFillTableColumn = $("#" + sControlId).find(":Radio").attr("AutoFillTableColumn");
      var AutoFillSqlQuery = $("#" + sControlId).find(":Radio").attr("AutoFillSqlQuery");

      var OptionArray = {};
      OptionArray["dbType"] = AutoFillDbType;
      if (AutoFillDbType === "SQL") {
        $("#dvAuthMode").css("display", "block");
        $("#dvPort").css("display", "none");

      } else {
        $("#dvAuthMode").css("display", "none");
        $("#dvPort").css("display", "block");
        $("#dvUsr").css("display", "block");
      }
      OptionArray["serverName"] = AutoFillServer;
      OptionArray["authMode"] = AutoFillAuthMode;
      //if (AutoFillAuthMode === "Windows") {
      //  $("#dvUsr").css("display", "none");

      //} else {
      //  $("#dvUsr").css("display", "block");
      //}
      OptionArray["userName"] = AutoFillUserName;
      OptionArray["password"] = AutoFillPassword;
      OptionArray["port"] = AutoFillPort;
      OptionArray["database"] = null;
      OptionArray["table"] = null;
      OptionArray["tableColumn"] = null;
      OptionArray["sqlQuery"] = null;
      getDBDetailsFill(OptionArray, "ddlDatabase", AutoFillDatabase);
      OptionArray["database"] = AutoFillDatabase;
      if ((AutoFillSqlQuery == "") || (AutoFillSqlQuery == null)) {
        $('input[name="rblTableSql"]').filter("[value=Table]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "none");
        $("#divOptTable").css("display", "block");

        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = null;
        getDBDetailsFill(OptionArray, "ddlTablesList", AutoFillTable);

        OptionArray["table"] = AutoFillTable;
        getDBDetailsFill(OptionArray, "ddlColumn", AutoFillTableColumn);
        OptionArray["tableColumn"] = AutoFillTableColumn;
        OptionArray["sqlQuery"] = null;
      }
      else {
        $('input[name="rblTableSql"]').filter("[value=SQLQuery]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "block");
        $("#divOptTable").css("display", "none");
        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = AutoFillSqlQuery;
      }
      getDBDetails(OptionArray, "ddlColValues");


      if (AutoFillDbType != undefined)
        $("#Properties").find('.AutoFillDbType').val(AutoFillDbType);

      $("#Properties").find('.AutoFillServer').val(AutoFillServer);

      if (AutoFillAuthMode != undefined)
        $('input[name="rblAuthenticationMode"]').filter("[value=" + AutoFillAuthMode + "]").attr('checked', 'checked');

      $("#Properties").find('.AutoFillUserName').val(AutoFillUserName);

      $("#Properties").find('.AutoFillPassword').val(AutoFillPassword);

      $("#Properties").find('.AutoFillPort').val(AutoFillPort);

      $("#Properties").find('.AutoFillSqlQuery').val(AutoFillSqlQuery);
    }
    else {
      $("#customoptions").css("display", "block");
      $("#autofilloptions").css("display", "none");
    if (DataType != "Select")
      $("#Properties").find('.DataType').val(DataType);

    $(".RadioGroupProp li").remove();
    $("#" + sControlId).find(":Radio").each(function () {

      if ($(this).is(':checked'))
        $("ol").append('<li class=""><div style="position:relative"><input  pattern="' + patternpopuval + '" onkeydown="' + keyval + '" class="option-value" value="' + this.value + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" name="radio-group-option" placeholder="Value" type="text" maxlength="50" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span>&nbsp;<input type="radio" name="lstradio" class="radioselected" style="height:15px;width:15px;" title="Default selected" checked /> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div><div></li>');

      else
        $("ol").append('<li class=""><div style="position:relative"><input  pattern="' + patternpopuval + '" onkeydown="' + keyval + '" class="option-value" value="' + this.value + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" name="radio-group-option" placeholder="Value" type="text" maxlength="50" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span>&nbsp;<input type="radio" name="lstradio" class="radioselected" style="height:15px;width:15px;" title="Default selected" /><a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div><div></li>');


      if ($(this).attr("isrequired") == "true")
        $("#Properties").find('#chkRequired').attr('checked', true);
    });
  }
    }
  if (sControlType == "DropDownList") {

    var optionOrder = $("#" + sControlId).find(":input").attr("optionOrder");
    if (optionOrder != undefined)
      $('input[name="rdbDdl"]').filter("[value=" + optionOrder + "]").attr('checked', 'checked');

    if (chkAutofill) {
      
      $("#customoptions").css("display", "none");
      $("#autofilloptions").css("display", "block");
      var AutoFillDbType = $("#" + sControlId).find(":input").attr("AutoFillDbType");
      var AutoFillServer = $("#" + sControlId).find(":input").attr("AutoFillServer");
      var AutoFillAuthMode = $("#" + sControlId).find(":input").attr("AutoFillAuthMode");
      var AutoFillUserName = $("#" + sControlId).find(":input").attr("AutoFillUserName");
      var AutoFillPassword = $("#" + sControlId).find(":input").attr("AutoFillPassword");
      var AutoFillPort = $("#" + sControlId).find(":input").attr("AutoFillPort");
      var AutoFillDatabase = $("#" + sControlId).find(":input").attr("AutoFillDatabase");
      var AutoFillTable = $("#" + sControlId).find(":input").attr("AutoFillTable");
      var AutoFillTableColumn = $("#" + sControlId).find(":input").attr("AutoFillTableColumn");
      var AutoFillSqlQuery = $("#" + sControlId).find(":input").attr("AutoFillSqlQuery");
      
      var OptionArray = {};
      OptionArray["dbType"] = AutoFillDbType;
      if (AutoFillDbType === "SQL") {
        $("#dvAuthMode").css("display", "block");
        $("#dvPort").css("display", "none");

      } else {
        $("#dvAuthMode").css("display", "none");
        $("#dvPort").css("display", "block");
        $("#dvUsr").css("display", "block");
      }
      OptionArray["serverName"] = AutoFillServer;
      OptionArray["authMode"] = AutoFillAuthMode;
      //if (AutoFillAuthMode === "Windows") {
      //  $("#dvUsr").css("display", "none");

      //} else {
      //  $("#dvUsr").css("display", "block");
      //}
      OptionArray["userName"] = AutoFillUserName;
      OptionArray["password"] = AutoFillPassword;
      OptionArray["port"] = AutoFillPort;
      OptionArray["database"] = null;
      OptionArray["table"] = null;
      OptionArray["tableColumn"] = null;
      OptionArray["sqlQuery"] = null;
      getDBDetailsFill(OptionArray, "ddlDatabase", AutoFillDatabase);
      OptionArray["database"] = AutoFillDatabase;
      if ((AutoFillSqlQuery == "") || (AutoFillSqlQuery == null)) {
        $('input[name="rblTableSql"]').filter("[value=Table]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "none");
        $("#divOptTable").css("display", "block");
        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = null;
        getDBDetailsFill(OptionArray, "ddlTablesList", AutoFillTable);
    
        OptionArray["table"] = AutoFillTable;
        getDBDetailsFill(OptionArray, "ddlColumn", AutoFillTableColumn);
        OptionArray["tableColumn"] = AutoFillTableColumn;
        OptionArray["sqlQuery"] = null;
      }
      else
      {
        $('input[name="rblTableSql"]').filter("[value=SQLQuery]").attr('checked', 'checked');
        $("#divOptSqlQuery").css("display", "block");
        $("#divOptTable").css("display", "none");
        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = AutoFillSqlQuery;
      }
      getDBDetails(OptionArray, "ddlColValues");

     
      if (AutoFillDbType != undefined)
        $("#Properties").find('.AutoFillDbType').val(AutoFillDbType);
  
      $("#Properties").find('.AutoFillServer').val(AutoFillServer);
           
      if (AutoFillAuthMode != undefined)
        $('input[name="rblAuthenticationMode"]').filter("[value=" + AutoFillAuthMode + "]").attr('checked', 'checked');
            
      $("#Properties").find('.AutoFillUserName').val(AutoFillUserName);

      $("#Properties").find('.AutoFillPassword').val(AutoFillPassword);
            
      $("#Properties").find('.AutoFillPort').val(AutoFillPort);
                      
      $("#Properties").find('.AutoFillSqlQuery').val(AutoFillSqlQuery);
    }
    else {
      $("#customoptions").css("display", "block");
      $("#autofilloptions").css("display", "none");
      if (DataType != "Select")
        $("#Properties").find('.DataType').val(DataType);

      $(".DropDownListProp li").remove();
      $("#" + sControlId + " option").each(function () {

        $("ol").append('<li class=""><div style="position:relative"><input  pattern="' + patternpopuval + '" onkeydown="' + keyval + '" class="option-value" value="' + $(this).text() + '" autofillid="' + $(this).attr("autofillid") + '" fieldid="' + $(this).attr("fieldid") + '" name="radio-group-option" placeholder="Value" type="text" maxlength="50" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');

        if ($(this).attr("isrequired") == "true")
          $("#Properties").find('#chkRequired').attr('checked', true);
      });
    }

    }

  if (sControlType == "MultiSelect") {
    var optionOrder = $("#" + sControlId).find(":input").attr("optionOrder");
    if (optionOrder != undefined)
      $('input[name="rdbMSel"]').filter("[value=" + optionOrder + "]").attr('checked', 'checked');

    if (chkAutofill) {

      $("#customoptions").css("display", "none");
      $("#autofilloptions").css("display", "block");
      var AutoFillDbType = $("#" + sControlId).find(":input").attr("AutoFillDbType");
      var AutoFillServer = $("#" + sControlId).find(":input").attr("AutoFillServer");
      var AutoFillAuthMode = $("#" + sControlId).find(":input").attr("AutoFillAuthMode");
      var AutoFillUserName = $("#" + sControlId).find(":input").attr("AutoFillUserName");
      var AutoFillPassword = $("#" + sControlId).find(":input").attr("AutoFillPassword");
      var AutoFillPort = $("#" + sControlId).find(":input").attr("AutoFillPort");
      var AutoFillDatabase = $("#" + sControlId).find(":input").attr("AutoFillDatabase");
      var AutoFillTable = $("#" + sControlId).find(":input").attr("AutoFillTable");
      var AutoFillTableColumn = $("#" + sControlId).find(":input").attr("AutoFillTableColumn");
      var AutoFillSqlQuery = $("#" + sControlId).find(":input").attr("AutoFillSqlQuery");

      var OptionArray = {};
      OptionArray["dbType"] = AutoFillDbType;
      if (AutoFillDbType === "SQL") {
        $("#dvAuthMode").css("display", "block");
        $("#dvPort").css("display", "none");

      } else {
        $("#dvAuthMode").css("display", "none");
        $("#dvPort").css("display", "block");
        $("#dvUsr").css("display", "block");
      }
      OptionArray["serverName"] = AutoFillServer;
      OptionArray["authMode"] = AutoFillAuthMode;
      //if (AutoFillAuthMode === "Windows") {
      //  $("#dvUsr").css("display", "none");

      //} else {
      //  $("#dvUsr").css("display", "block");
      //}
      OptionArray["userName"] = AutoFillUserName;
      OptionArray["password"] = AutoFillPassword;
      OptionArray["port"] = AutoFillPort;
      OptionArray["database"] = null;
      OptionArray["table"] = null;
      OptionArray["tableColumn"] = null;
      OptionArray["sqlQuery"] = null;
      getDBDetailsFill(OptionArray, "ddlDatabase", AutoFillDatabase);
      OptionArray["database"] = AutoFillDatabase;
      if ((AutoFillSqlQuery == "") || (AutoFillSqlQuery == null)) {
        $('input[name="rblTableSql"]').filter("[value=Table]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "none");
        $("#divOptTable").css("display", "block");

        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = null;
        getDBDetailsFill(OptionArray, "ddlTablesList", AutoFillTable);

        OptionArray["table"] = AutoFillTable;
        getDBDetailsFill(OptionArray, "ddlColumn", AutoFillTableColumn);
        OptionArray["tableColumn"] = AutoFillTableColumn;
        OptionArray["sqlQuery"] = null;
      }
      else {
        $('input[name="rblTableSql"]').filter("[value=SQLQuery]").attr('checked', 'checked');

        $("#divOptSqlQuery").css("display", "block");
        $("#divOptTable").css("display", "none");
        OptionArray["table"] = null;
        OptionArray["tableColumn"] = null;
        OptionArray["sqlQuery"] = AutoFillSqlQuery;
      }
      getDBDetails(OptionArray, "ddlColValues");


      if (AutoFillDbType != undefined)
        $("#Properties").find('.AutoFillDbType').val(AutoFillDbType);

      $("#Properties").find('.AutoFillServer').val(AutoFillServer);

      if (AutoFillAuthMode != undefined)
        $('input[name="rblAuthenticationMode"]').filter("[value=" + AutoFillAuthMode + "]").attr('checked', 'checked');

      $("#Properties").find('.AutoFillUserName').val(AutoFillUserName);

      $("#Properties").find('.AutoFillPassword').val(AutoFillPassword);

      $("#Properties").find('.AutoFillPort').val(AutoFillPort);

      $("#Properties").find('.AutoFillSqlQuery').val(AutoFillSqlQuery);
    }
    else {
      $("#customoptions").css("display", "block");
      $("#autofilloptions").css("display", "none");
    if (DataType != "Select")
      $("#Properties").find('.DataType').val(DataType);

    $(".MultiSelectProp li").remove();
    $("#" + sControlId + " option").each(function () {
      $("ol").append('<li class=""><div style="position:relative"><input  pattern="' + patternpopuval + '" onkeydown="' + keyval + '" class="option-value" value="' + $(this).text() + '" autofillid="' + $(this).attr("autofillid") + '" maxlength="50" fieldid="' + $(this).attr("fieldid") + '" name="radio-group-option" placeholder="Value" type="text" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');

      if ($(this).attr("isrequired") == "true")
        $("#Properties").find('#chkRequired').attr('checked', true);
    });
  }
    }

    if (sControlType == "PageHeader") {
        $("#Properties").find('#HeaderImage').attr("src", $("#HeaderImageMain").attr("src"));
        var width = $("#HeaderImageMain").css("width").replace("px", "");
        var height = $("#HeaderImageMain").css("height").replace("px", "");

        $("#Properties").find('.ControlWidth').val(width);
        $("#Properties").find('.ControlHeight').val(height);
    }

    if (sControlType == "Button") {
        var buttonType = $("#" + sControlId).find(":input").attr('type')
        var buttonColor = $("#" + sControlId).find(":input").attr('class')
        if (buttonType.length)
            $("#Properties").find('#ButtonType').val(buttonType);
        if (buttonColor.length)
            $("#Properties").find('#ButtonColor').val(buttonColor);
        //var buttonColor = $("#" + sControlId).find(":input")[0].class;
    }

    if (sControlType == "Header" || sControlType == "PageHeader") {
        var type, headerText;

        if (typeof ($("#" + sControlId).find("#headerTextdiv").children()[0]) != 'undefined') {
            type = $("#" + sControlId).find("#headerTextdiv").children()[0].tagName;
            headerText = $("#" + sControlId).find("div").children()[0].innerHTML;
            if (type.length)
                $("#Properties").find('#Type').val(type.toUpperCase());

            $("#Properties").find('.HeaderText').val(headerText);
        }
        var textAlign = $("#" + sControlId).find("#headerTextdiv").css("text-align");

        if (textAlign.length)
            $("#Properties").find('#TextAlign').val(textAlign);
        $("#Properties").find('.HeaderText').focus();
    }

    if (sControlType == "Tab") {
        $("#" + sControlId).find(".tablinks").each(function () {
          var colHeaderTab = this.value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          $("ol").append('<li class=""><div style="position:relative"><input class="option-value" value="' + colHeaderTab + '" autofillid="' + $(this).attr("id") + '" fieldid="' + $(this).attr("id") + '" maxlength="50" name="radio-group-option" placeholder="Value" type="text" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
        });
    }

    if (sControlType == "Grid") {
        var gridId = $("#" + sControlId).find(".controls div:first").attr("id");
        //Get column
        $("#Properties").find('#txtGridColumn').val($("#" + sControlId).find("#" + gridId).find("tr:first").find("td").length);
        //Get rows
        $("#Properties").find('#txtGridRow').val($("#" + sControlId).find("#" + gridId).find("tr").length);
    }

    if (sControlType == "Table") {
        var tblId = $("#" + sControlId).find(".controls div:first").attr("id");
        //Get column header text
      $("#" + sControlId).find("#" + tblId).find("tr th.columnheadercontent").each(function (index) {
            var colHeaderTable = $(this).text().replace(/</g, '&lt;').replace(/>/g, '&gt;');
        $("ol").append('<li id="lstCols" class="cols"><div style="position:relative"><input class="option-value" value="' + colHeaderTable + '" name="table-cols-group-option" maxlength="50" placeholder="Column' + (index + 1) + '" type="text" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
        });

        //Get Rows
        $("#Properties").find('#txtTableRow').val($("#" + sControlId).find("#" + tblId).find("tr").length);
    }

    if (sControlType == "ExcelGrid") {
        var tblId = $("#" + sControlId).find(".controls div:first").attr("id");

        //Get column header text
        $("#" + sControlId).find("#" + tblId).find("tr th.columnheaderexcelcontent").each(function (index) {
            var typeVal = $(this).attr("columntype");
          var sourceVal = $(this).attr("columnsource");
          var colHeaderExcel = $(this).text().replace(/</g, '&lt;').replace(/>/g, '&gt;');
          $("ol").append('<li id="lstCols" class="cols"><div style="position:relative"><input class="option-value" value="' + colHeaderExcel + '" name="table-cols-group-option" maxlength="50" placeholder="Column' + (index + 1) + '" type="text" style="width:115px" autocomplete="off">&nbsp;<span class="erroralert">*</span><select class="ColumnType" id="select" style="width:115px;height:20px;font-size:12px;margin-top: 6px;" onchange="getSourceValue(this)"><option value="date">Date</option><option value="dropdown">Dropdown</option><option value="text">Text</option></select><div style="display:none;"><input type="text" placeholder="Enter value" title="Enter comma separated string" style="width:115px; height:20px;margin-top: 6px;">&nbsp;<span class="erroralert">*</span></div><a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
            $("#Properties").find(".ColumnType").each(function (innerindex) {
                if (index == innerindex) {
                    $(this).val(typeVal)

                    if (typeVal == 'dropdown') {
                        $(this).next().show();
                        $(this).next().find(":input").val(sourceVal);
                    }
                }
            });
        });

        //Get Rows
        $("#Properties").find('#txtExcelGridRow').val($("#" + sControlId).find("#" + tblId).find("tr").length);
    }
    //disableCutCopyPaste();
}

/*show and hide min , amx value section*/
function showhideminmaxcontrol(e) {
   
    //alert($(".minmaxcontrol  option:selected").val());
  if ($("#selectDataType :selected").text() == "Numeric") {
      $("#dvAutoGeneratedPrefix").css("display", "none");
      var chkAutoGenerated = $("#Properties").find('#chkAutoGenerated').length ? $("#Properties").find('#chkAutoGenerated').is(':checked') : false;
      if (chkAutoGenerated === false) {
        $('.minmaxcontrol').show();
        onChangeNumericDataType();
      }
     
    }
    else {
        $('.minmaxcontrol').hide();
      $('.minmaxcontrol').find('input:text').val('');
      $("#dvAutoGeneratedPrefix").css("display", "block");
    }
}

/* Get token Header*/
function getTokenHeaders() {
    var headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var token = currentUser && currentUser.token;
    return token;
}

/* Save Form Json into Database*/
function SetJSON(IsPublished) {
  $("#btnSaveForm").attr("disabled", "disabled");

  if (jQuery(".propertyDiv").css('display') == 'block') {
    alert("Please save control properties before saving template");
    return false;
  }
  //$("#btnSaveForm").attr("enabled", "enabled");

  if ($('#TemplateName').val() == '') {
   // alert("Please enter template name");
    bootbox.alert("Please enter template name");

   return false;
  }
  if (($('#TemplateType').val() === '')|| ($('#TemplateType').val() === "0")) {
    alert("Please select any template type");

    return false;
  }
  var isDefault = false;
  if (templateId == null) {
    if (typeModuleOpt === "1")
      isDefault = true;
  } else {
    isDefault = IsDataDefault;
  }
  
 
  jsonObj = [];
  $('#maindiv > .dropped').filter(function () {
    if ($(this).parents('#maindiv').length === 1) {
      jsonObj.push(getControlPropertyValues($(this)["0"].id));
    }
  });

  $("#jsontext").html(jsonObj);
  if (jsonObj.length == 0) {
    alert("Please enter form content");
    return false;
  }
 
  content = JSON.stringify(jsonObj);

  var formId = $("#hdnFormId").val();
  var templateName = $('#TemplateName').val();
  var templateType = $('#TemplateType').val();
  var templateTypeId = parseInt(templateType);
  var requestURL = window.location.protocol + "//" + window.location.host + "/Template/save";

  var DynamicTemplateJson = {
    TemplateName: templateName, TemplateJson: content, TemplateTypeId: templateTypeId, TemplateId: templateId == null ? 0 : templateId, IsPublished: IsPublished, IsDefault: isDefault
  }
  var postData = JSON.stringify(DynamicTemplateJson);

  $.ajax({
    url: requestURL,
    data: postData,
    type: 'Post',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    // Fetch the stored token from localStorage and set in the header
    headers: {
      'PyramidTokenHeader': getTokenHeaders()
    },

    success: function (response) {
      $("#btnSaveForm").attr("enabled", "enabled");
      response != null ? ShowMessageforSavingTemplate(response) : alert("error in form submitted.");
    }
    //error: HandleError
  });
}


function ShowMessageforSavingTemplate(response) {
    if (response.IsValid) {
        alert(response.Message);
        parent.location.reload();
        if (templateId == null)
            $("#btnSaveForm").attr("disabled", "disabled");
    }
    else
        alert(response.Message);
}

/* Get Form Control Properties as Json*/
function getControlPropertyValues(parentId) {
 
    var HeaderImageMain;
    var autofilid;
    var parentControl = $("#" + parentId);
    var divDataType = parentControl.attr("data-type");
    item = {}
    if (divDataType != "Tab" && parentControl.parent().attr("id") == "maindiv" && divDataType != "Grid" && divDataType != "Table" && divDataType != "ExcelGrid") {

        var controlType = parentControl.find(":input").attr("type");
        var buttonName = parentControl.find(":input").attr("value");
        var controlId = parentControl.find(":input").attr("id");
        var name = parentControl.find(":input").attr("id");
        var labelText = parentControl.find("label").length > 1 ? parentControl.find("label")["1"].innerText : "";
        var showlabel = parentControl.find(":input").attr("isshowlabel");
        var placeholder = parentControl.find(":input").attr("placeholder");
        var tooltip = parentControl.find(":input").attr("title");
        var maxLength = parentControl.find(":input").attr("maxlength");
        //var width = parentControl.find(":input").length ? parentControl.find(":input").css("width").replace("px", "") : "";
        var width = parentControl.find(":input").length ? parentControl.find(":input").outerWidth() : "";
        var required = parentControl.find(":input").attr("isrequired");
        var disabled = parentControl.find(":input").attr("isDisabled");
        var autoGenerated = parentControl.find(":input").attr("isAutoGenerated");
        var autoGeneratedVal = parentControl.find(":input").attr("autoGeneratedVal");
        var autoGeneratedValDig = parentControl.find(":input").attr("autoGeneratedValDig");
        var pattern = typeof (parentControl.find(":input").attr("pattern")) != 'undefined' ? parentControl.find(":input").attr("pattern") : "";
        var dataType = parentControl.find(":input").attr("datatype");
        var eventValidate = typeof (parentControl.find(":input").attr("onkeydown")) != 'undefined' ? parentControl.find(":input").attr("onkeydown") : "";
        var minValue = parentControl.find(":input").attr("min");
        var maxValue = parentControl.find(":input").attr("max");
        var precisiondigit = parentControl.find(":input").attr("Precisiondigit");
        var classValue = parentControl.find(":input").attr("class");
       
        var SectionName = parentControl.find(":input").attr("SectionName");
        var dataFormat = parentControl.find(":input").attr("dataformat");
        var fieldid = parentControl.find(":input").attr("fieldid");
        var optionOrderVal = parentControl.find(":input").attr("optionOrder");

        var chkAutofill = parentControl.find(":input").attr("chkAutofill");
    

        if (typeof dataType == typeof undefined || dataType == false) {
            dataType = "AlphaNumeric";
      }
     
      if (chkAutofill) {
        var AutoFillDbType = parentControl.find(":input").attr("autofillDbType");
        var AutoFillServer = parentControl.find(":input").attr("AutoFillServer");
        var AutoFillAuthMode = parentControl.find(":input").attr("AutoFillAuthMode");
        var AutoFillUserName = parentControl.find(":input").attr("AutoFillUserName");
        var AutoFillPassword = parentControl.find(":input").attr("AutoFillPassword");
        var AutoFillPort = parentControl.find(":input").attr("AutoFillPort");
        var AutoFillDatabase = parentControl.find(":input").attr("AutoFillDatabase");
        var AutoFillTable = parentControl.find(":input").attr("AutoFillTable");
        var AutoFillTableColumn = parentControl.find(":input").attr("AutoFillTableColumn");
        var AutoFillSqlQuery = parentControl.find(":input").attr("AutoFillSqlQuery");
        var AutoFillValue = parentControl.find(":input").attr("AutoFillValue");

      }
      item["chkAutofill"] = chkAutofill;
      item["AutoFillDbType"] = AutoFillDbType;
      item["AutoFillServer"] = AutoFillServer;
      item["AutoFillAuthMode"] = AutoFillAuthMode;
      item["AutoFillUserName"] = AutoFillUserName;
      item["AutoFillPassword"] = AutoFillPassword;
      item["AutoFillPort"] = AutoFillPort;
      item["AutoFillDatabase"] = AutoFillDatabase;
      item["AutoFillTable"] = AutoFillTable;
      item["AutoFillTableColumn"] = AutoFillTableColumn;
      item["AutoFillSqlQuery"] = AutoFillSqlQuery;
      item["AutoFillValue"] = AutoFillValue;


        item["controlId"] = controlId;
        item["name"] = name;
        item["divDataType"] = divDataType;
        item["divId"] = parentId;
        item["controlType"] = controlType;

        item["labelText"] = labelText;
        if (placeholder == undefined) {
          placeholder = "";
        }
      if ((divDataType.toLowerCase() === 'calendar') && (placeholder === "")) {
        placeholder = "Select a date";
      }
        item["placeholder"] = placeholder;
        if (tooltip == undefined) {
        tooltip = "";
        }
        item["tooltip"] = tooltip;
        item["buttonName"] = buttonName;
        item["maxLength"] = maxLength;
        item["width"] = width;
        item["classvalue"] = classValue;
        item["showlabel"] = showlabel == "true" ? true : false;
        item["optionOrder"] = optionOrderVal;
        
        validate = {};
        validate["required"] = required == "true" ? true : false; 
        validate["disabled"] = disabled == "true" ? true : false;
        validate["autoGenerated"] = autoGenerated == "true" ? true : false;
        if (dataType === "Numeric") 
         validate["autoGeneratedVal"] = "";
        else
          validate["autoGeneratedVal"] = autoGeneratedVal;
        validate["autoGeneratedValDig"] = autoGeneratedValDig;
        validate["disabled"] = autoGenerated == "true" ? true : validate["disabled"];
        validate["dataType"] = dataType == "" ? "AlphaNumeric" : dataType;
        validate["minValue"] = minValue;
        validate["maxValue"] = maxValue;
        validate["precisiondigit"] = precisiondigit;
        validate["dataFormat"] = dataFormat;

        validate["pattern"] = pattern;
        validate["eventValidation"] = eventValidate;
        item["validate"] = validate;
    }
    else {
        var labelText = parentControl.find("label").length > 1 ? parentControl.find("label")["1"].innerText : "";
        item["divDataType"] = divDataType;
        item["divId"] = parentId;
        item["labelText"] = labelText;
        item["divContainerId"] = parentControl.find(".controls div:first").attr("id");
    }

    if (divDataType == "Radio") {
        item["width"] = "";
    }
    if (divDataType == "Calendar") {
        dataType = "Date";
    }
    else if (divDataType == "TextBox-MultiLine" || divDataType == "Header" || divDataType == "PageHeader") {
        dataType = "AlphaNumeric";
    }
    if (divDataType == "PageHeader") {

        HeaderImageMain = $("#HeaderImageMain").attr("src");
        HeaderImageMain = HeaderImageMain.replace('data:image/png;base64,', '');
        HeaderImageMain = HeaderImageMain.replace('data:image/jpeg;base64,', '');
        item["headerImage"] = HeaderImageMain;
        item["name"] = "PageHeader";
        item["controlType"] = "PageHeader";
        //var width = $("#HeaderImageMain").css("width").replace("px", "");
        //var height = $("#HeaderImageMain").css("height").replace("px", "");
        item["height"] = $("#HeaderImageMain").css("height").replace("px", "");
        item["width"] = $("#HeaderImageMain").css("width").replace("px", "");
    }
    if (divDataType == "Header" || divDataType == "PageHeader") {
      
        item["headerText"] = parentControl.find("#headerTextdiv")[0].innerHTML.trim();
        item["headerTextAlign"] = parentControl.find("#headerTextdiv").css("text-align");
        fieldid = parentControl.find("#headerTextdiv").attr("fieldid");
        item["labelText"] = parentControl.find("#headerTextdiv").children()[0].innerHTML;
    }

    options = [];

  if (divDataType == "CheckBox") {
   
    fieldid = "";
    parentControl.find(":CheckBox").each(function () {

      option = {};
      option['value'] = this.value;
      autofilid = $(this).attr("autofillid");
      if (typeof autofilid !== typeof undefined && autofilid !== false) {
        option['autoFillId'] = autofilid;
      }
      option['Checked'] = "";
      if ($(this).is(':checked')) {
        option['Checked'] = "checked";
      }
      if (fieldid.length == 0)
        fieldid = $(this).attr("fieldid");
      //option['required'] = $(this).attr("required");       
      options.push(option);
    });
  
    }
  if (divDataType == "Radio") {
    
    fieldid = "";
    parentControl.find(":Radio").each(function () {

      option = {};
      option['value'] = this.value;
      autofilid = $(this).attr("autofillid");
      if (typeof autofilid !== typeof undefined && autofilid !== false) {
        option['autoFillId'] = autofilid;
      }
      option['Checked'] = "";
      if ($(this).is(':checked')) {
        option['Checked'] = "checked";
      }
      if (fieldid.length == 0)
        fieldid = $(this).attr("fieldid");
      //option['required'] = $(this).attr("required");       
      options.push(option);
    });
  
    }

    if (divDataType == "DropDownList") {

      item["controlType"] = "DropDownList";
  
        var ddl = parentControl.find("select");
        ddl.find("option").each(function () {
          option = {};
          option['value'] = $(this).text();
          autofilid = $(this).attr("autofillid");
          if (typeof autofilid !== typeof undefined && autofilid !== false) {
            option['autoFillId'] = autofilid;
          }
          options.push(option);

        });
      
        
    }
  if (divDataType == "MultiSelect") {

    item["controlType"] = "MultiSelect";
   
    var ddl = parentControl.find("select");
    ddl.find("option").each(function () {
      option = {};
      option['value'] = $(this).text();
      autofilid = $(this).attr("autofillid");
      if (typeof autofilid !== typeof undefined && autofilid !== false) {
        option['autoFillId'] = autofilid;
      }
      options.push(option);

    });
  
    }

    if (divDataType == "Tab") {
        fieldid = "";
        parentControl.find(".tab .tablinks").each(function () {

            option = {};

            var getcontentTabid = $(this).attr("onclick").split("OpenSelectedTab(")[1].split(',')[1].trim().replace("')", '').replace("'", '')
            option['name'] = this.value;
            option["controlId"] = $(this).attr("id");
            option["buttonName"] = $(this).attr("type");
            option["controlType"] = $(this).attr("type");
            option["contentId"] = getcontentTabid;
            option["classId"] = $(this).attr("class");

            subItems = [];
            $(parentControl).find("#" + getcontentTabid).find(".dropped").each(function () {
                if ($(this).attr("data-type") == "Table") {
                    subtable = {};
                    subtable["divDataType"] = $(this).attr("data-type");
                    subtable["divId"] = $(this).attr("id");
                    subtable["divContainerId"] = $(this).find(".controls div:first").attr("id");
                    tableRowItem = [];
                    subtable["options"] = [];
                    //Table into Tab
                    $(this).find("table tbody tr").each(function (index) {
                        tblrows = {};
                        tblrows["rowId"] = $(this).attr("id");
                        tblrowItems = [];
                        if (index == 0) {
                            $(this).find("th.columnheadercontent").each(function () {
                                HeaderRow = {};
                                HeaderRow["rowCellId"] = $(this).attr("id");
                                HeaderRow['rowCellValue'] = $(this).text();
                                tblrowItems.push(HeaderRow);
                            });
                        }
                        if (index > 0) {
                            $(this).find("td").find("textarea").each(function () {
                                tblcell = {};
                                tblcell['rowCellId'] = $(this).parent().attr("id");
                                tblcell['rowCellValue'] = $(this).val();
                                tblrowItems.push(tblcell);
                            });
                        }
                        tblrows['rowItem'] = tblrowItems;
                        tableRowItem.push(tblrows);
                        subtable["options"] = { "option": tableRowItem }
                    });
                    subItems.push(subtable);
                }
                else if ($(this).attr("data-type") == "ExcelGrid") {
                    subtable = {};
                    subtable["divDataType"] = $(this).attr("data-type");
                    subtable["divId"] = $(this).attr("id");
                    subtable["divContainerId"] = $(this).find(".controls div:first").attr("id");
                    tableRowItem = [];
                    subtable["options"] = [];
                    //Table into Tab
                    $(this).find("table tbody tr").each(function (index) {
                        tblrows = {};
                        tblrows["rowId"] = $(this).attr("id");
                        tblrowItems = [];
                        if (index == 0) {
                            $(this).find("th.columnheaderexcelcontent").each(function () {
                                HeaderRow = {};
                                HeaderRow["rowCellId"] = $(this).attr("id");
                                HeaderRow['rowCellValue'] = $(this).text();
                                HeaderRow["columnType"] = $(this).attr("columntype");
                                HeaderRow["columnSource"] = $(this).attr("columnsource");
                                tblrowItems.push(HeaderRow);
                            });
                        }
                        if (index > 0) {
                            $(this).find("td").find("textarea").each(function () {
                                tblcell = {};
                                tblcell['rowCellId'] = $(this).parent().attr("id");
                                tblcell['rowCellValue'] = $(this).val();
                                tblrowItems.push(tblcell);
                            });
                        }
                        tblrows['rowItem'] = tblrowItems;
                        tableRowItem.push(tblrows);
                        subtable["options"] = { "option": tableRowItem }
                    });
                    subItems.push(subtable);
                }
                else {
                    subItems.push(getNestedControlPropertyValues($(this).attr("id")));
                }

            });
            option['ContentItem'] = subItems;
            options.push(option);
        });
    }
    if (divDataType == "Grid") {
        fieldid = "";
        parentControl.find("table tbody tr").each(function (index) {
            rowoption = {};
            rowoption["rowId"] = $(this).attr("id");
            rowItems = [];
            $(this).find("td.columncontent").each(function () {
                subrowoption = {};
                subrowoption['cellContainerId'] = $(this).attr("id");
                rowsubItems = [];
                $(this).find(".dropped").each(function () {
                    subrowoption['cellContainerItem'] = getNestedControlPropertyValues($(this).attr("id"));
                });
                rowItems.push(subrowoption);
            });
            rowoption["rowCellContent"] = rowItems;
            options.push(rowoption);
        });
    }
    if (divDataType == "Table") {
        parentControl.find("table tbody tr").each(function (index) {
            tblrows = {};
            tblrows["rowId"] = $(this).attr("id");
            tblrowItems = [];
            if (index == 0) {
                $(this).find("th.columnheadercontent").each(function () {
                    HeaderRow = {};
                    HeaderRow["rowCellId"] = $(this).attr("id");
                    HeaderRow['rowCellValue'] = $(this).text();
                    tblrowItems.push(HeaderRow);
                });
            }
            if (index > 0) {
                $(this).find("td").find("textarea").each(function () {
                    tblcell = {};
                    tblcell['rowCellId'] = $(this).parent().attr("id");
                    tblcell['rowCellValue'] = $(this).val();
                    tblrowItems.push(tblcell);
                });
            }
            tblrows['rowItem'] = tblrowItems;
            options.push(tblrows);
        });
    }

    if (divDataType == "ExcelGrid") {
        parentControl.find("table tbody tr").each(function (index) {
            tblrows = {};
            tblrows["rowId"] = $(this).attr("id");
            tblrowItems = [];
            if (index == 0) {
                $(this).find("th.columnheaderexcelcontent").each(function () {
                    HeaderRow = {};
                    HeaderRow["rowCellId"] = $(this).attr("id");
                    HeaderRow['rowCellValue'] = $(this).text();
                    HeaderRow["columnType"] = $(this).attr("columntype");
                    HeaderRow["columnSource"] = $(this).attr("columnsource");
                    tblrowItems.push(HeaderRow);
                });
            }
            if (index > 0) {
                $(this).find("td").find("textarea").each(function () {
                    tblcell = {};
                    tblcell['rowCellId'] = $(this).parent().attr("id");
                    tblcell['rowCellValue'] = $(this).val();
                    tblrowItems.push(tblcell);
                });
            }
            tblrows['rowItem'] = tblrowItems;
            options.push(tblrows);
        });
    }
    item["fieldid"] = fieldid;
    item["options"] = { "option": options };

    return item;
}

/* Get Form Inner Control Properties as Json*/
function getNestedControlPropertyValues(nestedparentId) {

    var nestedHeaderImageMain;
    var nestedautofilid;
    var nestedparentControl = $("#" + nestedparentId);
    var nesteddivDataType = nestedparentControl.attr("data-type");
    var nestedcontrolType = nestedparentControl.find(":input").attr("type");
    var nestedbuttonName = nestedparentControl.find(":input").attr("value");
    var nestedcontrolId = nestedparentControl.find(":input").attr("id");
    var nestedname = nestedparentControl.find(":input").attr("id");
    var nestedlabelText = nestedparentControl.find("label").length > 1 ? nestedparentControl.find("label")["1"].innerText : "";
    var showlabel = nestedparentControl.find(":input").attr("isshowlabel");
    var nestedplaceholder = nestedparentControl.find(":input").attr("placeholder");
    var nestedtooltip = nestedparentControl.find(":input").attr("title");
    var nestedmaxLength = nestedparentControl.find(":input").attr("maxlength");
    //var Nestedwidth = NestedparentControl.find(":input").length ? NestedparentControl.find(":input").css("width").replace("px", "") : "";
    var nestedwidth = nestedparentControl.find(":input").length ? nestedparentControl.find(":input").outerWidth() : "";
    var nestedrequired = nestedparentControl.find(":input").attr("isrequired");
    var nesteddisabled = nestedparentControl.find(":input").attr("isDisabled"); 
    var nestedautoGenerated = nestedparentControl.find(":input").attr("isAutoGenerated");
    var nestedautoGeneratedVal = nestedparentControl.find(":input").attr("autoGeneratedVal");
    var nestedautoGeneratedValDig = nestedparentControl.find(":input").attr("autoGeneratedValDig");
    var nesteddataType = nestedparentControl.find(":input").attr("datatype");
    var nestedminValue = nestedparentControl.find(":input").attr("min");
    var nestedmaxValue = nestedparentControl.find(":input").attr("max");
    var nestedprecisiondigit = nestedparentControl.find(":input").attr("Precisiondigit");
    var nestedSectionName = nestedparentControl.find(":input").attr("SectionName");
    var nesteddataFormat = nestedparentControl.find(":input").attr("dataformat");
    var nestedpattern = typeof (nestedparentControl.find(":input").attr("pattern")) != 'undefined' ? nestedparentControl.find(":input").attr("pattern") : "";
    var nestedeventValidate = typeof (nestedparentControl.find(":input").attr("onkeydown")) != 'undefined' ? nestedparentControl.find(":input").attr("onkeydown") : "";
    var nestedfieldid = nestedparentControl.find(":input").attr("fieldid");
    var nestedclassValue = nestedparentControl.find(":input").attr("class");
    var optionOrderVal = nestedparentControl.find(":input").attr("optionOrder");
    if (typeof nesteddataType == typeof undefined || nesteddataType == false) {
        nesteddataType = "AlphaNumeric";
    }
    nesteditem = {}
    nesteditem["controlId"] = nestedcontrolId;
    nesteditem["name"] = nestedname;
    nesteditem["divDataType"] = nesteddivDataType;
    nesteditem["divId"] = nestedparentId;
    nesteditem["controlType"] = nestedcontrolType;

    nesteditem["labelText"] = nestedlabelText;

    if (nestedplaceholder == undefined) {
      nestedplaceholder = "";
    }
    if (nestedtooltip == undefined) {
      nestedtooltip = "";
    }

    nesteditem["placeholder"] = nestedplaceholder;
    nesteditem["tooltip"] = nestedtooltip;
    nesteditem["buttonName"] = nestedbuttonName;
    nesteditem["maxLength"] = nestedmaxLength;
    nesteditem["width"] = parseFloat(nestedwidth) < 67 ? 67 : nestedwidth;
    nesteditem["classvalue"] = nestedclassValue;
    nesteditem["showlabel"] = showlabel == "true" ? true : false;
    nesteditem["optionOrder"] = optionOrderVal;

    if (nesteddivDataType == "Radio") {
        nesteditem["width"] = "";
    }
    if (nesteddivDataType == "Calendar") {
        nesteddataType = "Date";
    }
    else if (nesteddivDataType == "TextBox-MultiLine" || nesteddivDataType == "Header" || nesteddivDataType == "PageHeader") {
        nesteddataType = "AlphaNumeric";
    }
    if (nesteddivDataType == "PageHeader") {

        nestedHeaderImageMain = $("#HeaderImageMain").attr("src");
        nestedHeaderImageMain = nestedHeaderImageMain.replace('data:image/png;base64,', '');
        nestedHeaderImageMain = nestedHeaderImageMain.replace('data:image/jpeg;base64,', '');
        nesteditem["headerImage"] = nestedHeaderImageMain;
        nesteditem["name"] = "PageHeader";
        nesteditem["controlType"] = "PageHeader";
        //var width = $("#HeaderImageMain").css("width").replace("px", "");
        //var height = $("#HeaderImageMain").css("height").replace("px", "");
        nesteditem["height"] = $("#HeaderImageMain").css("height").replace("px", "");
        nesteditem["width"] = $("#HeaderImageMain").css("width").replace("px", "");
    }
    if (nesteddivDataType == "Header" || nesteddivDataType == "PageHeader") {
      
        nesteditem["headerText"] = nestedparentControl.find("#headerTextdiv")[0].innerHTML.trim();
        nesteditem["headerTextAlign"] = nestedparentControl.find("#headerTextdiv").css("text-align");
        nestedfieldid = nestedparentControl.find("#headerTextdiv").attr("fieldid");
    }
    nestedvalidate = {};
    nestedvalidate["required"] = nestedrequired == "true" //? 1 : 0;
    nestedvalidate["disabled"] = nesteddisabled == "true" //? 1 : 0;
    nestedvalidate["autoGenerated"] = nestedautoGenerated == "true" //? 1 : 0;
    nestedvalidate["autoGeneratedVal"] = nestedautoGeneratedVal;
    nestedvalidate["autoGeneratedValDig"] = nestedautoGeneratedValDig;
    nestedvalidate["dataType"] = nesteddataType == "" ? "AlphaNumeric" : nesteddataType;
    nestedvalidate["minValue"] = nestedminValue;
    nestedvalidate["maxValue"] = nestedmaxValue;
    nestedvalidate["precisiondigit"] = nestedprecisiondigit;
    nestedvalidate["dataFormat"] = nesteddataFormat;

    nestedvalidate["pattern"] = nestedpattern;
    nestedvalidate["eventValidation"] = nestedeventValidate;
    nesteditem["validate"] = nestedvalidate;
    nestedoptions = [];

    if (nesteddivDataType == "CheckBox") {
        nestedfieldid = "";
        nestedparentControl.find(":CheckBox").each(function () {

            nestedoption = {};
            nestedoption['value'] = this.value;
            nestedautofilid = $(this).attr("autofillid");
            if (typeof nestedautofilid !== typeof undefined && nestedautofilid !== false) {
                nestedoption['autoFillId'] = nestedautofilid;
            }
            nestedoption['Checked'] = "";
            if ($(this).is(':checked')) {
                nestedoption['Checked'] = "checked";
            }
            if (nestedfieldid.length == 0)
                nestedfieldid = $(this).attr("fieldid");
            //option['required'] = $(this).attr("required");       
            nestedoptions.push(nestedoption);
        });
    }
    if (nesteddivDataType == "Radio") {
        nestedfieldid = "";
        nestedparentControl.find(":Radio").each(function () {

            nestedoption = {};
            nestedoption['value'] = this.value;
            nestedautofilid = $(this).attr("autofillid");
            if (typeof nestedautofilid !== typeof undefined && nestedautofilid !== false) {
                nestedoption['autoFillId'] = nestedautofilid;
            }
            nestedoption['Checked'] = "";
            if ($(this).is(':checked')) {
              nestedoption['Checked'] = "checked";
            }
            if (nestedfieldid.length == 0)
                nestedfieldid = $(this).attr("fieldid");
            //option['required'] = $(this).attr("required");       
            nestedoptions.push(nestedoption);
        });
    }

    if (nesteddivDataType == "DropDownList") {

        nesteditem["controlType"] = "DropDownList";
        var ddl = nestedparentControl.find("select");
        ddl.find("option").each(function () {
            nestedoption = {};
            nestedoption['value'] = $(this).text();
            nestedautofilid = $(this).attr("autofillid");
            if (typeof nestedautofilid !== typeof undefined && nestedautofilid !== false) {
                nestedoption['autoFillId'] = nestedautofilid;
            }
            nestedoptions.push(nestedoption);

        });
    }
    if (nesteddivDataType == "MultiSelect") {
     
        nesteditem["controlType"] = "MultiSelect";
        var ddl = nestedparentControl.find("select");
        ddl.find("option").each(function () {
            nestedoption = {};
            nestedoption['value'] = $(this).text();
            nestedautofilid = $(this).attr("autofillid");
            if (typeof nestedautofilid !== typeof undefined && nestedautofilid !== false) {
                nestedoption['autoFillId'] = nestedautofilid;
            }
            nestedoptions.push(nestedoption);

        });
    }
    nesteditem["fieldid"] = nestedfieldid;
    nesteditem["options"] = { "option": nestedoptions };
    // ;
    return nesteditem;
}

/*Add Options*/
function addControlOption(btntextval) {
    var sControlType = $("#hdnSelectedControlType").val();
    var Optiondatatype = $("#hdnDataType").val();
    var DataType = $("#Properties").find('.DataType').length ? $("#Properties").find('.DataType').val() : "";
    var maxlengthval = alphabetDefaultMaxLength;
    if (DataType == "Numeric" || DataType == "Date")
        maxlengthval = numericDefaultMaxlength;

    var patternOptionval = "";
    var Optionkeyval = "";
    var keyval = "";
    //Added Pattren attributes when added new options
    if (DataType.length > 0) {

        if (DataType == "Alpha") {
            patternOptionval = alphaPattren;
            keyval = "return alphabetsOnly(event)";
        }
        else if (DataType == "AlphaNumeric") {
            patternOptionval = alphanumericPattern;
            keyval = "return alphabetsAndNumericOnly(event)";
        }
        else if (DataType == "Numeric") {
            keyval = "return numericWithDecimalPoint(event,$(this).val())";
            patternOptionval = numericWithDecialPointPattern;
        }
        else if (DataType == "FreeText") {
            keyval = "return alphanumericWithSpecialCharacter(event)";
            patternOptionval = alphanumericWithSecialCharPattern;
        }
        else if (DataType == "Date") {
            patternOptionval = "dd/mm/yyyy"
        }
    }

    if (sControlType == "Radio")
        $("ol").append('<li class=""><div style="position:relative"><input type="text" pattern="' + patternOptionval + '" onkeydown="' + keyval + '" class="option-value " value="" name="radio-group-option" maxlength="' + maxlengthval + '" autofillid="" fieldid = "" placeholder="Value" style="width:115px; position: relative;" autocomplete="off">&nbsp;<span class="erroralert">*</span>&nbsp;<input type="radio" name="lstradio" class="radioselected" style="height:15px;width:15px;" title="Default selected"><a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
    else if (sControlType == "CheckBox")
        $("ol").append('<li class=""><div style="position:relative"><input type="text" pattern="' + patternOptionval + '" onkeydown="' + keyval + '" class="option-value " value="" name="radio-group-option" maxlength="' + maxlengthval + '" autofillid="" fieldid = "" placeholder="Value" style="width:115px; position: relative;" autocomplete="off">&nbsp;<span class="erroralert">*</span>&nbsp;<input type="checkbox" class="selected" style="height:15px;width:15px;" title="Default selected"><a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
    else if (sControlType == "Table") {
        if ($(btntextval).text() == "Add Column") {
            $("ol").append('<li id="lstCols" class="cols"><div style="position:relative"><input type="text" pattern="' + patternOptionval + '" onkeydown="' + keyval + '" class="option-value " value="" maxlength="' + maxlengthval + '" name="table-cols-group-option" autofillid="" fieldid = "" placeholder="Column' + ($("#Properties").find('.TableColumnListProp li').length + 1) + '" style="width:115px; position: relative;" autocomplete="off">&nbsp;<span class="erroralert">*</span> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
        }
    }
    else if (sControlType == "ExcelGrid") {
        if ($(btntextval).text() == "Add Column") {
          $("ol").append('<li id="lstCols" class="cols"><div style="position:relative"><input type="text" pattern="' + patternOptionval + '" onkeydown="' + keyval + '" class="option-value " value="" maxlength="' + maxlengthval + '" name="table-cols-group-option" autofillid="" fieldid = "" placeholder="Column' + ($("#Properties").find('.ExcelGridColumnListProp li').length + 1) + '" style="width:115px; position: relative;" autocomplete="off">&nbsp;<span class="erroralert">*</span><select class="ColumnType" id="select" style="width:115px;height:20px;font-size:12px;" onchange="getSourceValue(this)"><option value="date">Date</option><option value="dropdown">dropdown</option><option value="text">Text</option></select><div style="display:none;"><input type="text" placeholder="Enter value" title="Enter comma separated string" style="width:115px; height:20px;">&nbsp;<span class="erroralert">*</span></div><a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
        }
    }
    else if (sControlType == "Tab") {
        $("ol").append('<li class=""><div style="position:relative"><input pattern="' + patternOptionval + '" onkeydown="' + keyval + '" type="text" class="option-value " value="" name="radio-group-option" maxlength="' + maxlengthval + '" autofillid="Tab-' + ($("#Properties").find('.TabListProp li').length + 1) + '" fieldid = "Tab-' + ($("#Properties").find('.TabListProp li').length + 1) + '" placeholder="Value" style="width:115px; position: relative;" autocomplete="off">&nbsp;<span class="erroralert">*</span> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');
    }
    else
        $("ol").append('<li class=""><div style="position:relative"><input pattern="' + patternOptionval + '" onkeydown="' + keyval + '" type="text" class="option-value " value="" name="radio-group-option" maxlength="' + maxlengthval + '" autofillid="" fieldid = "" placeholder="Value" style="width:115px; position: relative;" autocomplete="off">&nbsp;<span class="erroralert">*</span> <a class="remove btn" title="Remove Element" onclick="removeLi(this);" >×</a><div class="erroralert" style="display:none;"></div></div></li>');


    if (DataType == "Date") {
        $(".option-value").attr('readonly', 'readonly');
        EnabledDatePickerForOptions();
    }
    else {
        $(".option-value").removeAttr("readonly");
        DisabledDatePickerForOptions();
    }
    // disableCutCopyPaste();
}

function getSourceValue(objOption) {
    $(objOption).next().hide();
    $(objOption).next().next().next().next().css("display", "none")
    if ($(objOption).find(":selected").val() == 'dropdown'){
        $(objOption).next().show();
    }
}

/*Remove Item from template form*/
function removeLi(link) {

    if ($(".RadioGroupProp li").length > 2) {

        var fieldid = $(link).parent().find(":input").attr("fieldid");
        var autofilid = $(link).parent().parent().find(":input").attr("autofillid");

        if (typeof autofilid !== typeof undefined && autofilid !== false)
            deletedOptions += fieldid + "-" + autofilid + ",";

        link.parentNode.parentNode.parentNode.removeChild(link.parentNode.parentNode);
    }

    if ($(".DropDownListProp li").length > 2) {

        var fieldid = $(link).parent().find(":input").attr("fieldid");
        var autofilid = $(link).parent().find(":input").attr("autofillid");

        if (typeof autofilid !== typeof undefined && autofilid !== false)
            deletedOptions += fieldid + "-" + autofilid + ",";

        link.parentNode.parentNode.parentNode.removeChild(link.parentNode.parentNode);
    }
    if ($(".CheckBoxListProp li").length > 1) {

        var fieldid = $(link).parent().find(":input").attr("fieldid");
        var autofilid = $(link).parent().find(":input").attr("autofillid");

        if (typeof autofilid !== typeof undefined && autofilid !== false)
            deletedOptions += fieldid + "-" + autofilid + ",";

        link.parentNode.parentNode.parentNode.removeChild(link.parentNode.parentNode);
    }

    if ($(".TabListProp li").length > 1) {

        var fieldid = $(link).parent().find(":input").attr("fieldid");
        var autofilid = $(link).parent().find(":input").attr("autofillid");

        if (typeof autofilid !== typeof undefined && autofilid !== false)
            deletedOptions += fieldid + "-" + autofilid + ",";

        link.parentNode.parentNode.parentNode.removeChild(link.parentNode.parentNode);
    }

    if ($(".TableColumnListProp li").length > 1 && link.parentNode.parentNode.id == "lstCols") {

        var fieldid = $(link).parent().find(":input").attr("fieldid");
        var autofilid = $(link).parent().find(":input").attr("autofillid");

        if (typeof autofilid !== typeof undefined && autofilid !== false)
            deletedOptions += fieldid + "-" + autofilid + ",";

        link.parentNode.parentNode.parentNode.removeChild(link.parentNode.parentNode);
    }

    if ($(".ExcelGridColumnListProp li").length > 1 && link.parentNode.parentNode.id == "lstCols") {

        var fieldid = $(link).parent().find(":input").attr("fieldid");
        var autofilid = $(link).parent().find(":input").attr("autofillid");

        if (typeof autofilid !== typeof undefined && autofilid !== false)
            deletedOptions += fieldid + "-" + autofilid + ",";

        link.parentNode.parentNode.parentNode.removeChild(link.parentNode.parentNode);
  }
  if ($(".MultiSelectProp li").length > 2) {

      var fieldid = $(link).parent().find(":input").attr("fieldid");
      var autofilid = $(link).parent().find(":input").attr("autofillid");

      if (typeof autofilid !== typeof undefined && autofilid !== false)
        deletedOptions += fieldid + "-" + autofilid + ",";

      link.parentNode.parentNode.parentNode.removeChild(link.parentNode.parentNode);
    }
    
}

/*readURL*/
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#HeaderImage')
                .attr('src', e.target.result);
            //.width(100)
            //.height(100);
        };
        reader.width
      
        reader.readAsDataURL(input.files[0]);
        var file, img;
        if ((file = input.files[0])) {
            img = new Image();
            img.onload = function () {
                // alert(this.width + " " + this.height);
            };
            img.src = _URL.createObjectURL(file);
        }
      
        if (input.files.length > 0) {
            var fsize = input.files[0].size;
            fsize = Math.round((fsize / 1048576));
            $("#ImageSize")[0].innerHTML = '<b> Image Size: ' + fsize + '</b> MB\nWidth: ' + reader.width + '\nHeight: ' + reader.height;
            if (fsize >= 1.4)
                $("#Imagewarning")[0].innerHTML = "The file you are trying to upload is too large (max 1.4 MB)";
        }
    }
}

/*Remove Header Image*/
function RemoveHeaderImage() {

    $("#Properties").find('#HeaderImage').attr("src", "");
    $("#Properties").find('#imageFile').val("");
}

/*Auto Fill Change*/
function AutofillChange(e) {

    if (!$(e).is(':checked')) {
        $("#customoptions").css("display", "block");
        $("#autofilloptions").css("display", "none");
    }
    else {
        $("#customoptions").css("display", "none");
        $("#autofilloptions").css("display", "block");
    }

}

/*Get Column*/
function GetColumn(e) {
    var status = true;
    var serverName = $("#txtServerName").val().trim();
    var dbName = $("#txtDataBaseName").val().trim();
    var userName = $("#txtUserName").val().trim();
    var password = $("#txtPassword").val().trim();
    var tableName = $("#txtTableName").val().trim();

    if (serverName.length == 0) {
        $("#txtServerName").attr("style", "border:1px solid #f10c0c");
        status = false;
    }
    else
        $("#txtServerName").css("border", "");

    if (dbName.length == 0) {
        $("#txtDataBaseName").attr("style", "border:1px solid #f10c0c");
        status = false;
    }
    else
        $("#txtDataBaseName").css("border", "");

    if (userName.length == 0) {
        $("#txtUserName").attr("style", "border:1px solid #f10c0c");
        status = false;
    }
    else
        $("#txtUserName").css("border", "");

    if (password.length == 0) {
        $("#txtPassword").attr("style", "border:1px solid #f10c0c");
        status = false;
    }
    else
        $("#txtPassword").css("border", "");

    if (tableName.length == 0) {
        $("#txtTableName").attr("style", "border:1px solid #f10c0c");
        status = false;
    }
    else
        $("#txtTableName").css("border", "");
    serverName = "10.4.0.36";
    dbName = "FineDocsECMPortal_2.0_CR_Test_Drop6";
    userName = "dms";
    password = "dms0ser.";
    tableName = "Helpdesk.CategoryMaster";
    if (status) {

        $.ajax({
            url: 'http://localhost:64393/api/FormBuilderApi/GetColumnList',
            data: {
                ServerName: serverName,
                DBName: dbName,
                UserName: userName,
                Password: password,
                TableName: tableName
            },
            type: 'GET',
            dataType: 'json',
            success: function (data) {

            },
            error: function (mess) {

                alert(mess);
            }
        });
    }

}

/*Disabled cut copy and paste event*/
function disableCutCopyPaste() {
    $("#Properties").find(':input').on("cut copy paste", function (e) {
        e.preventDefault();
    });
}

/*Enabled Date picker for Options when date type have date*/
function EnabledDatePickerForOptions() {
    $("#Properties").find('.option-value').each(function () {
        $(this).datepicker({ dateFormat: datePattern });
        $(this).attr('readonly', 'readonly');
    });
}

/*Disabled Date picker for Options when date type have date*/
function DisabledDatePickerForOptions() {
    $("#Properties").find('.option-value').each(function () {
        $(this).removeAttr("id");
        $(this).datepicker("destroy");
        $(this).removeAttr("readonly");
    });
}

/*Alphanumeric with some special character validations apply on template forms*/
function alphanumericWithSpecialCharacter(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;

    if (e.shiftKey && (keyCode == 18 || keyCode == 86)) {
        console.log("pressed shift + " + keyCode);
        return false;
    }
    //console.log("pressed shift + " + keyCode);
    //if (e.shiftKey)
    //    console.log("pressed + " + keyCode);
    //console.log("pressed shift + " + keyCode);
    if (keyCode == 189 || keyCode == 32 || keyCode == 187 || keyCode == 191 || keyCode == 221 || keyCode == 219 || keyCode == 186 || keyCode == 220|| keyCode == 190)
        return true;
  var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (keyCode == 190)|| (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
    //document.getElementById("error").style.display = ret ? "none" : "inline";
    return ret;
}
function alphanumericWithSpecialCharacterForLabel(e) {
  var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;

  if (e.shiftKey && keyCode == 18) {
    console.log("pressed shift + " + keyCode);
    return false;
  }
 if (keyCode == 189 || keyCode == 32 || keyCode == 187 || keyCode == 191 || keyCode == 221 || keyCode == 219 || keyCode == 186 || keyCode == 220 || keyCode == 188 || keyCode == 190 || keyCode == 222 || keyCode == 96)
    return true;
  var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
    return ret;
}
/*alphabets And Numeric Only*/
function alphabetsAndNumericOnly(e) {

    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
  if (e.shiftKey && ( keyCode == 18 || keyCode == 49 || keyCode == 50 || keyCode == 51 || keyCode == 52 || keyCode == 53 || keyCode == 54 || keyCode == 55 || keyCode == 56
        || keyCode == 57 || keyCode == 48 || keyCode == 86)) {
        console.log("pressed shift + " + keyCode);
        return false;
    }
    if (e.shiftKey)
        console.log("pressed + " + keyCode);
    console.log("pressed shift + " + keyCode);
  if (keyCode == 189|| keyCode == 32)
        return true;
  var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
    //document.getElementById("error").style.display = ret ? "none" : "inline";
    return ret;


}

function alphanumericForSql(e) {
  return "";
  //var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
  //if (e.shiftKey && (keyCode == 18 || keyCode == 49 || keyCode == 50 || keyCode == 51 || keyCode == 52 || keyCode == 53 || keyCode == 54 || keyCode == 55 || keyCode == 56
  //  || keyCode == 57 || keyCode == 48 || keyCode == 86)) {
  //  console.log("pressed shift + " + keyCode);
  //  return false;
  //}
  //if (e.shiftKey)
  //  console.log("pressed + " + keyCode);
  //console.log("pressed shift + " + keyCode);
  //if (keyCode == 189 || keyCode == 32)
  //  return true;
  //var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
  ////document.getElementById("error").style.display = ret ? "none" : "inline";
  //return ret;


}

/*alphabetOnly*/
function alphabetsOnly(e) {

  var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
  console.log("pressed shift + " + keyCode);
  if (e.shiftKey && (keyCode == 18 || keyCode == 86)) {
    console.log("pressed shift + " + keyCode);
    return false;
  }
  if (e.shiftKey)
    console.log("pressed shift + " + keyCode);

  var ret = (((keyCode >= 65 && keyCode <= 90) || (keyCode == 32)) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
  return ret;
}

/*Allow Only Number*/
function numbersOnly(event) {

    var numericflag = false;
    if (event.shiftKey == true) {
        event.preventDefault();
        numericflag = false;
    }

    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 ||
        event.keyCode == 39 || event.keyCode == 46) {
        numericflag = true;

    } else {
        event.preventDefault();
        numericflag = false;
    }
    return numericflag;
}

/*Allow Only Number with single decimal*/
function numericWithDecimalPoint(event, value) {
    var decimalFlag = false;

    if (event.shiftKey == true) {
        event.preventDefault();
        decimalFlag = false;
    }

    if ((event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 37 ||
        event.keyCode == 39 || event.keyCode == 46 || event.keyCode == 190) {
        decimalFlag = true;

    } else {
        event.preventDefault();
        decimalFlag = false;
    }

    if (value.indexOf('.') !== -1 && event.keyCode == 190) {
        event.preventDefault();
        decimalFlag = false;
    }
    return decimalFlag;
}

//Set min ,max value Data type Numric if selecetd Numeric 
function onChangeNumericDataType() {
    $("#Properties").find('.MinValue').val("");
    $("#Properties").find('.MaxValue').val("");
    $("#Properties").find('.Precisiondigit').val("");
    $("#Properties").find('.MinValue').attr("pattern", numericWithDecialPointPattern);
    $("#Properties").find('.MinValue').attr("onkeydown", "return numbersOnly(event)");
    $("#Properties").find('.MaxValue').attr("pattern", numericWithDecialPointPattern);
    $("#Properties").find('.MaxValue').attr("onkeydown", "return numbersOnly(event)");
    $("#Properties").find('.MaxValue').attr("pattern", numericWithDecialPointPattern);
    $("#Properties").find('.Precisiondigit').attr("onkeydown", "return numbersOnly(event)");


}

/*Data Type Change for Option value*/
function onDataTypeChange(control) {
    var flag = false;
    if (confirm('Are you sure you want to change option data type?')) {

        if ($(control).val() == "Alpha") {
            $("#Properties").find('.option-value').each(function () {
                $(this).val("");
                $(this).attr("onkeydown", "return alphabetsOnly(event)");
                $(this).removeAttr("id");
                $(this).datepicker("destroy");
                $(this).attr("maxlength", alphanumericPattern);
                $(this).attr("pattern", alphaPattren);
                $(this).removeAttr("readonly");
            });
        }
        else if ($(control).val() == "AlphaNumeric") {
            $("#Properties").find('.option-value').each(function () {
                $(this).val("");
                $(this).attr("onkeydown", "return alphabetsAndNumericOnly(event)");
                $(this).removeAttr("id");
                $(this).datepicker("destroy");
                $(this).attr("maxlength", "50");
                $(this).attr("pattern", alphanumericPattern);
                $(this).removeAttr("readonly");
            });
        }
        else if ($(control).val() == "Numeric") {
            $("#Properties").find('.option-value').each(function () {
                $(this).val("");
                $(this).attr("onkeydown", "return numericWithDecimalPoint(event,$(this).val())");
                $(this).removeAttr("id");
                $(this).datepicker("destroy");
                $(this).attr("maxlength", numericDefaultMaxlength);
                $(this).attr("pattern", numericWithDecialPointPattern);
                $(this).removeAttr("readonly");
            });
        }
        else if ($(control).val() == "Date") {
            $("#Properties").find('.option-value').each(function () {
                $(this).val("");
                $(this).datepicker({ dateFormat: datePattern });
                $(this).attr('readonly', 'readonly');
            });
        }
        else if ($(control).val() == "FreeText") {
            $("#Properties").find('.option-value').each(function () {
                $(this).val("");
                $(this).removeAttr("id");
                $(this).datepicker("destroy");
                $(this).attr("maxlength", alphabetDefaultMaxLength);
                $(this).removeAttr("readonly");
                $(this).attr("onkeydown", "return alphanumericWithSpecialCharacter(event)");
            });
        }

    }
}

/*Get selected data type */
function getSelectedDataType(control) {
    $("#hdnDataType").val(control.value);
}

/*Show div auto generated*/
function ShowDivAutoGenerated(control) {
    $("#dvAutoGenerated").hide();
    $("#dvErrorAutogenerated").css("display", "none");
    $("#dvErrorAutogeneratedDig").css("display", "none");
    var dataType = $("#Properties").find('.DataType').length ? $("#Properties").find('.DataType').val() : "";

  if ($(control).is(":checked")) {
    $("#dvAutoGenerated").show();
    $("#dvAFill").css("display", "none");

    $("#selectDataType option[value='Alpha']").remove();
    $("#selectDataType option[value='FreeText']").remove();

    if (dataType === "Numeric") {
     ("#dvAutoGeneratedPrefix").css("display", "none");
    } else {
      $("#dvAutoGeneratedPrefix").css("display", "block");
    }
    $("#dvMaxLength").hide();
    $("#dvminmaxcontrol").hide();

  } else {
    //$("input.chkAutofill").prop("disabled", true);
   // $("input.chkAutofill").removeAttr("disabled");
    $("#dvAFill").css("display", "block");
    $('#selectDataType').empty();
    $("#selectDataType").append('<option value="Alpha">Alpha</option>');
    $("#selectDataType").append('<option value="AlphaNumeric">AlphaNumeric</option>');
    $("#selectDataType").append('<option value="FreeText">Free Text</option>');
    $("#selectDataType").append('<option value="Numeric">Numeric</option>');

    $("#dvMaxLength").show();
    $("#Properties").find('.DataType').val(dataType);
    //$("#selectDataType").val("Numeric").change();
    if (dataType === "Numeric") {
    
    $("#dvminmaxcontrol").show();
    }
    else
      $("#dvminmaxcontrol").hide();
  }
}

function CancelProperties() {
  $(".propertyDiv").css("display", "none");
  document.getElementById("btnSaveForm").disabled = false;
  document.getElementById("btnSaveAndPublishForm").disabled = false;
}

function validateDate(dateString) {
  var dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;

  // Match the date format through regular expression      
  if (dateString.match(dateformat)) {
    var operator = dateString.split('/');

    // Extract the string into month, date and year      
    var datepart = [];
    if (operator.length > 1) {
      datepart = dateString.split('/');
    }
    var month = parseInt(datepart[0]);
    var day = parseInt(datepart[1]);
    var year = parseInt(datepart[2]);

    // Create list of days of a month      
    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month == 1 || month > 2) {
      if (day > ListofDays[month - 1]) {
        ///This check is for Confirming that the date is not out of its range      
        return false;
      }
    } else if (month == 2) {
      var leapYear = false;
      if ((!(year % 4) && year % 100) || !(year % 400)) {
        leapYear = true;
      }
      if ((leapYear == false) && (day >= 29)) {
        return false;
      } else
      if ((leapYear == true) && (day > 29)) {
        
        return false;
      }
    }
  } else {
    
    return false;
  }
  return true;
}   

function AuthenticationModeChange(option) {
  if ($("input[name='rblAuthenticationMode']:checked").val() === "Windows") {
     $("#dvUsr").css("display", "block");

  } else {
    $("#dvUsr").css("display", "block");
  }
}

function dbTypeChange() {
  var dbType = $("#ddlDbType").val();//$("input[name='ddlDbType']:checked").val();
  if (dbType === "SQL") {
    $("#dvAuthMode").css("display", "block");
    $("#dvPort").css("display", "none");
   
  } else {
    $("#dvAuthMode").css("display", "none");
    $("#dvPort").css("display", "block");
    $("#dvUsr").css("display", "block");
  }
  resetDatabaseControls();
}

function getAllDatabases() {
  var status = true;
  var dbType = $("#ddlDbType").val();//$("input[name='rblDbType']:checked").val();
  var serverName = $("#txtServerName").val().trim();
  var userName = $("#txtUserName").val().trim();
  var password = $("#txtPassword").val().trim();
  var port = $("#txtPort").val().trim();
  var authMode = $("input[name='rblAuthenticationMode']:checked").val();
  
  if (serverName.trim().length === 0) {
    $("#txtServerName").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#txtServerName").css("border", "");

  if ((dbType === "SQL") && (authMode === "Windows")) {

  }
  else {
    if (userName.trim().length === 0) {
      $("#txtUserName").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtUserName").css("border", "");

    if (password.trim().length === 0) {
      $("#txtPassword").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPassword").css("border", "");
  }

  

  if (dbType != "SQL") {
    if (port.trim().length === 0) {
      $("#txtPort").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPort").css("border", "");
  }
  if (status) {
     var OptionArray = {};
    OptionArray["dbType"] = dbType;
    OptionArray["serverName"] = serverName;
    OptionArray["authMode"] = authMode;
    OptionArray["userName"] = userName;
    OptionArray["password"] = password;
    OptionArray["port"] = port;
    OptionArray["database"] = null;
    OptionArray["table"] = null;
    OptionArray["tableColumn"] = null;
    OptionArray["sqlQuery"] = null;
    getDBDetails(OptionArray,"ddlDatabase");
  }
  

}

function onDatabaseSelect() {
  var status = true;
  var dbType = $("#ddlDbType").val();// $("input[name='rblDbType']:checked").val();
  var serverName = $("#txtServerName").val().trim();
  var userName = $("#txtUserName").val().trim();
  var password = $("#txtPassword").val().trim();
  var port = $("#txtPort").val().trim();
  var authMode = $("input[name='rblAuthenticationMode']:checked").val();
  var database = $("#ddlDatabase").val();
  $("#ddlColumn").empty();
  $("#ddlColValues").empty();

  if (serverName.trim().length === 0) {
    $("#txtServerName").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#txtServerName").css("border", "");

  if ((dbType === "SQL") && (authMode === "Windows")) {

  }
  else {
    if (userName.trim().length === 0) {
      $("#txtUserName").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtUserName").css("border", "");

    if (password.trim().length === 0) {
      $("#txtPassword").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPassword").css("border", "");
  }

  if (database.trim() == "Select") {
    $("#ddlDatabase").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlDatabase").css("border", "");

  if (dbType != "SQL") {
    if (port.trim().length === 0) {
      $("#txtPort").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPort").css("border", "");
  }
  if (status) {
    var OptionArray = {};
    OptionArray["dbType"] = dbType;
    OptionArray["serverName"] = serverName;
    OptionArray["authMode"] = authMode;
    OptionArray["userName"] = userName;
    OptionArray["password"] = password;
    OptionArray["port"] = port;
    OptionArray["database"] = database;
    OptionArray["table"] = null;
    OptionArray["tableColumn"] = null;
    OptionArray["sqlQuery"] = null;
    getDBDetails(OptionArray, "ddlTablesList");
  }
}

function onTableSelect() {
  var status = true;
  var dbType = $("#ddlDbType").val();
  var serverName = $("#txtServerName").val().trim();
  var userName = $("#txtUserName").val().trim();
  var password = $("#txtPassword").val().trim();
  var port = $("#txtPort").val().trim();
  var authMode = $("input[name='rblAuthenticationMode']:checked").val();
  var database = $("#ddlDatabase").val();
  var tableList = $("#ddlTablesList").val();
  $("#ddlColValues").empty();
  if (serverName.trim().length === 0) {
    $("#txtServerName").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#txtServerName").css("border", "");

  if ((dbType === "SQL") && (authMode === "Windows")) {

  }
  else {
    if (userName.trim().length === 0) {
      $("#txtUserName").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtUserName").css("border", "");

    if (password.trim().length === 0) {
      $("#txtPassword").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPassword").css("border", "");
  }
 
  if (database.trim() == "Select") {
    $("#ddlDatabase").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlDatabase").css("border", "");

  if (tableList.trim() == "Select") {
    $("#ddlTablesList").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlTablesList").css("border", "");

  if (dbType != "SQL") {
    if (port.trim().length === 0) {
      $("#txtPort").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPort").css("border", "");
  }
  if (status) {
    var OptionArray = {};
    OptionArray["dbType"] = dbType;
    OptionArray["serverName"] = serverName;
    OptionArray["authMode"] = authMode;
    OptionArray["userName"] = userName;
    OptionArray["password"] = password;
    OptionArray["port"] = port;
    OptionArray["database"] = database;
    OptionArray["table"] = tableList;
    OptionArray["tableColumn"] = null;
    OptionArray["sqlQuery"] = null;
    getDBDetails(OptionArray, "ddlColumn");
  }
}

function onColumnSelect() {
  var status = true;
  var dbType = $("#ddlDbType").val();
  var serverName = $("#txtServerName").val().trim();
  var userName = $("#txtUserName").val().trim();
  var password = $("#txtPassword").val().trim();
  var port = $("#txtPort").val().trim();
  var authMode = $("input[name='rblAuthenticationMode']:checked").val();
  var database = $("#ddlDatabase").val();
  var tableList = $("#ddlTablesList").val();
  var cols = $("#ddlColumn").val();

  if (serverName.trim().length === 0) {
    $("#txtServerName").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#txtServerName").css("border", "");

  if ((dbType === "SQL") && (authMode === "Windows")) {

  }
  else {
    if (userName.trim().length === 0) {
      $("#txtUserName").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtUserName").css("border", "");

    if (password.trim().length === 0) {
      $("#txtPassword").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPassword").css("border", "");
  }

  if (database.trim() == "Select") {
    $("#ddlDatabase").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlDatabase").css("border", "");

  if (tableList.trim() == "Select") {
    $("#ddlTablesList").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlTablesList").css("border", "");

  if (cols.trim() == "Select") {
    $("#ddlColumn").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlColumn").css("border", "");

  if (dbType != "SQL") {
    if (port.trim().length === 0) {
      $("#txtPort").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPort").css("border", "");
  }
  if (status) {
    var OptionArray = {};
    OptionArray["dbType"] = dbType;
    OptionArray["serverName"] = serverName;
    OptionArray["authMode"] = authMode;
    OptionArray["userName"] = userName;
    OptionArray["password"] = password;
    OptionArray["port"] = port;
    OptionArray["database"] = database;
    OptionArray["table"] = tableList;
    OptionArray["tableColumn"] = cols;
    OptionArray["sqlQuery"] = null;
    getDBDetails(OptionArray, "ddlColValues");
  }
}

function getSqlQueryValues() {
  var status = true;
  var dbType = $("#ddlDbType").val();
  var serverName = $("#txtServerName").val().trim();
  var userName = $("#txtUserName").val().trim();
  var password = $("#txtPassword").val().trim();
  var port = $("#txtPort").val().trim();
  var authMode = $("input[name='rblAuthenticationMode']:checked").val();
  var database = $("#ddlDatabase").val();
  var sqlQuery = $("#txtSqlQuery").val().trim();

  if (serverName.trim().length === 0) {
    $("#txtServerName").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#txtServerName").css("border", "");

  if ((dbType === "SQL") && (authMode === "Windows")) {

  }
  else {
    if (userName.trim().length === 0) {
      $("#txtUserName").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtUserName").css("border", "");

    if (password.trim().length === 0) {
      $("#txtPassword").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPassword").css("border", "");
  }

  if (database.trim() == "Select") {
    $("#ddlDatabase").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlDatabase").css("border", "");



  if (dbType != "SQL") {
    if (port.trim().length === 0) {
      $("#txtPort").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPort").css("border", "");
  }
  if (status) {
    var OptionArray = {};
    OptionArray["dbType"] = dbType;
    OptionArray["serverName"] = serverName;
    OptionArray["authMode"] = authMode;
    OptionArray["userName"] = userName;
    OptionArray["password"] = password;
    OptionArray["port"] = port;
    OptionArray["database"] = database;
    OptionArray["table"] = null;
    OptionArray["tableColumn"] = null;
    OptionArray["sqlQuery"] = sqlQuery;
    getDBDetails(OptionArray, "ddlColValues");
  }
}

function getDBDetails(optionArray, ctrl) {
  var requestURL = window.location.protocol + "//" + window.location.host + "/Template/getAllDatabaseData";
    var dropdown = $("#" + ctrl);
    $.ajax({
      url: requestURL,
      data: {
        DbType: optionArray["dbType"],
        DataBaseServer: optionArray["serverName"],
        AuthMode: optionArray["authMode"],
        DbUser: optionArray["userName"],
        DbPwd: optionArray["password"],
        Port: optionArray["port"],
        Database: optionArray["database"],
        Table: optionArray["table"],
        TableColumn: optionArray["tableColumn"],
        SqlQuery: optionArray["sqlQuery"],
        controlType:"multi"
      },
      type: 'POST',
      dataType: 'json',
      success: function (result) {
        if (result.IsValid) {

          var ddl = $("[id*=" + ctrl + "]");
          if (ctrl === "ddlColValues") {
            ddl.empty();
          }
          else {
            ddl.empty().append('<option value="Select" selected="selected">Select</option>');
          }
         
          $.each(result.Data, function (index, value) {
            ddl.append('<option value=' + value + '>' + value + '</option>');
          });

        } else {
          alert(result.Message);
          $("#ddlDatabase").empty();
          $("#ddlTablesList").empty();
          $("#ddlColumn").empty();
          $("#ddlColValues").empty();
        }
      },
      error: function (result) {
        alert('error in connection');
      }
    });

  }

function resetDatabaseControls() {
   
    $("#txtServerName").text('');
    $("#txtPort").text('');
    $("#txtUserName").text('');
    $("#txtPassword").text('');
    $("#ddlDatabase").empty();
    $("#ddlTablesList").empty();
    $("#ddlColumn").empty();
    $("#ddlColValues").empty();
  }

  function TableSqlChange(option) {
    if ($("input[name='rblTableSql']:checked").val() === "Table") {
      $("#divOptTable").css("display", "block");
      $("#divOptSqlQuery").css("display", "none");
      $("#ddlTablesList").empty();
      $("#ddlColumn").empty();
      $("#ddlColValues").empty();
      onDatabaseSelect();

    }
    else {
      $("#divOptTable").css("display", "none");
      $("#divOptSqlQuery").css("display", "block");
      $("#ddlTablesList").empty();
      $("#ddlColumn").empty();
      $("#ddlColValues").empty();
    }
}

function getDBDetailsFill(optionArray, ctrl,selectedVal) {
  
  var requestURL = window.location.protocol + "//" + window.location.host + "/Template/getAllDatabaseData";
  $.ajax({
    url: requestURL,
    data: {
      DbType: optionArray["dbType"],
      DataBaseServer: optionArray["serverName"],
      AuthMode: optionArray["authMode"],
      DbUser: optionArray["userName"],
      DbPwd: optionArray["password"],
      Port: optionArray["port"],
      Database: optionArray["database"],
      Table: optionArray["table"],
      TableColumn: optionArray["tableColumn"],
      SqlQuery: optionArray["sqlQuery"],
      controlType: "multi"
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.IsValid) {

        var ddl = $("[id*=" + ctrl + "]");
        if (ctrl === "ddlColValues") {
          ddl.empty();
        }
        else {
          ddl.empty().append('<option value="Select">Select</option>');
        }
        
        $.each(result.Data, function (index, value) {
          if (selectedVal === value) {
            ddl.append("<option value=" + value + " selected=selected>" + value + "</option>");
          }
          else
          {
            ddl.append('<option value=' + value + '>' + value + '</option>');
          }
          
        });

      } else {
        alert(result.Message);
      }
    },
    error: function (result) {
      alert('error in connection');
    }
  });

}

function AutofillChangeTextbox(e) {

  if (!$(e).is(':checked')) {
    $("#customtxt").css("display", "block");
    $("#autofilloptionstxt").css("display", "none");
    //$("input.chkAutoGenerated").removeAttr("disabled");
    $("#dvAGenerated").css("display", "block");

   
   }
  else {
    $("#customtxt").css("display", "none");
    $("#autofilloptionstxt").css("display", "block");
    //$("input.chkAutoGenerated").attr("disabled", true);
    $("#dvAGenerated").css("display", "none");
   
    
  }

}

function onColumnSelectforTxt() {
  var status = true;
  var dbType = $("#ddlDbType").val();
  var serverName = $("#txtServerName").val().trim();
  var userName = $("#txtUserName").val().trim();
  var password = $("#txtPassword").val().trim();
  var port = $("#txtPort").val().trim();
  var authMode = $("input[name='rblAuthenticationMode']:checked").val();
  var database = $("#ddlDatabase").val();
  var tableList = $("#ddlTablesList").val();
  var cols = $("#ddlColumn").val();

  if (serverName.trim().length === 0) {
    $("#txtServerName").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#txtServerName").css("border", "");

  if ((dbType === "SQL") && (authMode === "Windows")) {

  }
  else {
    if (userName.trim().length === 0) {
      $("#txtUserName").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtUserName").css("border", "");

    if (password.trim().length === 0) {
      $("#txtPassword").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPassword").css("border", "");
  }

  if (database.trim() == "Select") {
    $("#ddlDatabase").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlDatabase").css("border", "");

  if (tableList.trim() == "Select") {
    $("#ddlTablesList").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlTablesList").css("border", "");

  if (cols.trim() == "Select") {
    $("#ddlColumn").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlColumn").css("border", "");

  if (dbType != "SQL") {
    if (port.trim().length === 0) {
      $("#txtPort").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPort").css("border", "");
  }
  if (status) {
    var OptionArray = {};
    OptionArray["dbType"] = dbType;
    OptionArray["serverName"] = serverName;
    OptionArray["authMode"] = authMode;
    OptionArray["userName"] = userName;
    OptionArray["password"] = password;
    OptionArray["port"] = port;
    OptionArray["database"] = database;
    OptionArray["table"] = tableList;
    OptionArray["tableColumn"] = cols;
    OptionArray["sqlQuery"] = null;
    getDBDetailsforTxt(OptionArray);
  }
}

function getSqlQueryValuesforTxt() {
  var status = true;
  var dbType = $("#ddlDbType").val();
  var serverName = $("#txtServerName").val().trim();
  var userName = $("#txtUserName").val().trim();
  var password = $("#txtPassword").val().trim();
  var port = $("#txtPort").val().trim();
  var authMode = $("input[name='rblAuthenticationMode']:checked").val();
  var database = $("#ddlDatabase").val();
  var sqlQuery = $("#txtSqlQuery").val().trim();

  if (serverName.trim().length === 0) {
    $("#txtServerName").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#txtServerName").css("border", "");

  if ((dbType === "SQL") && (authMode === "Windows")) {

  }
  else {
    if (userName.trim().length === 0) {
      $("#txtUserName").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtUserName").css("border", "");

    if (password.trim().length === 0) {
      $("#txtPassword").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPassword").css("border", "");
  }

  if (database.trim() == "Select") {
    $("#ddlDatabase").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#ddlDatabase").css("border", "");

  if (sqlQuery == "") {
    $("#txtSqlQuery").attr("style", "border:1px solid #f10c0c");
    status = false;
  }
  else
    $("#txtSqlQuery").css("border", "");

  if (dbType != "SQL") {
    if (port.trim().length === 0) {
      $("#txtPort").attr("style", "border:1px solid #f10c0c");
      status = false;
    }
    else
      $("#txtPort").css("border", "");
  }
  //var sControlType = $("#hdnSelectedControlType").val();
  //var DataType = "";
  //if (sControlType == "Calendar") {
  //  DataType = "Date";
  //}
  //else {

  
  //}
  
  if (status) {
    var OptionArray = {};
    OptionArray["dbType"] = dbType;
    OptionArray["serverName"] = serverName;
    OptionArray["authMode"] = authMode;
    OptionArray["userName"] = userName;
    OptionArray["password"] = password;
    OptionArray["port"] = port;
    OptionArray["database"] = database;
    OptionArray["table"] = null;
    OptionArray["tableColumn"] = null;
    OptionArray["sqlQuery"] = sqlQuery;
   
    getDBDetailsforTxt(OptionArray);
  }
}

function getDBDetailsforTxt(optionArray) {
  var dataType = $("#Properties").find('#selectDataType').val();
  var requestURL = window.location.protocol + "//" + window.location.host + "/Template/getAllDatabaseData";
  $.ajax({
    url: requestURL,
  
    data: {
      DbType: optionArray["dbType"],
      DataBaseServer: optionArray["serverName"],
      AuthMode: optionArray["authMode"],
      DbUser: optionArray["userName"],
      DbPwd: optionArray["password"],
      Port: optionArray["port"],
      Database: optionArray["database"],
      Table: optionArray["table"],
      TableColumn: optionArray["tableColumn"],
      SqlQuery: optionArray["sqlQuery"],
      controlType: "single",
      controlDataType: dataType
    },
    type: 'POST',
    dataType: 'json',
    success: function (result) {
      if (result.IsValid) {
        $("txtColValues").val('');
       
        $.each(result.Data, function (index, value) {
          $("#txtColValues").val(value);
        
        });

      } else {
        $("#txtColValues").val('');
        alert(result.Message);
      
      }
    },
    error: function (result) {
      alert('error in connection');
    }
  });

}

function getDefaultTemplate() {
 
  var templateTypeId = $("#TemplateType").val();
  if ((typeModuleOpt === "2") && (templateTypeId > 0)) {
    var requestURL = window.location.protocol + "//" + window.location.host + "/Template/getAllDatabaseData";
    templateTypeId;
    $.ajax({
      url: requestURL,
      type: 'Get',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      // Fetch the stored token from localStorage and set in the header
      headers: {
        'PyramidTokenHeader': getTokenHeaders()
      },
      success: function(result) {
        if (result.IsValid) {
          templateId = result.Id;
          if (templateId > 0 && templateId != null) {
            getControlJson(0);
            templateId = null;
            document.getElementById('TemplateName').value = "";
          }
        } else {
          $("#maindiv").empty();
        }
      }
    });
  }
  

  
  
}
//function AutofillChangeCalendar(e) {

//  if (!$(e).is(':checked')) {
//    $("#customCal").css("display", "block");
//    $("#autofilloptionsCal").css("display", "none");
   


//  }
//  else {
//    $("#customCal").css("display", "none");
//    $("#autofilloptionsCal").css("display", "block");
    


//  }

//
