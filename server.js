/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Bregwin Jogi Student ID: 156619215 Date: 02/15/2023
*
*  Online (Cyclic) Link: https://expensive-slacks-tuna.cyclic.app/
*
********************************************************************************/ 



var express = require("express");
var path = require("path");
var message = require("./blog-service.js");
var app = express();

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: 'dboxvu6wx',
  api_key: '249777555357466',
  api_secret: 'XdhCffSLzUGG-lqdgfqSMAHKVEQ',
  secure: true
});

const upload = multer(); // no { storage: storage } since we are not using disk storage

app.use(express.static(__dirname + '/public'));

const blog_service = require('./blog-service');



var HTTP_PORT = process.env.PORT || 8080;



// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}



// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function(req,res){
    res.redirect('/about')
});

//•	Add the following route: POST /posts/add
app.post('/posts/add', function (req, res) {
  upload.single("featureImage")
  let streamUpload = (req) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            (error, result) => {
            if (result) {
                resolve(result);
            } else {
                reject(error);
            }
            }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
};

async function upload(req) {
    let result = await streamUpload(req);
    console.log(result);
    return result;
}

upload(req).then((uploaded)=>{
    req.body.featureImage = uploaded.url;
    addPost(req.body)
    res.redirect('/posts')

});

})

// setup another route to listen on /about
app.get("/about", function(req,res){
    res.sendFile(path.join(__dirname,"/views/about.html"));
  });

  app.get("/posts/add", function(req,res){
    res.sendFile(path.join(__dirname,"/views/addPost.html"));
  });


app.get("/blog", function(req,res){
    blog_service.getPublishedPosts()
    .then(function(publishedPostsList){
      res.json(publishedPostsList)
    })
    .catch(function(err){
      res.json({ message: err });
  });
});

app.get("/posts", function(req,res){

  if(req.query.category)
    {
        blog_service.getPostsByCategory(req.query.category).then((filteredPosts) => {
          res.json(filteredPosts);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }  

    else if(req.query.minDate)
    {
       
        
        blog_service.getPostsByMinDate(req.query.minDate).then((filteredPosts) => {
          res.json(filteredPosts);
        })
        .catch((err) => {
          res.json({ message: err });
        });
    }  
    else{
      blog_service.getAllPosts()

      .then((postsList) => {
        res.json(postsList);
      })
      .catch((err) => {
        res.json({ message: err });
      });
    }
  
});

app.get("/post/:id", (req, res) => {
  var id = req.params["id"];
  
  blog_service.getPostById(id)
  .then((filteredPost) => {
    res.json(filteredPost);
  })
  .catch((err) => {
    res.json({ message: err });
  });

});

app.get("/categories", function(req,res){
    blog_service.getCategories()
    .then((categoriesList) => {
      res.json(categoriesList);
    })
    .catch((err) => {
      res.json({ message: err });
    });
});

app.all("*", (req, res) => {
    res.status(404).send("Page Not Found &#128517");
  });

// setup http server to listen on HTTP_PORT


blog_service.initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch((err) => {
    console.error('Error: Unable to intialize blog-service', err);
  });
