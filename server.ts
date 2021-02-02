import * as Http from "http";

import * as Mongo from "mongodb";

const DB_NAME = 'Klausur';

let mongoClient: Mongo.MongoClient | null = null;


export namespace A08Server {
    console.log("Starting server");
    let port: number = Number(process.env.PORT);
    if (!port)
        port = 8100;

    mongoDbConnect();
    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(port);

    async function mongoDbConnect(): Promise<void>{
        const uri = "mongodb+srv://GISWISE2021:GISWISE2021@cluster0.qcexn.mongodb.net/Klausur?retryWrites=true&w=majority";
        mongoClient = new Mongo.MongoClient(uri, { useNewUrlParser: true });
        await mongoClient.connect();
    }

    function handleListen(): void {
        console.log("Listening");
    }

    async function login(request: URLSearchParams): Promise<{}> {
        if(!mongoClient){
            return {error: true};
        }

        let psw = request.get('password');
        let email = request.get('email');
        if(!psw || !email){
            return {error: true};
        }
        let userArray = await mongoClient.db(DB_NAME).collection("admins").find({email: email, password: psw}).toArray();
        if(userArray && userArray.length > 0){
            return {error: false, email};
        }
        return {error: true};

    }

    async function getItems(){
        if(!mongoClient){
            return {error: true};
        }
        let items = await mongoClient.db(DB_NAME).collection("items").find({}).toArray();
        return {error: false, items};
    }

    async function evaluateResponse(url: string, request: Http.IncomingMessage) {
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

    async function reserveItem(request: URLSearchParams){
        if(!mongoClient){
            return {error: true};
        }
        let name = request.get('name');
        let email = request.get('email');
        let itemName = request.get('itemName');
        if(!name || !email || !itemName){
            return {error: true};
        }
        let items = await mongoClient.db(DB_NAME).collection("items").find({name: itemName}).toArray();
        if(!items || items.length === 0){
            return {error: true};
        }
        let item = items[0];
        if(item.status !== 'frei'){
            return {error: true};
        }
        item.status = 'reserviert';
        item.owner = name+', '+email;
        await mongoClient.db(DB_NAME).collection("items").updateOne({name: item.name}, {$set: {...item}});
        return {error: false};
    }

    async function changeItemStatus(request: URLSearchParams){
        if(!mongoClient){
            return {error: true};
        }
        let itemName = request.get('itemName');
        if(!itemName){
            return { error: true};
        }
        let items = await mongoClient.db(DB_NAME).collection("items").find({name: itemName}).toArray();
        if(!items || items.length === 0){
            return {error: true};
        }
        let item = items[0];
        if(item.status === 'frei'){
            return {error: true};
        }
        if(item.status === 'reserviert'){
            item.status = 'ausgeliehen';
        }
        else if(item.status ==='ausgeliehen'){
            item.owner = '';
            item.status = 'frei';
        }
        else{
            return {error: true};
        }
        await mongoClient.db(DB_NAME).collection("items").updateOne({name: item.name}, {$set: {...item}});
        return {error: false};
    }


    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
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
