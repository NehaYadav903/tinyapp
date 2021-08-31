const express = require("express");
const app = express();

//middleware
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}));

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

function generateRandomString() {
  let chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 6; i ++) {
    result += chars.charAt(Math.floor(Math.random() * 36));
  }
  return result;
}

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

// to redirect to long URL
app.get('/u/:id', (req, res) => {
  const longUrl = urlDatabase[req.params.id].longURL;
  res.redirect(longUrl);
});

// to redirect to long URL
app.get("/u/:shortURL", (req, res) => {
  const longUrl = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

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

// deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  let short = req.params.shortURL;
  
  delete urlDatabase[short];
  res.redirect("/urls");
});

// Redirects to the responding long URL
app.get("/urls/:shortURL", (req, res) => {
  let userId = req.session.userId;
  const shortURL = req.params.shortURL;

  const templateVars = {
    shortURL: shortURL,
    longURL: urlDatabase[shortURL].longURL,
    user: users[userId],
    error: users[userId] ? null : "Please Login or Register first" };
  if (userId) {
    res.render("urls_show", templateVars);
  } else {
    res.redirect("/urls");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});

