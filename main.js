// Imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const PORT = process.env.PORT || 3000;
const app = express();

// Database connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to the database"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({ secret: "my secret key", saveUninitialized: true, resave: false })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Set Template Engine
app.set("view engine", "ejs");

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
