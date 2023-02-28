const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000
const dataPath = './data.json'

const errorHandler = function (err, req, res, next){
    console.error(err)
    res.status(res.statusCode).send(err.message);
  }



app.get('/users/:id', (req, res,next) => {
  fs.readFile(dataPath, (err, data) => {
    if (err) {
       next(err);
    }
        const dataJson = JSON.parse(data);
        let user = dataJson.users.find(x => x.id == req.params.id);
        if(!user)
        {
            res.statusCode = 404;
            next(new Error("User not found."));
        }
        res.send(user);
        
    });

});

app.get('/posts/:id', (req, res,next) => {
    fs.readFile(dataPath, (err, data) => {
      if (err) {
         next(err);
      }
          const dataJson = JSON.parse(data);
          let post = dataJson.posts.find(x => x.id == req.params.id);
          if(!post)
          {
              res.statusCode = 404;
              next(new Error("Post not found."));
          }
          res.send(post);
          
      });
  
  });

app.use(errorHandler);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});