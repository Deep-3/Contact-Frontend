function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

document.getElementById("exportBtn").addEventListener("click", () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    const data = parseJwt(token);

    fetch("http://localhost:5001/api/contact/export_vcf", {
        method: "POST",
        body: JSON.stringify({ user_id: data.user.user_id }),   // Pass the username in a JSON body
        headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob(); // Assuming you're downloading a VCF file
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'contacts.vcf';  // Filename for the VCF file
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});
// Adding event listener for the import button
// import.js
document.getElementById("importFile").addEventListener("change", function(event) {
  
    const template = document.getElementsByClassName('hero')[0];
    template.innerHTML = ``;
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    // console.log(token)
    const data = parseJwt(token);

    const file = event.target.files[0]; // Get the selected file
    if (!file) {
        alert("No file selected");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const vcfContent = e.target.result; // Get the file content as text
        const contacts = parseVCF(vcfContent); // Parse the VCF content
        console.log(contacts);
        fetch("http://localhost:5001/api/contact/import_vcf", {
            method: "POST",
            body: JSON.stringify({contacts}),   // Pass the username in a JSON body
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((response) => {
            console.log(response)
            template.innerHTML = `<div id="faultresponse" >Sucessfully added in your contact</div>`;

        })
        //document.getElementById("output").textContent = JSON.stringify(contacts, null, 2); // Display the contacts
    };
    reader.readAsText(file); // Read the file as text
    
});

// Function to parse VCF content into an array of JavaScript objects
function parseVCF(vcf) {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        console.error('No token found in localStorage');
        return;
    }

    const data = parseJwt(token);

    const contacts = [];
    const vCardBlocks = vcf.split("BEGIN:VCARD").slice(1); // Split by vCards and remove the first empty element
    vCardBlocks.forEach(block => {
        const contact = {};
        const lines = block.split("\n").map(line => line.trim());
        lines.forEach(line => {
            contact.user_id = data.user.user_id;
            if (line.startsWith("FN:")) {
                contact.username = line.substring(3); // Extract the name
            } else if (line.startsWith("EMAIL:")) {
                contact.email = line.substring(6); // Extract the email
            } else if (line.startsWith("TEL:")) {
                contact.phone = line.substring(4); // Extract the phone number
            }
        });
        if (Object.keys(contact).length > 0) {
            contacts.push(contact);
            
        }
    });
    return contacts;
}



