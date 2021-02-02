let emailFeld = document.getElementById('email') as HTMLInputElement;
let passwordFeld = document.getElementById('password') as HTMLInputElement;

let submitButton = document.getElementById('submit-login');

if(submitButton){
    submitButton.addEventListener('click', submitAdminLogin);
}


async function submitAdminLogin(evt: MouseEvent){
    evt.preventDefault();

    let mail = emailFeld.value;
    let password = passwordFeld.value;

    if(!mail || !password){
        showError("Es wurden nicht alle Pflichtfelder ausgefüllt.");
        return;
    }
    let params = new URLSearchParams();
    params.append('email', mail);
    params.append('password', password);
    let request = await fetch(main_url+'/Login?'+params.toString());
    let response = await request.json();
    if(response.error){
        showError("Benutzername oder Password wurden nicht korrekt eingegeben.");
    }
    else{
        //logged in
        localStorage.setItem('loggedIn', 'true');
        window.location.assign('Admin/Astareservierungsansicht.html');
    }
}
