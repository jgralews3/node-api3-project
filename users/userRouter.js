const express = require('express');
const db = require('./userDb')
const {insert: insertPost} = require("../posts/postDb")
const router = express.Router();

router.post('/', validateUser, (req, res, next) => {
  db.insert(req.body)
    .then(user => res.status(201).json(user))
    .catch(error => {next(error)})
});

router.post('/:id/posts', [validateUser, validatePost], (req, res, next) => {
  const post = {...req.body, user_id: req.user.id}
  db.insertPost(post)
    .then(newPost => res.status(201).json(newPost))
    .catch(error => {next(error)})
});

router.get('/', (req, res, next) => {
    db.get()
      .then (users=> res.status(200).json(users))
      .catch ((error) => {next(error)})
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id
    db.getById(id)
      .then (user=> res.status(200).json(user))
      .catch (error => {next(error)})
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  const id = req.params.id
  db.getUserPosts(id)
    .then (user=> res.status(200).json(user))
    .catch (error => {next(error)})
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(user=> res.status(200).json({message: "User removed"}))
    .catch(error => {next(error)})
});

router.put('/:id', [validateUserId, validateUser], (req, res) => {
  const id = req.params.id;
  db.update(id, req.body)
    .then(user=> res.status(200).json(user))
    .catch(error => {next(error)})
});

//custom middleware

function validateUserId(req, res, next) {
  const userId = req.params.id;
  db.getById(userId)
    .then(user => {
      if(!user) return res.status(404).json({message: "User not found."});
      req.user = user;
      next();
    })
    .catch(error => next(error))
}

function validateUser(req, res, next) {
  if (!req.body.name) return res.status(400).json({message: "Please include a name."});
  next();
}

function validatePost(req, res, next) {
  if (!req.body.text) return res.status(400).json({message: "Please include text."})
}

module.exports = router;
