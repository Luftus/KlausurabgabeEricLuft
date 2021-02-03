let main_url = "https://ericluftklausurabgabe.herokuapp.com"; // URL

function showError(message: string){
    let field = document.getElementById('message'); //Feldauslesung 
    if(!field){
        return;
    }
    field.setAttribute('style', 'color: red');
    field.innerHTML = message; // Errorfunktion 
}
