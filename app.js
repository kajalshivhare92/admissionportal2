const express = require('express')
const connectDB = require('./db/connect_db')
const fileUpload = require("express-fileupload");
const app = express()
const port = 3000
const web =require('./routes/web')
var session = require('express-session')
var flash = require('connect-flash');
const cookieParser = require('cookie-parser')


// Temp file Uploader
app.use(fileUpload({useTempFiles: true}));

// this is used for show message
app.use(session({
  secret: 'secret',
  cookie: { maxAge: 60000 },
  resave: false,
  saveUninitialized: false,
  
}));

app.use(flash());
//cookies 
app.use(cookieParser())




app.use(express.urlencoded({extended: false  }));
// route localhost: 3000
//app.use(express.json())

app.use('/',web)

// connectdb
connectDB()

// set engine
app.set('view engine', 'ejs')

// static files
app.use(express.static('public'))









// server create
app.listen(port, () => {
    console.log('server start localhost:3000')
  })
