// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const mongodb = require("mongodb")
const mongoose = require("mongoose");
const Schema = mongoose.Schema
const cors = require('cors');
const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("DB Connected!"))
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
  });


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.urlencoded())
app.use(cors());




// date default handled in /add route
const ExerciseSchema = new Schema({
  description: { type: String, required:true},
  duration: { type: Number, required: false},
  date: { type: String, required: true}
})
const Exercise = mongoose.model("Exercise",ExerciseSchema)



const UserSchema = new Schema({
  username: { type:String, required:true},
  exercises: [ExerciseSchema]
})
const User = mongoose.model("User",UserSchema)
User.createIndexes({unique:true})



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});



app.post("/api/exercise/new-user", (req, res) => {
  console.log('@ post /new-user',req.body)
  const newUser = new User({
    username: req.body.username
  })
  newUser.save((err,user)=> {
    if(err) return res.send({success:false, message:'Username already exists'})
    console.log('@ post /new-user output:',{username: user.username, _id: user._id})
    res.status(200).send({username: user.username, _id: user._id})
  })
});




app.get("/api/exercise/users", (req, res) => {
  User.find({}, (err,data) => {
    if(err) return res.json(err)
    const users = data.map(user => {
      return {username: user.username, _id: user._id}
    })
    console.log('@ Get /users output:', users)
    res.send(users)
  })
});



app.get("/api/exercise/log", (req, res) => {
  console.log('@ /log request:', req.query)
  const userId = req.query.userId
  let from = req.query.from
  let to = req.query.to
  const limit = req.query.limit
  
  User.find({_id: userId}, (err,user)=>{
    
    let exercises = user[0].exercises
    
    if(from && to) {
      from = new Date(from)
      to = new Date(to)
      exercises = exercises.filter(a=>{
        const tempDate = new Date(a.date)
        return tempDate >= from && tempDate <= to
     })
    } else if ( from && !to) {
      from = new Date(from)
      exercises = exercises.filter(a=>{
        const tempDate = new Date(a.date)
        return tempDate >= from
        })
    } else if(!from && to) {
      to = new Date(to)
      exercises = exercises.filter(a=>{
        const tempDate = new Date(a.date)
        return tempDate <= to
     })
    } 
    
    if(limit) {
      exercises = exercises.slice(0,limit)
    } 
    console.log('@ Log output: ',{user: user, workouts: exercises, count: exercises.length})
    return res.send({username: user.username, log: exercises, count: exercises.length})
    
  })
});




app.post("/api/exercise/add", (req, res) => {
  console.log("@ Add/ post:",req.body)
  User.findOne({username: req.body.username}, (err,data)=>{
    if(!data){
      return res.json({error:'User not found'})
    }
    const update = {
      description : req.body.description,
      duration : Number.parseInt(req.body.duration),
      date : req.body.date ? new Date(req.body.date).toDateString() : Date.now()
    }
    data.exercises.push(update)
    data.save((err,data)=>{
      if(err) return res.json(err)
      update.username = data.username
      update._id = `${data._id}`
      const output = update
      console.log('@ /Add output:', output)
      return res.send(output)
    })
  })
});





const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
  
  
  
});
