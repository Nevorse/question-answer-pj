const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase");
const routers = require("./routers/index");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");
const cors = require("cors");
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");


// Environment Variables
dotenv.config({
    path: "./config/env/config.env"
});
// MongoDb Connection
connectDatabase();

const app = express();

// CORS
// app.use(cors());

// Cookie Parser
app.use(cookieParser());

// Express Body Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Session
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 1000}
}));

// Flash
app.use(flash());

// Routers Middleware
app.use("/api",routers);
app.get("/",(req, res, next) => {
    res.redirect("/api/questions");
});

// Error Handler
app.use(customErrorHandler);

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// EJS
app.set('view engine',"ejs");
app.use(expressLayouts);

app.listen(process.env.PORT,() => {
    console.log(`App Started on ${process.env.PORT} : ${process.env.NODE_ENV}`);
});
