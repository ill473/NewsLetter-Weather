const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");
const mailchimp = require('@mailchimp/mailchimp_marketing');

//dot env functionality
require('dotenv').config();

console.log(process.env);
const app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const port = process.env.port;




//Place your own server id
app.get('/', (req, res) => {
  //Check status of MailChimp communication to server. DO NOT DELETE
  mailchimp.setConfig({
    apiKey: process.env.API_KEY,
    server: process.env.API_KEY_S,
  });

  async function callPing() {
    const response = await mailchimp.ping.get();
    console.log(response);
  }
  callPing();


  res.sendFile(__dirname + "/public/signup.html");
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/public/success.html');
});

app.get('/failure', (req, res) => {
  res.sendFile(__dirname + '/public/failure.html');
});

app.post('/', (req, res) => {
  console.log(req.body.email);

  const Fname = req.body.FirstName;
  const Lname = req.body.LastName;
  const email = req.body.email;

   //Creating an object with the users data
   const subscribingUser = {
    firstName: Fname,
    lastName: Lname,
    email: email
   };

 

  //Setting up configuration for Mail Chimp
  const listID = process.env.API_LISTID;
  
   //Uploading the data to the server
   async function run() {
    const response = await mailchimp.lists.addListMember(listID, {
     email_address: subscribingUser.email,
     status: "subscribed",
     merge_fields: {
     FNAME: subscribingUser.firstName,
     LNAME: subscribingUser.lastName
    }
    });
    //If all goes well logging the contact's id
     res.sendFile(__dirname + "/public/success.html")
     console.log(
    `Successfully added contact as an audience member. The contact's id is ${
     response.id
     }.`
    );
    }
    //Running the function and catching the errors (if any)
    // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LECTURE*************************
    // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
     run().catch(e => res.sendFile(__dirname + "/public/failure.html"));

  


  

});



app.listen(port||3000, () => {
  console.log(`Example app listening on port ${port}`)
})


