let posts = [];
let categories = [];


var fs = require("fs");
const { fileURLToPath } = require("url");


function initialize () {
    return new Promise((resolve, reject) => {
        fs.readFile("./data/posts.json", "utf8", (err, data) => {
          if (err) {
            reject("Unable to read posts.json file");
          }
    
          posts = JSON.parse(data);
          resolve();
    
        
        })
    }).then((result) => {
        return new Promise((resolve, reject) => {
            fs.readFile("./data/categories.json", "utf8", (err, data) => {
              if (err) {
                reject("Unable to read categories.json file");
              }
        
              categories = JSON.parse(data);
              resolve();
        
            
            })
        })
    })
    
}


function getAllPosts(){
    return new Promise(function(resolve,reject){
        if(posts.length > 0)
        {
            resolve(posts)
        }
        else
        {
            reject("getAllPosts - No results returned")
        } 
    });
}

function getPublishedPosts(){
    return new Promise(function(resolve,reject){
        if(posts.length > 0)
        {
            const publishedPosts = posts.filter(isPublished);
            function isPublished(post) {
                 return post.published;
            }  


            if(publishedPosts.length > 0)
            {
                resolve(publishedPosts)
            }
            else{
                reject("getPublishedPosts - No results returned")
            }
        }
        else
        {
            reject("getPublishedPosts - No results returned")
        } 
    });
}

function getCategories(){
    return new Promise(function(resolve,reject){
        if(categories.length > 0)
        {
            resolve(categories)
        }
        else
        {
            reject("getCategories - No results returned")
        } 
    });
}

function addPost(postData){
    return new Promise(function(resolve,reject){
        if( typeof postData.published == 'undefined'){ 
            postData.published = false;
        }
        else{
            postData.published = true;
        }

        postData.id = posts.length +1

        posts.push(postData)
        resolve(postData);
    });
    
}

getPostsByCategory = (category) =>{
    return new Promise(function(resolve,reject){
        var filterPosts = posts.filter(checkCategory);
        function checkCategory(post) {
            return post.category == category;
        }

        if(filterPosts.length>0){
            resolve(filterPosts)
        }
        else{
            reject("No results returned for category:" + category);
        }
    }); 
    
}

getPostsByMinDate = (minDateStr) =>{

    return new Promise(function(resolve,reject){
        var filterPosts = posts.filter(checkMinDate)

        function checkMinDate(post) {
                return new Date(post.postDate) >= new Date(minDateStr);
        }

        if(filterPosts.length>0){
            resolve(filterPosts)
        }
        else{
            reject("No results returned for minDateStr:" + minDateStr);
        }
        
    }); 
    
    
}

getPostById = (id) =>{
    return new Promise(function(resolve,reject){
        var foundPost = false;
        var filteredPost;
        
        for(i=0;i<posts.length;i++)
        {
            if(posts[i].id == id)
            {
                filteredPost = posts[i];
                foundPost = true;
            }
        }

        if(foundPost == true){

            resolve(filteredPost)
        }
        else{
            
            reject("No result returned")
        }

    }); 
    
}

module.exports = { posts, categories, initialize, getAllPosts, getPublishedPosts, getCategories, addPost, getPostById, getPostsByMinDate, getPostsByCategory};
