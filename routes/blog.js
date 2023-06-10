const express = require('express');
const mongodb=require('mongodb');
const db=require('../data/database');

const ObjectID=mongodb.ObjectId;
const router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/posts');
});

router.get('/posts', function(req, res) {
  res.render('posts-list');
});

router.get('/new-post', async function(req, res) {
  const authors=await db.getDb().collection('authors').find().toArray();
  console.log(authors);
  res.render('create-post',{authors:authors});
});

router.post('/posts',async function(req,res){
  const authorId=new ObjectID(req.body.author);
  const author=await db.getDb.collection('authors').findOne({_id:authorId})
  const newNote={
    title:req.body.title,
    summary:req.body.summary,
    body:req.body.content,
    date:new Date(),
    author:{
      id:authorId,
      name:author.name,
      email:author.email
    }
  };
  const result=await db.getDb().collection('posts').insertOne(newNote);
  res.redirect('/posts');
})

module.exports = router;
