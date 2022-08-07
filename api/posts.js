const express = require('express');
const { token } = require('morgan');
const postsRouter = express.Router();
const { getAllPosts, createPost, updatePost, getPostById } = require('../db');
const { post } = require('./users');
const usersRouter = require('./users');
const { requireUser } = require('./utils');



postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {
    title, content, authorId: req.user.id
  };

  
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const post = await createPost(postData);
   
    if (post.length) {
      res.send({ post });
    } else {
      next(
        "there are no posts to view"
      )
    }

  } catch ({ name, message }) {
    next({ name, message });
  }
});


postsRouter.patch('/:post', requireUser, async (req, res, next) =>{
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {
    title, content, authorId: req.user.id
  };

  
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const post = await createPost(postData);
   
    if (post.length) {
      res.send({ post });
    } else {
      next(
        "there are no posts to view"
      )
    }

  } catch ({ name, message }) {
    next({ name, message });
  }
});


postsRouter.use((req, res, next) => {
    console.log("A request is being made to /posts");
  
    next(); 
  });


postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();
  
    res.send({
      posts
    });
  });

  postsRouter.get('/', async (req, res, next) => {
    try {
       const allPosts = await getAllPosts();
 
       const posts = allPosts.filter((post) => {
          if (post.active) {
             return true;
          }
 
          if (req.user && post.author.id === req.user.id) {
             return true;
          }
 
          return false;
       });
 
       res.send({
          posts,
       });
    } catch ({ name, message }) {
       next({ name, message });
    }
 });

  postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
    try {
      const post = await getPostById(req.params.postId);
  
      if (post && post.author.id === req.user.id) {
        const updatedPost = await updatePost(post.id, { active: false });
  
        res.send({ post: updatedPost });
      } else {
      
        next(post ? { 
          name: "UnauthorizedUserError",
          message: "You cannot delete a post which is not yours"
        } : {
          name: "PostNotFoundError",
          message: "That post does not exist"
        });
      }
  
    } catch ({ name, message }) {
      next({ name, message })
    }
  });




module.exports = postsRouter;