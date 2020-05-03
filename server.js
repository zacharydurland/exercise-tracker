// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const mongodb = require("mongodb")
const mongoose = require("mongoose");
const Schema = mongoose.Schema
const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); 


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.urlencoded())



const WorkoutSchema = new Schema({
  description: {type:String, required:true},
  duration: {type:String, required: false},
  date: {type:String, required: true}
})
const Workout = mongoose.model("Workout",WorkoutSchema)



const UserSchema = new Schema({
  userId: { type:String, required:true },
  workouts: [WorkoutSchema]
})
const User = mongoose.model("User",UserSchema)




const createUser = (userName, res) => {
  const newUser = new User({
    userId: userName
  })
  newUser.save((err,data)=> {
    if(err) return res.json({error: err})
    return res.json({data: data})
  })
}



app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});




app.post("/api/exercise/new-user", (req, res) => {
  const userId = req.body.userId
  createUser(userId, res)
});




app.get("/api/exercise/users", (req, res) => {
  User.find({}, (err,data) => {
    if(err) return res.json(err)
    res.json(data)
  })
});


//NEXT: validate date or return today's date


app.post("/api/exercise/add", (req, res) => {
  User.findOne({userId: req.body.userId}, (err,data)=>{
    if(err) return res.json(err)
    console.log(req.body)
    const update = {
      description : req.body.description,
      duration : req.body.duration,
      date : req.body.date
    }
    data.workouts.push(update)
    data.save(err=>{
      console.log(err)
    })
  })
});





const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
