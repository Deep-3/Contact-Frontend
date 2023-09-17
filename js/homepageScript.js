const getAll = document.getElementById('getAll');
getAll.addEventListener('click', displayRecords);

const getOne = document.getElementById('getOne');
getOne.addEventListener('click', displaygetRecordTemplate);

const create = document.getElementById('create');
create.addEventListener('click', generateCreateTemplate);

const update = document.getElementById('update');
update.addEventListener('click',generateUpdateTemplate)

const deleteRecord = document.getElementById('delete');
deleteRecord.addEventListener('click', generateDeletetemplate);

const displaySingleReocrd = document.getElementsByClassName('hero')[0];
const headerElement = document.getElementsByClassName('header')[0];
headerElement.addEventListener('click',function(event){
    
    if(event && event.target.matches('.logOut') || event.target.matches('.logOutMessage') || event.target.matches('#logOutIcon')){
        const updatedAccessToken =`invalid`
        localStorage.setItem('accessToken',updatedAccessToken);
        window.location.href = '../html/login.html'
    }
})

displaySingleReocrd.addEventListener('click', function(event){

    console.log(event.target);
    if(event.target && event.target.matches('.searchBtn') || event.target.matches('#getOneSearchIcon')){  
        getSelectedValue();
    }

    if(event.target && event.target.matches('.deleteBtn')){
        callDeleteRecord();
    }

});

displaySingleReocrd.addEventListener('submit', (event) => {
    event.preventDefault();

    if(event.target && event.target.matches('#newContact')){
        callCreateNewContact();
    }

    if(event.target && event.target.matches('#updateContact')){
        callUpdateContact();
    }
})

async function displayRecords(){
    const template = document.getElementsByClassName('hero')[0];
    template.innerHTML = ``;
    const accessToken = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:5001/api/contact/getContacts',
    {
        method : 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })

    const responseStatus = response.status;
    
    if(isStatusBad(responseStatus) === true){
        template.innerHTML = `<div id="faultresponse"> No records found</div>`;
        return;
    }

    let listOfContacts = await response.json();
    //listOfContacts = JSON.stringify(listOfContacts);

    console.log(listOfContacts);
    template.innerHTML = 
    `<table id="getAllRecords">
    <div class="subject">All Contacts</div>
    <tr>
      <th class="userHead">Name</th>
      <th class="emailHead">Email</th>
      <th  class="phoneHead">Phone</th>
    </tr>
  </table>`;

    for(let i = 0 ; i < listOfContacts.length ; i++){
        console.log(listOfContacts[i]);
        let username = listOfContacts[i].username;
        let email = listOfContacts[i].email;
        let phone = listOfContacts[i].phone;

        document.getElementById('getAllRecords').innerHTML += `
        <tr>
              <td>${username}</td>
              <td>${email}</td>
              <td>${phone}</td>
        </tr>
        `; 
    }
    
}

function displaygetRecordTemplate(){
    const template = document.getElementsByClassName('hero')[0];
    template.innerHTML = `
    <div class="searchContact">
            <div class="subject">Search Contact</div>
            
            <div class="deleteDiv">
                <div class="idDiv">
                    <div class="dropdown">
                        <select id="dropdownContent">
                            <option value="name">Name</option>
                            <option value="email">Email</option>
                            <option value="phoneNo">Phone no.</option>
                            <option value="id">Id</option>
                        </select>
                    </div>
                    <input type="text" placeholder="Enter Value" class="fields" id="idEntry" required>
                </div>
        
                <button class="searchBtn">Search</button>
                
            </div>
        
            <div id="faultresponse"></div>
        
           
        </div>

<div class="apiMessage">
    <div class="subject">Contact</div>
    <div id="records">
        <div class="record">
                <div class="userHead">NAME</div>
                <div class="emailHead">EMAIL</div>
                <div class="phoneHead">PHONE</div>
        </div>
    </div>
</div>`;
}

function getSelectedValue(){
    const selectedVal = document.getElementById("dropdownContent").value;
    
    if(selectedVal === "name"){
        callGetRecordByName();
    } else if(selectedVal === "email"){
        callGetRecordByEmail();
    } else if(selectedVal === "phoneNo"){
        callGetRecordByPhoneNo();
    } else {
        callGetRecordById();
    }
}
async function callGetRecordById(){
    
    const accessToken = localStorage.getItem('accessToken');
    const id = document.getElementById('idEntry').value;
    console.log(id);

    const response = await fetch(`http://localhost:5001/api/contact/getContact/${id}`,
    {
        method : 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })

    const responseStatus = response.status;
    if(isStatusBad(responseStatus) === true){
        
        console.log(await response.json());
        document.getElementById('faultresponse').innerHTML = `Something went wrong. <br> Please check the id and try again!`
        
        setTimeout(() => {  
            document.getElementById('faultresponse').innerHTML = ``;
        },2000);

        return;
    }

    const contactDetails = await response.json();

    document.getElementById('records').innerHTML += `
        <div class="record">
            <div class="userHead">${contactDetails.username}</div>
            <div class="emailHead">${contactDetails.email}</div>
            <div class="phoneHead">${contactDetails.phone}</div>
        </div>`;

}
async function callGetRecordByName(){
    
    const accessToken = localStorage.getItem('accessToken');
    const name = document.getElementById('idEntry').value;
    //console.log(id);

    const response = await fetch(`http://localhost:5001/api/contact/getContactbyName/${name}`,
    {
        method : 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })

    const responseStatus = response.status;
    if(isStatusBad(responseStatus) === true){
        
        console.log(await response.json());
        document.getElementById('faultresponse').innerHTML = `Something went wrong. <br> Please check the id and try again!`
        
        setTimeout(() => {  
            document.getElementById('faultresponse').innerHTML = ``;
        },2000);

        return;
    }

    const contactDetails = await response.json();

    for(let i = 0 ; i < contactDetails.length ; i++){
        document.getElementById('records').innerHTML += `
            <div class="record">
                <div class="userHead">${contactDetails[i].username}</div>
                <div class="emailHead">${contactDetails[i].email}</div>
                <div class="phoneHead">${contactDetails[i].phone}</div>
            </div>`;
    }

}
async function callGetRecordByPhoneNo(){
    
    const accessToken = localStorage.getItem('accessToken');
    const phoneNo = document.getElementById('idEntry').value;
    console.log(phoneNo);

    const response = await fetch(`http://localhost:5001/api/contact/getContactByPhoneNo/${phoneNo}`,
    {
        method : 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })

    const responseStatus = response.status;
    if(isStatusBad(responseStatus) === true){
        
        console.log(await response.json());
        document.getElementById('faultresponse').innerHTML = `Something went wrong. <br> Please check the id and try again!`
        
        setTimeout(() => {  
            document.getElementById('faultresponse').innerHTML = ``;
        },2000);

        return;
    }

    const contactDetails = await response.json();

    for(let i = 0 ; i < contactDetails.length ; i++){
        document.getElementById('records').innerHTML += `
            <div class="record">
                <div class="userHead">${contactDetails[i].username}</div>
                <div class="emailHead">${contactDetails[i].email}</div>
                <div class="phoneHead">${contactDetails[i].phone}</div>
            </div>`;
    }

}
async function callGetRecordByEmail(){
    
    const accessToken = localStorage.getItem('accessToken');
    const email = document.getElementById('idEntry').value;
    console.log(email);

    const response = await fetch(`http://localhost:5001/api/contact/getContactByEmail/${email}`,
    {
        method : 'GET',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })

    const responseStatus = response.status;
    if(isStatusBad(responseStatus) === true){
        
        console.log(await response.json());
        document.getElementById('faultresponse').innerHTML = `Something went wrong. <br> Please check the id and try again!`
        
        setTimeout(() => {  
            document.getElementById('faultresponse').innerHTML = ``;
        },2000);

        return;
    }

    const contactDetails = await response.json();

    for(let i = 0 ; i < contactDetails.length ; i++){
        document.getElementById('records').innerHTML += `
            <div class="record">
                <div class="userHead">${contactDetails[i].username}</div>
                <div class="emailHead">${contactDetails[i].email}</div>
                <div class="phoneHead">${contactDetails[i].phone}</div>
            </div>`;
    }

}

function generateCreateTemplate(){
    const template = document.getElementsByClassName('hero')[0];
    template.innerHTML = ` 
            <div class="createNewContact">
                <div class="subject">Add new Contact</div>
                
                <form id="newContact">

                        <div class="nameDiv">
                        <label for="name">Name</label>
                        <input type="text" placeholder="Enter Contact Name" class="fields" id="nameEntry" required>
                        </div>
                        
                        <div class="emailDiv">
                        <label for="email">Email</label>
                        <input type="text" placeholder="Enter Email Id" class="fields" id="mailEntry" required>
                        </div>
                        
                        <div class="phoneDiv">
                        <label for="phone">Phone no.</label>
                        <input type="text" placeholder="Enter Contact Number" class="fields" id="phoneNumberEntry" required>
                        </div>

                        <button type="submit" class="createBtn">CREATE</button>
                </form>

                <div class="apiMessage"></div>
            </div>`
}

async function callCreateNewContact(){

    let contactData = collectContactData();

    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:5001/api/contact/createContact`,
    {
        method : 'POST',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(contactData)
    })

    const responseStatus = response.status;
    if(isStatusBad(responseStatus) === true){
        document.getElementsByClassName('apiMessage')[0].innerHTML = 'Something went wrong ! Please Try Again'
        console.log(await response.json())
        return;
    }

    let data = await response.json();
    console.log(data);

    document.getElementsByClassName('apiMessage')[0].innerHTML = `New Contact Successfully created<br>Use the below id to search for this contact<br> ${data._id}`;
       
    
}

function generateUpdateTemplate(){
    const template = document.getElementsByClassName('hero')[0];
    template.innerHTML = ` 
            <div class="updateContact">
                <div class="subject">Add new Contact</div>
                
                <form id="updateContact">

                        <div class="idDiv">
                            <label for="name">Id</label>
                            <input type="text" placeholder="Enter Contact Id" class="fields" id="idEntry" required>
                        </div>
                        
                        <div class="nameDiv">
                            <label for="name">Name</label>
                            <input type="text" placeholder="Enter Contact Name" class="fields" id="nameEntry" required>
                        </div>
                        
                        <div class="emailDiv">
                            <label for="email">Email</label>
                            <input type="text" placeholder="Enter Email Id" class="fields" id="mailEntry" required>
                        </div>
                        
                        <div class="phoneDiv">
                            <label for="phone">Phone no.</label>
                            <input type="text" placeholder="Enter Contact Number" class="fields" id="phoneNumberEntry" required>
                        </div>

                        <button type="submit" class="updateBtn">UPDATE</button>
                </form>

                <div class="apiMessage"></div>
            </div>`
}

async function callUpdateContact(){

    console.log("hit");
    let contactData = collectContactData();
    let id = document.getElementById('idEntry').value;
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:5001/api/contact/updateContact/${id}`,
    {
        method : 'PUT',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(contactData)
    })
    console.log("done");
    const responseStatus = response.status;
    if(isStatusBad(responseStatus) === true){
        document.getElementsByClassName('apiMessage')[0].innerHTML = 'Something went wrong ! Please Try Again'
        console.log(response)
        return;
    }

    
    let data = await response.json();
    console.log(await data);

    document.getElementsByClassName('apiMessage')[0].innerHTML = `Contact Successfully updated`;
       
    
}

function generateDeletetemplate(){
    const template = document.getElementsByClassName('hero')[0];
    template.innerHTML = ` 
            <div class="DeleteContact">
                <div class="subject">Delete Contact</div>
                
                <div class="deleteDiv">
                    <div class="idDiv">
                    <label for="name">Id</label>
                    <input type="text" placeholder="Enter Contact id" class="fields" id="idEntry" required>
                    </div>

                    <button type="submit" class="deleteBtn">DELETE</button>
                    
                
                </div>

                <div class="apiMessage"></div>
            </div>`
}

async function callDeleteRecord(){
    
    let id = document.getElementById('idEntry').value;
    const accessToken = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:5001/api/contact/delContact/${id}`,
    {
        method : 'DELETE',
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`
        }
    })

    const responseStatus = response.status;
    if(isStatusBad(responseStatus) === true){
        document.getElementsByClassName('apiMessage')[0].innerHTML = 'Something went wrong ! Please Try Again'
        console.log(response)
        return;
    }

    document.getElementsByClassName('apiMessage')[0].innerHTML = 'Successfully Deleted Contact';
    console.log(await response.json());

}

function collectContactData(){
    let contactData = {
        name : document.getElementById('nameEntry').value,
        email : document.getElementById('mailEntry').value,
        phone : document.getElementById('phoneNumberEntry').value,
    }
    //console.log(contactData);
    return contactData;
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


