const express = require("express");
const app = express();

//Default port 8080
const PORT = 8080; 

//Middleware
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//Example of users' url database
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca" },
  "9sm5xK": {longURL: "http://www.google.com" }
};

//CREATE random string for shortURL
function generateRandomString() {
  let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 6; i ++) {
    result += chars.charAt(Math.floor(Math.random() * 36));
  }
  return result;
}

//CREATE a new short URL
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

//DELETE a URL from the database
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

//UPDATE a URL, helper function
const updateURL = (id, content) => {
  urlDatabase[id] = content;
};

//POST to UPDATE the url in the Database
app.post("/urls/:id", (req, res) => {
  const urlID = req.params.id;
  const longURL = req.body.longURL;
  
  updateURL(urlID, longURL);
  
  res.redirect(`/urls/${urlID}`);
});

//POST to handle the /login in your Express server
app.post("/login", (req, res) => {
  const username = req.body.username;
  if (username) {
    res.cookie('username', username);
    res.redirect('/urls');
  }
});

//POST to handle /logout
app.post("/logout", (req, res) => {
  //console.log(req.body);
  res.clearCookie("username");
  res.redirect("/urls");
})

//To redirect to long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//New url is created
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

//To display urls index page
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

//Add shortURL and longURL values to the list of URLs on the myURLs page
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

//JSON string representing the entire urlDatabase object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


