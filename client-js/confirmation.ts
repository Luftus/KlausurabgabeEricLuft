function startConfirmation(){
    let pConfirmation = document.getElementById('confirmation');
    if(!pConfirmation){
        return;
    }
    let cost = localStorage.getItem('cost');
    let name = localStorage.getItem('name');
    if(!cost || !name){
        return;
    }
    pConfirmation.innerHTML = pConfirmation.innerHTML.replace('{{name}}', name);
    pConfirmation.innerHTML = pConfirmation.innerHTML.replace('{{cost}}', cost);
}

startConfirmation();
