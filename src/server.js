const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/keeper", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const Document = require("./models/Document");
app.set(`view engine`, `ejs`);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const code = `Welcome to keeper!

Use the commands in the top right corner 
to create a new file to share with others`;
  res.render(`code-deploy`, { code, language: "plaintext" });
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (e) {
    res.render("new", { value });
  }
});

app.get(`/:id/duplicate`, async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("new", { value: document.value });
  } catch (e) {
    res.redirect(`/${id}`);
  }
});

app.get(`/:id`, async (req, res) => {
  const id = req.params.id;

  try {
    const document = await Document.findById(id);

    res.render("code-deploy", { code: document.value, id });
  } catch (e) {
    res.redirect("/");
  }
});

const port = 3000;
app.listen(port, (req, res) => {
  console.log(`SERVER CONNECTED AND RUNNING ON PORT ${port}`);
});
