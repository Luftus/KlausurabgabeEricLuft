let pItemName = document.getElementById('itemName');
let emailField = document.getElementById('email') as HTMLInputElement;
let nameFeld = document.getElementById('name') as HTMLInputElement;
let submitReserve = document.getElementById('submit-reserve');

if(submitReserve){
    submitReserve.addEventListener('click', reserveItem);
}



function startReserve(){
    let itemName = localStorage.getItem('toReserve');
    if(!itemName || !pItemName || !emailField || !nameFeld || !submitReserve){
        return;
    }
    pItemName.innerHTML = itemName;


}
startReserve();


async function reserveItem(evt: MouseEvent){
    evt.preventDefault();

    let name = nameFeld.value;
    let email = emailField.value;
    let itemName = localStorage.getItem('toReserve');
    if(!name || !email || !itemName){
        showError("Es wurden nicht alle benötigten Felder ausgefüllt.");
        return;
    }
    let params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('itemName', itemName);
    let reserveRequest = await fetch(main_url+'/ReserveItem?'+params.toString());
    let reserveResponse= await reserveRequest.json();
    if(reserveResponse.error){
        showError("Der Gegenstand konnte nicht reserviert werden.");
    }
    else{
        localStorage.setItem('name', name);
        window.location.assign('Reservierungsbestaetigung.html');
    }
}

