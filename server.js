const  express = require('express');
const  env = require('dotenv').config()
const  ejs = require('ejs');
const  path = require('path');
const  app = express();
const  bodyParser = require('body-parser');
const  mongoose = require('mongoose');
const  session = require('express-session');
const  MongoStore = require('connect-mongo')(session);
// const DB = "mongodb+srv://Mindbrick:password@mindbrick.zdiyp2p.mongodb.net/employe/?retryWrites=true&w=majority"
const DB="mongodb://localhost:27017/swapnil"
// const db= "mongodb+srv://<DB_USER_NAME>:<DB_PASSWORD>@cluster0-vatbg.mongodb.net/registrationFormHeruko?retryWrites=true&w=majority"
// const DB= "mongodb+srv://Mindbrick:Password@mindbrick.zdiyp2p.mongodb.net/swapnil?retryWrites=true&w=majority"

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

const  db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
    ttl: 14 * 24 * 60 * 60,
    autoRemove: 'native'
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');
require('./routes/admin')(app)
require('./routes/index')(app)


// const  index = require('./routes/index');
//     //require file for user
// app.use('/', index); // used user routes 
// const  admin = require('./routes/admin'); 
// app.use('/admin', admin); // used admin routes

// const  routes= require('./routes');

// app.use ('route',routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const  err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


const PORT = process.env.PORT || 3000;
// const baseurl = "https://mindbrick.herokuapp.com/"
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});
