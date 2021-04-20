const express = require("express");
const app = express();
const MongoClient = require('mongodb').MongoClient;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));



var TestSchema = new Schema(
  {
    Speed: String,
    TimeTaken: String
  }
)

var SomeModel = mongoose.model('SomeModel', TestSchema);


var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

//Register View engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({  extended: false}));
app.use(express.json());

import { ENGINE_METHOD_ALL } from "constants";
import {TrafficCompute} from "./public/assets/traffic.js";
import {CalcDistanceToStop} from "./public/assets/traffic.js";


app.get("/", function (req, res) {
  res.render('index');
});

app.post('/traffic', function(req, res){
  console.log(req.body);

  

  
  var  Time2Stop = CalcDistanceToStop(req.body.TL1, req.body.TL2);


var testObject = new SomeModel({Speed: req.body.TL1, TimeTaken:"343"});

testObject.save(function (err) {
  if (err) return console.error(err);
});

 var query =  SomeModel.find({Speed:req.body.TL1}).limit(1);
 console.log("Query Result: "+query[1]);
 console.log("QueryS Result: "+query[1]);
 console.log("TO Result: "+ testObject);
 console.log("TO Result: "+ testObject.Speed);

 //SomeModel.findOne({Speed: req.body.TL1}, function(err,obj) { console.log("FindONE " +obj); });

 var query2 =  SomeModel.findOne({Speed:req.body.TL1});


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
