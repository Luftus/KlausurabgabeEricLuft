interface Item{
    name: string;
    pic: string;
    status: string;
    beschreibung: string;
    owner: string;
    gebuehren: string;
}


async function start(){
    let itemRequest = await fetch(main_url+'/Items'); //items werden gefetcht 
    let itemResponse = await itemRequest.json();
    let itemListDiv = document.getElementById('item-list');
    if(!itemListDiv){
        return;
    }
    itemListDiv.innerHTML = '';

    if(itemResponse.error){
        showError("Die Gegenstände konnten nicht abgerufen werden.");
    }
    else{
        let i = 0;
        itemResponse.items.forEach((item: Item) =>{
            if(!itemListDiv){
                return;
            }
            itemListDiv.appendChild(createItemElement(item)); //erzeugung der Liste wie in der asta.ts 
        });
    }
}
start();


function createItemElement(item: Item): HTMLElement{
    let mainDiv = document.createElement('div');
    mainDiv.setAttribute('class', 'artikel');

    let img = document.createElement('img');
    img.setAttribute('src', 'BilderAusleihzubehör/'+item.pic);
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

    let pItemPreis = document.createElement('p');
    pItemPreis.setAttribute('class', 'item-price');
    pItemPreis.innerHTML = item.gebuehren;

    let btn;
    if(item.status === "frei"){
        btn = document.createElement('button'); //Logik umgekehrt wie in der asta.ts der Button soll NUR angezeigt werden wenn dieser auch frei ist 
        btn.innerHTML = "Reservieren!";
        btn.addEventListener('click', () => reserve(item.name, item.gebuehren)); //aufrufen der reserve funktion
    }

    mainDiv.appendChild(img);
    mainDiv.appendChild(pItemName);
    mainDiv.appendChild(pDescription);
    mainDiv.appendChild(pItemStatus);
    mainDiv.appendChild(pItemPreis);
    if(btn){
        mainDiv.appendChild(btn);
    }

    return mainDiv;
}

async function reserve(itemName: string, gebuehren: string){
    localStorage.setItem('toReserve', itemName);
    localStorage.setItem('cost', gebuehren);
    window.location.assign('Reservieren.html'); //Schlicht eine weiterleitung der Daten auf die Reservieren.html, parameter werden gespeichert 
}



