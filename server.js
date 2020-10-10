const express = require('express');

const server = express();

function logger(req, res, next) {
  console.log(`Request Method: ${req.method}, Request URL: ${req.url}, Time: ${new Date().toISOString()}`);
  next();
}
server.use(logger);

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

server.use(express.json())
server.use(userRouter);
server.use(postRouter);


server.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({
        message: "Something went wrong, please try again later"
    })
})



server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
