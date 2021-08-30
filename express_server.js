const express = require("express");
const app = express();

//middleware
const bodyParser = require('body-parser')

// default port 8080
const PORT = 8080; 

//Use EJS as its templating engine
app.set("view engine", "ejs");

// example of users' url database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//CREATE random string for shortURL
const generateRandomString = function() {
  let randomString = '';

  //Generate string based off these alphanumeric characters
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  //Generate a new ID if ID is already used
  if (findUserByID(randomString)) {
    generateRandomString();
  }

  return randomString;
};
app.get("/", (req, res) => {
  res.send("Hello!");
});

 // displays "Hello World" message
 app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

// app.use(bodyParser())
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//// to display urls index page
 app.get("/urls", (req, res) => { 
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Log the POST request body to the console
// Respond with 'Ok' (we will replace this)
app.post("/urls", (req, res) => {
  console.log(req.body);  
  res.send("Ok");        
});

//JSON string representing the entire urlDatabase object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Redirects to the responding long URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: req.params.longURL
  };
  res.render("urls_show", templateVars);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});

