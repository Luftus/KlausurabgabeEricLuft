"use strict";
var main_url = "https://ericluftklausurabgabe.herokuapp.com";
function showError(message) {
    var field = document.getElementById('message');
    if (!field) {
        return;
    }
    field.setAttribute('style', 'color: red');
    field.innerHTML = message;
}
function showSuccess(message) {
    var field = document.getElementById('message');
    if (!field) {
        return;
    }
    field.setAttribute('style', 'color: green');
    field.innerHTML = message;
}
