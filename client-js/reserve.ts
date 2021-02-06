let pItemName = document.getElementById('itemName');
let emailField = document.getElementById('email') as HTMLInputElement;
let nameFeld = document.getElementById('name') as HTMLInputElement;
let submitReserve = document.getElementById('submit-reserve');

if(submitReserve){
    submitReserve.addEventListener('click', reserveItem);
}



function startReserve(){
    let itemName = localStorage.getItem('toReserve'); //Daten werden aus dem local Storage rausgelesen 
    if(!itemName || !pItemName || !emailField || !nameFeld || !submitReserve){
        return;
    }
    pItemName.innerHTML = itemName; // item wird ins Html reingeschrieben 


}
startReserve();


async function reserveItem(evt: MouseEvent){ //Wenn man auf den Knopf drückt 
    evt.preventDefault();

    let name = nameFeld.value; // Name wird aus dem Feld rausgelesen 
    let email = emailField.value; //Email wird aus dem Feld rausgelesen
    let itemName = localStorage.getItem('toReserve');// itemName steht im local drinnen 
    if(!name || !email || !itemName){
       errorAnzeigen("Es wurden nicht alle benötigten Felder ausgefüllt.");
        return;
    }
    let params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('itemName', itemName);
    let reserveRequest = await fetch(main_url+'/ReserveItem?'+params.toString()); //fetch aus ReserveItem 
    let reserveResponse= await reserveRequest.json();
    if(reserveResponse.error){
       errorAnzeigen("Der Gegenstand konnte nicht reserviert werden.");
    }
    else{
        localStorage.setItem('name', name);
        window.location.assign('Reservierungsbestaetigung.html'); //Zur bestellbestätigung 
    }
}

