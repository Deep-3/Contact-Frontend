# Contact Management System

A web application that allows users to manage their contacts. This system enables users to create, read, update, delete, search, group, import, export, and merge contacts. The application is secured with a login system, ensuring data privacy and user authentication.

## Features

- **CRUD Operations:** Users can add, view, edit, and delete contacts.
- **Contact Import/Export:** Import contacts from VCF (vCard) files and export them to VCF files.
- **Contact Merging:** Detect and merge duplicate contacts based on name, phone number, or email address.
- **User Authentication:** The application requires users to log in before accessing the contact management features.
- **Search :** Users can search for contacts by name, email, or other criteria and organize contacts using tags.


## Tech Stack

- **Frontend:**
  - HTML5, CSS3, JavaScript
  
- **Backend:**
  - Node.js with Express.js
  - MongoDB 
  
- **Authentication:**
  - JSON Web Tokens (JWT)
  
- **File Handling:**
  - VCF/vCard parsing libraries for import/export

## Setup Instructions

1. Clone the repository:
   git clone https://github.com/yourusername/contact-management-system.git
   cd contact-management-system
   npm run dev
