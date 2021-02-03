function startConfirmation(){
    let pConfirmation = document.getElementById('confirmation'); //er nimmt sich die confirmation 
    if(!pConfirmation){
        return;
    }
    let cost = localStorage.getItem('cost');
    let name = localStorage.getItem('name'); //holt sich cost und name 
    if(!cost || !name){
        return; //mahct nichts wenn beide nicht gelesen sind 
    }
    pConfirmation.innerHTML = pConfirmation.innerHTML.replace('{{name}}', name);
    pConfirmation.innerHTML = pConfirmation.innerHTML.replace('{{cost}}', cost); //Wenn beide gelesen werden können, werden diese im Text geändert.
}

startConfirmation();
