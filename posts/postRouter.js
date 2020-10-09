const express = require('express');
const db = require('./postDb')
const router = express.Router();

// router.get('/posts', (req, res, next) => {
//   db.get()
//     .then(post=> res.status(200).json(post))
//     .catch(next(error))
// });

router.get('/', (req, res, next) => {
  db.get().then(posts=>{
    res.status(200).json(posts);
  }).catch(err=>{
    next(err);
  })
});

router.get('/:id', validatePostId, (req, res) => {
  const id = req.params.id;
  db.getById(id)
    .then (post => res.status(200).json(post))
    .catch(next(error))
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  const {id: postId} = req.params;
  db.getById(postId)
    .then(post => {
      if(!post) return res.status(404).json({message: "No post found."});
      req.post = post;
      next();
    })
    .catch(error=> next(error))
}

module.exports = router;
