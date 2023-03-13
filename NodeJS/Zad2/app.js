const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express()
const port = 3000
const dataPath = './data.json'

const errorHandler = function (err, req, res, next){
    console.error(err)
    res.status(res.statusCode).send(err.message);
  }

  app.use(cors());

  app.get('/users/:userID', (req, res, next) => {
    fs.readFile(dataPath, (err, data) => {
      if (err) {
         next(err);
      }
          const dataJson = JSON.parse(data);
          let user = dataJson.users.find(x => x.id == req.params.userID);
          if(!user)
          {
              res.statusCode = 404;
              next(new Error("User not found."));
          }
          res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
          res.send(user);
          
      });
  
  });
  
  app.get('/users', (req, res, next) => {
    fs.readFile(dataPath, (err, data) => {
      if (err) {
         next(err);
      }
          const dataJson = JSON.parse(data);
          let users = dataJson.users;
          res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
          res.send(users);
          
      });
  
  });


app.get('/posts/date', (req, res, next) => {
  fs.readFile(dataPath, (err, data) => {
    if (err) {
       next(err);
    }
        const dataJson = JSON.parse(data);
        let start = new Date(req.query.DatumOd);
        if(isNaN(start))
        {
          res.statusCode = 400;
          next(new Error("Start date not valid"))
        }
        let end = new Date(req.query.DatumDo);
        if(isNaN(end))
        {
          res.statusCode = 400;
          next(new Error("End date not valid"))
        }
        let posts = dataJson.posts.filter(p => {
          let pDate = new Date(p.last_update);
          if(isNaN(pDate))
          {
            res.statusCode = 400;
            next(new Error("Post date not valid"))
          }
          return pDate.getTime() >= start.getTime() && pDate.getTime() <= end.getTime();
        })
        res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
        res.send(posts);
        
    });
  });

app.get('/posts/:postID', (req, res, next) => {
    fs.readFile(dataPath, (err, data) => {
      if (err) {
         next(err);
      }
          const dataJson = JSON.parse(data);
          let post = dataJson.posts.filter(x => x.user_id == req.params.postID);
          if(!post)
          {
              res.statusCode = 404;
              next(new Error("Posts not found."));
          }
          else
          {
            res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.send(post);
          }
          
      });
  
  });

  app.post("/users",(req,res,next) =>{

    fs.readFile(dataPath, (err, data) => {
      if (err) {
         next(err);
      }
          const dataJson = JSON.parse(data);
          let userIndex = dataJson.users.findIndex(x => x.id == req.query.userID);
          if(userIndex == -1)
          {
            res.statusCode = 404;
            next(new Error("User not found."))
          }
          else
          {
            dataJson.users[userIndex].name = req.query.name;
            dataJson.users[userIndex].email = req.query.email;
            fs.writeFile(dataPath,JSON.stringify(dataJson),(err) => {
              if(err)
              {
                next(err);
              }
            });
            res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.send(dataJson.users[userIndex]);
          }
      });

  });

  app.put("/posts",(req,res,next) => {
    fs.readFile(dataPath, (err, data) => {
      if (err) {
         next(err);
      }
          const dataJson = JSON.parse(data);
          let id = dataJson.posts[dataJson.posts.length -1].id + 1;
          let currentDate = new Date().toJSON();
          let currentDateString = currentDate.split("T")[0];
          let currentTimeString = currentDate.split("T")[1].slice(0,-5);
          let newPost = 
          {
            "id":id,
            "title":req.query.title,
            "body":req.query.body,
            "user_id":req.query.userID,
            "last_update":currentDateString + " " + currentTimeString
          };
          dataJson.posts.push(newPost);
          fs.writeFile(dataPath,JSON.stringify(dataJson),(err) => {
            if(err)
            {
              next(err);
            }
          });
          res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
            res.send(newPost);
      });

  });

app.put("/users",(req,res,next) => {
    fs.readFile(dataPath, (err, data) => {
      if (err) {
         next(err);
      }
          const dataJson = JSON.parse(data);
          let id = dataJson.posts[dataJson.users.length -1].id + 1;
          let newUser = 
          {
            "id":id,
            "name":req.query.name,
            "email":req.query.email
          };
          dataJson.users.push(newUser);
          fs.writeFile(dataPath,JSON.stringify(dataJson),(err) => {
            if(err)
            {
              next(err);
            }
          });
          res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
          res.send(newUser);
      });

  });


app.use(errorHandler);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});