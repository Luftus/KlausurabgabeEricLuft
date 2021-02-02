let main_url = "http://localhost:8100";

function showError(message: string){
    let field = document.getElementById('message');
    if(!field){
        return;
    }
    field.setAttribute('style', 'color: red');
    field.innerHTML = message;
}

function showSuccess(message: string){
    let field = document.getElementById('message');
    if(!field){
        return;
    }
    field.setAttribute('style', 'color: green');
    field.innerHTML = message;
}
