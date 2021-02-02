"use strict";
function startConfirmation() {
    var pConfirmation = document.getElementById('confirmation');
    if (!pConfirmation) {
        return;
    }
    var cost = localStorage.getItem('cost');
    var name = localStorage.getItem('name');
    if (!cost || !name) {
        return;
    }
    pConfirmation.innerHTML = pConfirmation.innerHTML.replace('{{name}}', name);
    pConfirmation.innerHTML = pConfirmation.innerHTML.replace('{{cost}}', cost);
}
startConfirmation();
