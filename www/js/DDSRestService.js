/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */

var _RestServiceBaseURL = "http://localhost:1342/MobileService.svc/"; 
var _ApplicationState = {ConnectionToken:'00000000-0000-0000-0000-000000000000', IfNeededOtherParamsGoHere:-1};



function CallServiceLogin() {
    var postParameter = GetUserCredentials();
    CallRestService("Login", postParameter, LoginSuccess, LoginFailure);
}
function LoginSuccess(data) {
    if (data.ConnectionActive) {
        _ApplicationState.ConnectionToken = data.ConnectionToken;
        SetLoginMessage("");
        ShowFooter();
        
        // clear back button
        $.afui.clearHistory();
        // redirect 'em
        $.afui.loadContent("#approvalTab",false,false,"Down");
        CallServiceGetApprovals();
    }
    else {
        SetLoginMessage(data.Message);
    }
}
function LoginFailure() {
   SetLoginMessage("Service Down.");
}


function CallServiceGetApprovals() {
    var postParameter = GetDDSServiceParameterCustomerID();
    CallRestService("GetApprovals", postParameter, GetApprovalsSuccess, GetApprovalsFailure);
}
function GetApprovalsSuccess(data) {
    if (data.m_Item1.ConnectionActive) {
        SetApprovalMessage("");
        var arrayLength = data.m_Item2.length;
        for (var index = 0; index < arrayLength; index++)
            AppendApproval(data.m_Item2[index], index);
    }
    else {
        SetApprovalMessage(data.Message);
    }
}
function GetApprovalsFailure() {
    SetApprovalMessage("message here.");
}

function AppendApproval(approval, index)
{
    $("#Approvals").append(GetApprovalListItem(approval, index));
    $("#ApprovalDetailPanels").append(GetApprovalDetailPanel(approval.ApprovalID));
}

function GetApprovalListItem(approval, index)
{
    var elementID = "item" + approval.ApprovalID;
    var title = '(' + approval.ApprovalID + ')&nbsp;&nbsp;(' + approval.CustomerID + ')&nbsp;&nbsp;(' + approval.Description + ')';
    var approvalListItem = '<li style="background-color:' + GetAlternatingBackgroundColor(index) + ';"><a href="#' + elementID + '">' + title + '</a></li>';
    
    return approvalListItem;
}
function GetApprovalDetailPanel(approvalID)
{
    var elementID = 'item' + approvalID;
    var title = 'Item ' + approvalID;
    var selectElementSuffix = 'select' + approvalID;
    var noteElementSuffix = 'note' + approvalID;
    
    var approvalDetailPanel = '<div class="panel" data-title="' + title + '" id="' + elementID + '">';
    approvalDetailPanel += '<div>Hi dale ' + title + '</div>';
    approvalDetailPanel += '</div>';
    
    return approvalDetailPanel;
}




function CallRestService(restServiceMethod, postParameter, successFunction, errorFunction) {
    $.ajax({
        timeout: 10000,
        type: "POST",
        url: _RestServiceBaseURL + restServiceMethod,
        data: JSON.stringify(postParameter),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: successFunction,
        error: errorFunction
    });
}

function GetUserCredentials() {
    var customerID = GetElementValue("tCustomerID", -1);
    var loginID = GetElementValue("tLoginID", "-1");
    var password = GetElementValue("tPassword", "-1");

    var userCredentials = {
        CustomerID: customerID,
        LoginID: loginID,
        Password: password
    };
    
    return userCredentials;
}

function GetDDSServiceParameterCustomerID() {
    var customerID = -1; // currently not used
    
    var ddsServiceParameterCustomerID = {
        "ConnectionToken": _ApplicationState.ConnectionToken,
        "CustomerID": customerID
    };

    return ddsServiceParameterCustomerID;
}



function GetElementValue(elementName, defaultValue)
{
    var elementValue = document.getElementById(elementName).value;
    if (elementValue.length === 0)
        elementValue = defaultValue;
    return elementValue;
}
function GetAlternatingBackgroundColor(index)
{   
    var backgroundColor = "aliceblue";
    if (isOdd(index))
        backgroundColor = "bisque";
    return backgroundColor;
}
function isOdd(num) { return num % 2;}

function SetLoginMessage(message)
{
    SetMessage("LoginMessage", message);
}
function SetApprovalMessage(message)
{
    SetMessage("ApprovalMessage", message);
}
function SetMessage(elementID, message)
{
    $("#" + elementID).html("");
    $("#" + elementID).append(message);
}