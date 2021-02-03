import * as Http from "http";

import * as Mongo from "mongodb";
                                    //HTTP und mongodb Imports 
const DB_NAME = 'Klausur'; //Name der MongoDB Atlas

let mongoClient: Mongo.MongoClient | null = null; // Initialisierung einer leeren Variable die dann gefüllt wird 


export namespace A08Server {
    console.log("Starting server");
    let port: number = Number(process.env.PORT);
    if (!port)
        port = 8100;                               // Wenn der Port nicht gefunden wird, nehmen wir den 8100 Port

    mongoDbConnect();             
    let server: Http.Server = Http.createServer(); // Zeile 17-20 https://github.com/Plagiatus/GIS_SoSe2020/blob/master/Aufgabe08/Server/server.ts
    server.addListener("request", handleRequest);  
    server.addListener("listening", handleListen);
    server.listen(port);

    async function mongoDbConnect(): Promise<void>{ //verbindung mit dem mongo atlas aufbauen/ warten bis man connected
        const uri = "mongodb+srv://GISWISE2021:GISWISE2021@cluster0.qcexn.mongodb.net/Klausur?retryWrites=true&w=majority";
        mongoClient = new Mongo.MongoClient(uri, { useNewUrlParser: true }); //Zeile 23+24 aus der Cluster Connection Method von Atlas
        await mongoClient.connect(); //Verbindung mit Mongo 
    }

    function handleListen(): void { //Zeile28-30 https://github.com/Plagiatus/GIS_SoSe2020/blob/master/Aufgabe08/Server/server.ts
        console.log("Listening");
    }

    async function login(request: URLSearchParams): Promise<{}> {
        if(!mongoClient){
            return {error: true}; //wenn die Variable nicht initialisiert wurde error:true wird ausgegeben
        }

        let psw = request.get('password'); //Passwort wird übergeben
        let email = request.get('email');  //  E-mail wird übergeben
        if(!psw || !email){
            return {error: true}; //Wenn eines von beiden nicht ausgefüllt wird kommt eine Error-Meldung 
        }
        let userArray = await mongoClient.db(DB_NAME).collection("admins").find({email: email, password: psw}).toArray(); //Schaut in der Datenbank ob es jemanden in der Datenbank gibt mit den eingegeben Daten
        if(userArray && userArray.length > 0){
            return {error: false, email}; //Wenn er einen gefunden hat error:false, "eingegebene email"
        }
        return {error: true}; //Wenn es keinen gibt error:true 

    }

    async function getItems(){
        if(!mongoClient){
            return {error: true};
        }
        let items = await mongoClient.db(DB_NAME).collection("items").find({}).toArray(); //Baut ein Array aus der collection "items"
        return {error: false, items}; //Aufbau des Arrays
    }

    async function evaluateResponse(url: string, request: Http.IncomingMessage) { //  // Diese Funktion soll nach dem HTTP prinzip je nach url erstellt er eine Seite welche dann die Datensätze überträgt 
        console.log(url);
        let response = {};
        if(url.startsWith('/Items')){
            response = await getItems();
        }
        if(url.startsWith('/Login')){
            let data = new URLSearchParams(url.replace('/Login', ''));
            response = await login(data);
        }
        if(url.startsWith('/ChangeItemStatus')){
            let data = new URLSearchParams(url.replace('/ChangeItemStatus', ''));
            response = await changeItemStatus(data);
        }
        if(url.startsWith('/ReserveItem')){
            let data = new URLSearchParams(url.replace('/ReserveItem', ''));
            response = await reserveItem(data);
        }

        return JSON.stringify(response);
    }

    async function reserveItem(request: URLSearchParams){ //Reservierungsfunktion 
        if(!mongoClient){
            return {error: true};
        }
        let name = request.get('name');
        let email = request.get('email');
        let itemName = request.get('itemName'); //Name, Email und Itemname werden ausgelesen 
        if(!name || !email || !itemName){
            return {error: true}; // wenn eins nicht gesetzt ist error:true 
        }
        let items = await mongoClient.db(DB_NAME).collection("items").find({name: itemName}).toArray();//wird geschaut ob es überhaupt items gibt
        if(!items || items.length === 0){
            return {error: true};
        }
        let item = items[0];
        if(item.status !== 'frei'){
            return {error: true}; //Errorüberprüfung, wenn der Status schon reserviert ist, kann dieser ja nicht reserviert werden
        }
        item.status = 'reserviert'; //wenn er also nicht schon reserviert ist, kann er diesen auf reserviert setzen
        item.owner = name+', '+email; //Owner wird auf name und e-mail gesetzt 
        await mongoClient.db(DB_NAME).collection("items").updateOne({name: item.name}, {$set: {...item}});//items werden ausgelesen und wieder geupdated, aufgrund des reservierungsstatus
        return {error: false};
    }

    async function changeItemStatus(request: URLSearchParams){
        if(!mongoClient){
            return {error: true};
        }
        let itemName = request.get('itemName'); //Name des Items wird ausgelesen 
        if(!itemName){
            return { error: true};
        }
        let items = await mongoClient.db(DB_NAME).collection("items").find({name: itemName}).toArray(); //Auslesen des Namens aus der Datenbank 
        if(!items || items.length === 0){
            return {error: true}; //Wenn wir keins finden error: true 
        }
        let item = items[0];
        if(item.status === 'frei'){
            return {error: true}; //Wenn der Status auf frei ist kann der Admin diesen ja nicht wechseln 
        }
        if(item.status === 'reserviert'){
            item.status = 'ausgeliehen'; //Wenn der Status reserviert ist soll dieser auf ausgeliehen gechanged werden
        }
        else if(item.status ==='ausgeliehen'){
            item.owner = '';
            item.status = 'frei'; // und wenn der Status ausgeleihen ist, soll dieser auf frei gesetzt werden und der Owner soll gelöscht werden
        }
        else{
            return {error: true};
        }
        await mongoClient.db(DB_NAME).collection("items").updateOne({name: item.name}, {$set: {...item}});//Am Ende ein Update,man sucht den Itemnamen und mittels dem set soll es dann die properties ändern von dem objekt
        return {error: false};
    }


    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> { // Zeile 135-146 https://github.com/Plagiatus/GIS_SoSe2020/blob/master/Aufgabe08/Server/server.ts
        console.log("I hear voices!", _request.url);

        let response = await evaluateResponse(<string>_request.url, _request);

        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");

        _response.write(response);

        _response.end();
    }
}
// //Collection: users
// Felder:
// {
//   email: string;
//   password: string;
// }
// //Collection: items
// Felder:
// {
//   name: string;
//   pic: string;
//   status: string;
//   beschreibung: string;
//   owner: string;
// }
