interface Item{
    name: string;
    pic: string;
    status: string;
    beschreibung: string;
    owner: string;
}


async function startAdmin(){
    let loggedIn = localStorage.getItem('loggedIn');
    if(!loggedIn){
        window.location.assign('../LoginAdmin.html');
    }
    let itemRequest = await fetch(main_url+'/Items');
    let itemResponse = await itemRequest.json();
    let itemListDiv = document.getElementById('item-list');
    if(!itemListDiv){
        return;
    }
    itemListDiv.innerHTML = '';

    if(itemResponse.error){
        showError("Die Gegenstände konnten nicht abgerufen werden. Sie werden in 3 Sekunden weitergeleitet..");
        setTimeout(() =>{
            window.location.assign('../LoginAdmin.html');
        }, 3000);        
    }
    else{
        let i = 0;
        itemResponse.items.forEach((item: Item) =>{
            if(!itemListDiv){
                return;
            }
            itemListDiv.appendChild(createItemElementAdmin(item));
        });
    }
}
startAdmin();


function createItemElementAdmin(item: Item): HTMLElement{
    let mainDiv = document.createElement('div');
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
        btn.addEventListener('click', () => changeStatus(item.name));
    }

    if(item.status=== "ausgeliehen"){
        btn = document.createElement('button');
        btn.innerHTML = "Auf frei setzen.";
        btn.addEventListener('click', () => changeStatus(item.name));
    }

    mainDiv.appendChild(img);
    mainDiv.appendChild(pItemName);
    mainDiv.appendChild(pDescription);
    mainDiv.appendChild(pItemStatus);
    mainDiv.appendChild(pReservedBy);
    if(btn){
        mainDiv.appendChild(btn);
    }

    return mainDiv;
}

async function changeStatus(itemName: string){
    let params = new URLSearchParams();
    params.append('itemName', itemName);

    let itemRequest = await fetch(main_url+'/ChangeItemStatus?'+params.toString());
    let itemResponse = await itemRequest.json();
    if(itemResponse.error){
        showError("Der Gegenstand konnte nicht bearbeitet werden.");
    }
    else{
        //re render page
        startAdmin();
    }
}



