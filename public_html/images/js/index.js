/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/* global ShipmentNo, Description, Source, Destination, deliveryDate, date, jsonStr */

var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var shipDBName = "Delivery";
var shipRelationName = "Shipment";
var connToken = "90933241|-31949278380299258|90950872";

$("#shipNo").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}
function getShipNoAsJsonObj() {
    var shipNo = $("#shipNo").val();
    var jsonStr = {
        No: shipNo
    };
    return JSON.stringify(jsonStr);
}
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#shipNo").val(record.No);
    $("#shipDesc").val(record.Description);
    $("#shipSrc").val(record.Source);
    $("#shipDesti").val(record.Destination);
    $("#shipDate").val(record.ExpDate);
    $("#shipDelDate").val(record.DeliveryDate);
}
function resetForm() {
    $("#shipNo").val("");
    $("#shipDesc").val("");
    $("#shipSrc").val("");
    $("#shipDesti").val("");
    $("#shipDate").val("");
    $("#shipDelDate").val("");
    $("#shipNo").prop("disabled", true);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#shipNo").focus();
}
function validateData() {
    var shipNo, shipDesc, shipSrc, shipDesti, shipDate, shipDelDate;
    shipNo = $("#shipNo").val();
    shipDesc = $("#shipDesc").val();
    shipSrc = $("#shipSrc").val();
    shipDesti = $("#shipDesti").val();
    shipDate = $("#shipDate").val();
    shipDelDate = $("#shipDelDate").val();

    if (shipNo === " ") {
        alert("Shipnment No Missing!!");
        $("#shipNo").focus();
        return "";
    }
    if (shipDesc === " ") {
        alert("Description is Missing!!");
        $("#shipDesc").focus();
        return "";
    }
    if (shipSrc === " ") {
        alert("Source Missing!!");
        $("#shipNo").focus();
        return "";
    }
    if (shipDesti === " ") {
        alert("Destination Missing!!");
        $("#shipDesti").focus();
        return "";
    }
    if (shipDate === " ") {
        alert("Shipment date is Missing!!");
        $("#shipDate").focus();
        return "";
    }
    if (shipDelDate === " ") {
        alert("Expected Delivery-Date is Missing!!");
        $("#shipDelDate").focus();
        return "";
    }
    var jsonStrObj = {
        No: shipNo,
        Description: shipDesc,
        Source: shipSrc,
        Destination: shipDesti,
        ExpDate: shipDate,
        DeliveryDate: shipDelDate
    };
    return JSON.stringify(jsonStrObj);
}
function getShip() {
    var shiNoJsonObj = getShipNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, shipDBName, shipRelationName, shiNoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJasonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJasonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#shipNo").focus();
    } else if (resJasonObj.status === 200) {
        $("#shipNo").prop("disabled", true);
        fillData(resJasonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#shipDesc").focus();
    }
}
function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, shipDBName, shipRelationName);
    jQuery.ajaxSetup({async: false});
    var resJasonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#shipNo").focus();
}
function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, shipDBName, shipRelationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJasonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJasonObj);
    resetForm();
    $("#shipNo").focus();
}