const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');
const { getPostsByTagName } = require('../db')

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next(); 
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

  res.send({
    tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const { tagName } = req.params; 
  // read the tagname from the params
  try {
    const allTags = await getPostsByTagName(tagName);
    const tags = allTags.filter((tag) => {
      if (tag.active) {
        return true;
      }
      if (req.user && post.author.id === req.user.id) {
        return true;
      }

      return false;

    })
    res.send({ posts: tags });
} catch ({ name, message }) {
   next({ name, message });    
  }
});

module.exports = tagsRouter;