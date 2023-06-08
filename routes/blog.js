const express=require('express');
const { rawListeners } = require('../data/database');
const db=require('../data/database');
const router=express.Router();

router.get('/',function(req,res){
    res.redirect('/posts');
});

router.get('/posts',async function(req,res){
    const query=`SELECT posts.*,authors.name AS author_name FROM posts INNER JOIN authors ON posts.author_id=authors.id`;
    const [posts]=await db.query(query);
    res.render('posts-list',{ posts:posts });
});

router.post('/posts',async function(req,res){
    const data=[
        req.body.title,
        req.body.summary,
        req.body.content,
        req.body.author
    ]
    await db.query('INSERT INTO posts (title,summary,body,author_id) VALUES (?)',[data]);
    // or below can be used
    //db.query('INSERT INTO posts (title,summary,body,author_id) VALUES (?,?,?,?)',[data[0],data[1],data[2],data[3]]);

    res.redirect('/posts');
});

router.get('/new-post',async function(req,res){
    const [authors]=await db.query('SELECT * FROM authors'); //await returns an array ,and its items are itself an array
    res.render('create-post',{authors:authors});
});

router.get('/posts/:id',async function(req,res){
    const query=`SELECT posts.*,authors.name AS author_name, authors.email AS author_email FROM posts INNER JOIN authors ON posts.author_id= authors.id
    WHERE posts.id=?`;
    const [posts]=await db.query(query,[req.params.id]);
    if(!posts || posts.length===0){
        return res.status(404).render('404');
    }
    const postData={
        ...posts[0],
        date: posts[0].date.toISOString(),
        humanReadableDate: posts[0].date.toLocaleDateString('en-US',{
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };
    res.render('post-detail',{post:postData});
});

router.get('/posts/:id/edit',async function(req,res){
    const query=`SELECT * FROM posts WHERE id=?`;
    const [posts]=await db.query(query,[req.params.id]);
    if(!posts || posts.length===0){
        return res.status(404).render('404');
    }
    res.render('update-post',{post:posts[0]});
});

router.post('/posts/:id/edit',async function(req,res){
    const query=`UPDATE posts SET posts.title=?, posts.summary=?, posts.body=?
    WHERE id=?`;
    const [posts]=await db.query(query,[
        req.body.title,
        req.body.summary,
        req.body.content,
        req.params.id
    ]);
    res.redirect('/posts');
});
router.post('/posts/:id/delete',async function(req,res){
    const query=`DELETE FROM posts WHERE id=?`;
    await db.query(query,[req.params.id]);
    res.redirect('/posts');
});

module.exports=router;