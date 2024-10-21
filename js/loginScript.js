
const loginForm = document.getElementsByClassName('login')[0];
let passwordVisible = false;
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    collectLoginData();
});

function collectLoginData(){

    const loginData = {
        email : document.getElementById('mailEntry').value,
        password : document.getElementById('passwordEntry').value 
    }

    callLoginApi(loginData);
}
function passwordShowfunctionality(){
    if(passwordVisible === false){
        document.getElementById('passwordEntry').type = "text";
         passwordVisible = true;
   } else {
        document.getElementById('passwordEntry').type = "password";
        passwordVisible = false;
    } 
}
async function callLoginApi(loginData){
    
    try{
        const response = await fetch('http://localhost:5001/api/user/login', 
        {
            method : 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        console.log(response)
        console.log("fetch successfull");
        const responseStatus = response.status;
       
        if(isStatusBad(responseStatus) === true){
            const responseJson = await response.json();
            const responseElment = document.getElementById('response');
            responseElment.innerHTML = `Not able to Login <br> ${responseJson.message} <br> Please try again`;

            setTimeout(() => {
                responseElment.innerHTML = ``;
            },4000);
            return;
        }
        
        const accessToken = await response.text();
        localStorage.setItem('accessToken',accessToken);

        loadHomePage();

    }
    catch
    {
        const responseElment = document.getElementById('response');
        responseElment.innerHTML = `Sorry something unexpected took place <br> Please try again`
        console.log("Catch Block Error");
    }
}

function loadHomePage(){
    document.getElementsByClassName('headerContainer')[0].style.opacity = 0;
    document.getElementsByClassName('screen')[0].style.marginTop = `100px`; 
    document.getElementsByClassName('screen')[0].innerHTML = `<div class="loader"></div>
    <div class="loading"> Successfully Logged In <br>Taking you to our Homepage</div>`
    
    setTimeout(() => {
        window.location.href = './../html/homepage.html'
    },1000);
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