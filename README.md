# igda-qr
> Project repository for a web-based QR-Code reader for event check-ins. The repository includes both backend and frontend for the web application, with the backend running on Node.js and utilizing the GraphQL API with MongoDB for the database of choice.  

## Table of Contents 
 * [Getting Started](#getting-started)  
   * [Prerequisites](#prerequisites)
   * [Installing](#installing)
 * [Build & run](#build-&-run)
 * [Features](#features)
 * [GraphQL](#graphql)  
   * [Queries](#queries)
   * [Mutations](#mutations)
 
 ## Getting Started  
 ### Prerequisites
 This web application was designed to run on mobile devices, and/or an electronic device with a camera or a webcam.
 - Node.js
 >https://nodejs.org/en/  
 - MongoDB
 >https://www.mongodb.com/download-center/community?jmp=docs  
 - A cloud service or a personal server to deploy to.
 
 ### Installing  
 Clone the repository to your local machine.  
 `git clone https://github.com/geonhuiy/igda-qr.git`  
 Navigate to the project root directory on a CLI and run `npm i` to install the necessary Node.js packages.  
 In the project folder, create a file named `.env` which will contain the environment variables used in the project. The content      of the `.env` file is as follows:  
 ```
 HTTP_PORT=port number here  
 HTTPS_PORT=port number here  
 DB_URL=url to MongoDB database here
 ```  
 
 ## Build & Run  
 The default entry file for the backend server is `server.js`.  
 The server can be started with `node server.js`.  
 HTTPS is required for the backend server environment for the camera to run.  
 For HTTPS, ssl keys and certificate is required and can be generated for local use at https://www.openssl.org/.  
 When deploying online, ensure that the service uses SSL provided by the service of choice.  
 
 ## Features  
 #### Login  
 <img src="https://github.com/geonhuiy/igda-qr/blob/master/screenshots/login.jpg" width="40%" height="70%">
 #### Sign up
 <img src="https://github.com/geonhuiy/igda-qr/blob/master/screenshots/signup.jpg" width="40%" height="70%">
 #### View Events
 <img src="https://github.com/geonhuiy/igda-qr/blob/master/screenshots/events.jpg" width="40%" height="70%">
 #### Check In
 <img src="https://github.com/geonhuiy/igda-qr/blob/master/screenshots/checkin.jpg" width="40%" height="70%">
 
 ## GraphQL  
 The default GraphQL endpoint is located at `url:/graphql`.  
 ### Queries  
 #### allMembers
 >Gets a list of all the members in the database.  
 ```
 allMembers{
  firstname,
  lastname,
  email,
  organization
 }
 ```  
 #### memberById(id)
 >Gets a specific member based on the member id.
 ```
 memberById(args){
  firstname,
  lastname,
  email,
  organization
 }
 ```
 #### allEvents
 >Gets a list of all events in the database.   
 ```
 allEvents{
  name,
  time,
  location,
  attendees {
    ...
  }
 }
 ```  
 #### event(id)
 >Gets a single event by id.
 ```
 event(args) {
  name,
  time,
  location,
  attendees {
    ...
  }
 }
 ```
 #### login(username, password)
 >Logs the user in by the given credentials and returns a token.  
 ```
 login(args) {
  ...,
  token
 }
 ```  
 
 ### Mutations  
 #### registerMember(password, email, firstname, lastname, organization)  
 >Registers a new user.  
 ```
 registerMember(args) {
  ...
 }
 ```  
 #### addEvent(location, date, name)
 >Adds a new event.
 ```
 addEvent(args) {
  ...
 }
 ```  
 #### attendeeCheckIn(attendeeId, eventId)
 >Checks a user into an event.  
 ```
 attendeeCheckIn(args) {
  ...,
  attendees {
    ...
  }
 }
 ```
 
 
  
 
"# hunter-qr" 
