const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var Schema = mongoose.Schema;

var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const UserDetail = new Schema(
  {
    username: String,
    password: String
  }
);
UserDetail.plugin(passportLocalMongoose);
const UserDetails = mongoose.model('userInfo', UserDetail, 'userInfo');

passport.use(UserDetails.createStrategy());
passport.serializeUser(UserDetails.serializeUser());
passport.deserializeUser(UserDetails.deserializeUser());

const connectEnsureLogin = require('connect-ensure-login');

app.post('/login', (req, res, next) => {
  passport.authenticate('local',
  (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      console.log("Login Failed: Not user");
      return res.redirect('/login?info=' + info);
      
    }

    req.logIn(user, function(err) {
      if (err) {
        console.log("Login Failed: Error");
        return next(err);
      }
      console.log("Login Succesfull");
      return res.render('index');
    });

  })(req, res, next);
});

//UserDetails.register({username:'bob', active: false}, 'bob');

var TestSchema = new Schema(
  {
    Speed: String,
    Distance: String,
    TimeTaken: String
  }
)

var TrafficModel = mongoose.model('TrafficModel', TestSchema);


var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

//Register View engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({  extended: false}));
app.use(express.json());


import {CalcDistanceToStop} from "./public/assets/traffic.js";
/*
app.get("/login", (req, res) => res.sendFile() {
  res.render('index');
});

app.get("/", function (req, res) {
  connectEnsureLogin.ensureLoggedIn(),
  res.render('index');
});
*/
app.get("/login", function (req, res) {
  res.render('login');
});



app.get('/',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => res.render('index')
);
app.get("/database", function (req, res) {
mongoose.model('TrafficModel').find(function(err, TrafficModel){
res.send(TrafficModel);
  
});


});

  app.get("/cdb", function (req, res) {
    TrafficModel.remove({}, function(err, result) {
      if (err) {
        console.err(err);
      } else {
        res.json(result);
      }
      });
    });
  
app.post('/traffic', function(req, res){
  console.log(req.body);

  

  
var  Time2Stop = CalcDistanceToStop(req.body.TL1, req.body.TL2);


var testObject = new TrafficModel({Speed: req.body.TL1,Distance: req.body.TL2, TimeTaken: Time2Stop});

testObject.save(function (err) {
  if (err) return console.error(err);
});

 var query =  TrafficModel.find({Speed:req.body.TL1}).limit(1);
 console.log("Query Result: "+query[1]);
 console.log("QueryS Result: "+query[1]);
 console.log("TO Result: "+ testObject);
 console.log("TO Result: "+ testObject.Speed);

 //TrafficModel.findOne({Speed: req.body.TL1}, function(err,obj) { console.log("FindONE " +obj); });

 var query2 =  TrafficModel.findOne({Speed:req.body.TL1});


 console.log("Query2 Result: "+ query2);
 console.log("Query2 Speed Result: "+ query2.Speed);
 console.log("Query2 Time Result: "+ query2.TimeTaken);
 
 res.render('index', {Time2Stop});

});

//socket test
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  setInterval(()=>{
    socket.emit('number', parseInt(Math.random()*10));
  }, 1000);

});



http.listen(port,()=>{
  console.log("Listening on port ", port);
});

//this is only needed for Cloud foundry 
require("cf-deployment-tracker-client").track();
