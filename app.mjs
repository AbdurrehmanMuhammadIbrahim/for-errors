const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
import express from 'express'
// import mongoose from "mongoose"
import cors from "cors"
import path from "path";

import {
  stringToHash,
  varifyHash,
 
} from "bcrypt-inzi"

// const { MongoClient } = require('mongodb');
// const uri = "mongodb+srv://abdurrehman:Disccompact890@cluster0.7d9p9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


// mongoose.connect(`mongodb://abdurrehman:Disccompact890@cluster0-shard-00-00.7d9p9.mongodb.net:27017,cluster0-shard-00-01.7d9p9.mongodb.net:27017,cluster0-shard-00-02.7d9p9.mongodb.net:27017/users?ssl=true&replicaSet=atlas-wpbp4z-shard-0&authSource=admin&retryWrites=true&w=majority`)
//   .then(res => console.log("Connected to DB"))
//   .catch(err => console.log(err));

app.use(cors(["localhost:5000", "localhost:3000"]))
app.use(express.json())

app.get("/", express.static(path.join(__dirname, "website/build")));

// const User = mongoose.model('User',

//   {

//     firstName: String,
//     lastName: String,
//     email: String,
//     password: String

//   });






// app.get("/api/v1/login", (req, res) => {
//   res.send(User)

//   });

app.post('/api/v1/login', (req, res) => {

  if (!req.body.email ||
    !req.body.password
  ) {
    console.log("required field missing");
    res.status(403).send("required field missing");
    return;
  }

  console.log("req.body: ", req.body);


  User.findOne({ email: req.body.email }, (err, user) => {

    if (err) {
      res.status(500).send("error in getting database")
    } else {
      if (user) {

        varifyHash(req.body.passwod,user.password).then(result => {
          if (result) {
            console.log("matched");
        } else {
            console.log("not matched");
        }
    }).catch(e => {
        console.log("error: ", e)
  

       

        }) 
         
  

        
      } else {
        res.send("user not found");
      }
    }

  })
})

app.post("/api/v1/signup", (req, res) => {
  if (!req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password
  ) {

    console.log("required field missing");
    res.status(403).send("required field missing");
    return;
  } else {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (user) {
        res.send("user already exist");
      } else {
        console.log(req.body)
        stringToHash(req.body.password).then(passwordhash => {
          console.log("hash: ", passwordhash);


          let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
          })

          newUser.save(() => {
            console.log("Data Saved in MondoDB")
            res.send('Data Saved in MondoDB')
          })

          // .catch((err)=> {
          //   console.log(err)
          // })
        });

      }
    })
  }

})
//   const Post = mongoose.model('Post', { 

//     name: String,
//  post: String,


//  });

app.post("/api/v1/posts", (req, res) => {
  let newPost = new Post({
    name: req.body.name,
    post: req.body.post,

  })

  newPost.save(() => {
    console.log("Data Saved in MondoDB")
    res.send('Data Saved in MondoDB')
  })
  // .catch((err)=> {
  //   console.log(err)
  // })
});
// app.get("/api/v1/profile", (req, res) => {
//   res.send("Hello HERE IS YOUR PROFILE!");
// });

app.put("/api/v1/profile", (req, res) => {
  res.send("Hello HERE IS YOUR PROFILE!");
});

app.delete("/api/v1/profile", (req, res) => {
  res.send("Hello! PROFILE IS DELETED");
});


app.get("/**", (req, res, next) => {
  res.sendFile(path.join(__dirname, "./website/build/index.html"))
  // res.redirect("/")
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});