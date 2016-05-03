/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */

$(document).ready(function() {
   HideFooter();
});


function HideFooter()
{
    SetElementVisibility(document.getElementById("footerDiv"), "none");
}
function ShowFooter()
{
    SetElementVisibility(document.getElementById("footerDiv"), "block");
}
function SetElementVisibility(pageElement, value)
{
    pageElement.style.display = value;
}


function LoadApprovals()
{
    $.afui.clearHistory();
    // Add Code to be run each time tab clicked here.
    //CallServiceGetApprovals();
}