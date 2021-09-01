const express = require("express");
const app = express();

//middleware
const bodyParser = require('body-parser')

// default port 8080
const PORT = 8080; 

//Use EJS as its templating engine
app.set("view engine", "ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// example of users' url database
const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca" },
  "9sm5xK": {longURL: "http://www.google.com" }
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
// to display urls index page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// to display urls index page
app.get("/urls", (req, res) => { 
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});
// display short URL
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.body.longURL };
  res.render("urls_show", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

// to redirect to long URL
app.get("/u/:shortURL", (req, res) => {
  const longUrl = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

// deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  let short = req.params.shortURL;
  delete urlDatabase[short];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  let short = req.params.shortURL;
  urlDatabase[short].longURL = req.body.longURL;
  res.redirect(`/urls`);
});

// Log the POST request body to the console

app.post("/urls", (req, res) => {
  user_id = req.session["user_id"];
  if (req.session["user_id"]) {
    let short = generateRandomString();
    urlDatabase[short] = {
      longURL: req.body.longURL,
      userID: user_id };
    res.redirect(`/urls/${short}`);
  
  } else { 
    res.redirect("/urls");
  }
});

//JSON string representing the entire urlDatabase object
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
});

