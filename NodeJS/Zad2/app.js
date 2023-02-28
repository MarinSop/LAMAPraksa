const fs = require('fs');
const express = require('express')
const app = express()
const port = 3000
const dataPath = './data.json'

const errorHandler = function (err, req, res, next){
    console.error(err)
    res.status(res.statusCode).send(err.message);
  }



app.get('/users/:id', (req, res, next) => {
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

app.get('/posts/date', (req, res, next) => {
  fs.readFile(dataPath, (err, data) => {
    if (err) {
       next(err);
    }
        const dataJson = JSON.parse(data);
        let start = new Date(req.query.start);
        if(isNaN(start))
        {
          res.statusCode = 400;
          next(new Error("Start date not valid"))
        }
        let end = new Date(req.query.end);
        if(isNaN(end))
        {
          res.statusCode = 400;
          next("End date not valid")
        }
        let posts = dataJson.posts.filter(p => {
          let pDate = new Date(p.last_update);
          if(isNaN(pDate))
          {
            res.statusCode = 400;
            next("Post date not valid")
          }
          return pDate.getTime() >= start.getTime() && pDate.getTime() <= end.getTime();
        })
        res.send(posts);
        
    });
  });

app.get('/posts/:id', (req, res, next) => {
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