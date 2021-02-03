interface Item{
    name: string;
    pic: string;
    status: string;
    beschreibung: string;
    owner: string;
}


async function startAdmin(){ // Eingeloggter User wird ausgelesen 
    let loggedIn = localStorage.getItem('loggedIn');
    if(!loggedIn){
        window.location.assign('../LoginAdmin.html');
    }
    let itemRequest = await fetch(main_url+'/Items');
    let itemResponse = await itemRequest.json(); //Request und holen uns die Items 
    let itemListDiv = document.getElementById('item-list'); //Div rausholen indem alle items drinnen liegen 
    if(!itemListDiv){
        return;
    }
    itemListDiv.innerHTML = ''; // Div wird geleert 

    if(itemResponse.error){
        showError("Die Gegenstände konnten nicht abgerufen werden. Sie werden in 3 Sekunden weitergeleitet..");
        setTimeout(() =>{
            window.location.assign('../LoginAdmin.html');
        }, 3000); //Errormeldung, in 3 Sekunden versucht die Seite dann neu zu laden      
    }
    else{
        let i = 0;
        itemResponse.items.forEach((item: Item) =>{ //Alle items werden durchgegangen 
            if(!itemListDiv){
                return;
            }
            itemListDiv.appendChild(createItemElementAdmin(item)); //appenden an das itemlistdiv , aufrufen von createItemElementAdmin 
        });
    }
}
startAdmin();


function createItemElementAdmin(item: Item): HTMLElement{ //Hier wird ein Item weitergegeben, es erzeugt dann pro Item 
    let mainDiv = document.createElement('div'); //mainDiv wird erzeugt 
    mainDiv.setAttribute('class', 'artikel');

    let img = document.createElement('img');
    img.setAttribute('src', '../BilderAusleihzubehör/'+item.pic);
    img.setAttribute('class', 'picture');

    let pItemName = document.createElement('p');
    pItemName.setAttribute('class', 'item-name');
    pItemName.innerHTML = item.name;


    let pDescription = document.createElement('p');
    pDescription.setAttribute('class', 'item-desc');
    pDescription.innerHTML = item.beschreibung;

    let pItemStatus = document.createElement('p');
    pItemStatus.setAttribute('class', 'item-status');
    pItemStatus.innerHTML = "Status: "+ item.status;

    let pReservedBy = document.createElement('p');
    pReservedBy.setAttribute('class', 'item-reserved');
    pReservedBy.innerHTML = "Reserviert von: "+ item.owner;

    let btn;
    if(item.status === "reserviert"){
        btn = document.createElement('button');
        btn.innerHTML = "Auf ausgeliehen setzen.";
        btn.addEventListener('click', () => changeStatus(item.name)); //click listener für den Admin um den reservierungsstatus von reserviert auf ausgeliehen zu setzen
    }

    if(item.status=== "ausgeliehen"){
        btn = document.createElement('button');
        btn.innerHTML = "Auf frei setzen.";
        btn.addEventListener('click', () => changeStatus(item.name)); //click listener für den Admin um den reservierungsstatus von ausgeliehen auf frei zu setzen
    }

    mainDiv.appendChild(img); //Von Zeile 43 werden an das mainDiv angehängt, img itemname descr etc.
    mainDiv.appendChild(pItemName);
    mainDiv.appendChild(pDescription);
    mainDiv.appendChild(pItemStatus);
    mainDiv.appendChild(pReservedBy);
    if(btn){
        mainDiv.appendChild(btn); //Buttonelement wird angehängt 
    }

    return mainDiv;
}

async function changeStatus(itemName: string){
    let params = new URLSearchParams();
    params.append('itemName', itemName); //Itemname wird übergeben, Beispielsweise kamera 

    let itemRequest = await fetch(main_url+'/ChangeItemStatus?'+params.toString());
    let itemResponse = await itemRequest.json(); //Kamera wird beispielsweise gefetcht 
    if(itemResponse.error){
        showError("Der Gegenstand konnte nicht bearbeitet werden.");
    }
    else{
        //gegenstand konnte bearbeitet werden, wir springen wieder an den Anfang bei startAdmin und die Seite wird neu gerendert.
        startAdmin();
    }
}



