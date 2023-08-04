const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

var token = config.MY_API_TOKEN;
var key = config.SECRET_API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
  });

app.post("/", function(req, res){

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/8eaec356e0";

  const options = {
    method: "POST",
    auth: token + ":" + key
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(response.statusCode);
      console.log(JSON.parse(data));
    })
  });

request.write(jsonData);
request.end();

  });

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

// List Id
// 8eaec356e0
