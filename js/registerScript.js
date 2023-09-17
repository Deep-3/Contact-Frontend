const registerForm = document.getElementById('register');
let passwordVisible = false;

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    collectFormData();
});

function passwordShowfunctionality(){
    if(passwordVisible === false){
        document.getElementById('passwordEntry').type = "text";
         passwordVisible = true;
   } else {
        document.getElementById('passwordEntry').type = "password";
        passwordVisible = false;
    } 
}
function collectFormData(){

    const formData = {
        username: document.getElementById('userNameEntry').value,
        email: document.getElementById('mailEntry').value,
        password: document.getElementById('passwordEntry').value
    };

    callRegisterApi(formData);
}

async function callRegisterApi(formData){
 
    try{

        const response = await fetch('http://localhost:5001/api/user/register',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        console.log("fetch successfull");
        const responseStatus = response.status;
        const responseJson = await response.json();

        if(isStatusBad(responseStatus) === true){
            const responseElment = document.getElementById('response');
            responseElment.innerHTML = `Registration unsuccessfull <br> ${responseJson.message} <br> Please try again`;

            setTimeout(() => {
                responseElment.innerHTML = ``;
            },4000);
            return;
        }

        loadLogin();

    }
    catch{
        const responseElment = document.getElementById('response');
        responseElment.innerHTML = `Sorry something unexpected took place <br> Please try again`
        console.log("Catch Block Error");
    }

}

function loadLogin(){

    document.getElementsByClassName('screen')[0].innerHTML = `<div class="loader"></div>
    <div class="loading"> Successfully Registered In <br>Taking you to Login Page</div>`
    
    setTimeout(() => {
        window.location.href = '../html/login.html'
    },2000);
}

function isStatusBad(status){

    if(status === 400 || 
        status === 401 || 
        status === 402 || 
        status === 403 || 
        status === 404 || 
        status === 500){
            return true;
    }

    return false;
}