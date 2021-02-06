let emailFeld = document.getElementById('email') as HTMLInputElement;
let passwordFeld = document.getElementById('password') as HTMLInputElement;

let submitButton = document.getElementById('submit-login');

if(submitButton){
    submitButton.addEventListener('click', adminLogin);
}


async function adminLogin(evt: MouseEvent){
    evt.preventDefault();

    let mail = emailFeld.value;
    let password = passwordFeld.value; //parameter auslesen 

    if(!mail || !password){
        errorAnzeigen("Es wurden nicht alle Pflichtfelder ausgefüllt.");
        return;
    }
    let params = new URLSearchParams();
    params.append('email', mail);
    params.append('password', password);
    let request = await fetch(main_url+'/Login?'+params.toString()); //Request machen 
    let response = await request.json();
    if(response.error){
        errorAnzeigen("Benutzername oder Password wurden nicht korrekt eingegeben.");
    }
    else{
        //Speicherung im local Storage, dadurch kann man auch in der LoginAdmin.html besipielsweise drauf schauen 
        localStorage.setItem('loggedIn', 'true');
        window.location.assign('Admin/Astareservierungsansicht.html'); //wenn eingeloggt kann er auf die reservierungsseite 
    }
}
