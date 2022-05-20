var express = require('express');
var userRouter = require('./user')


function route(app){
  app.use('/users', userRouter);
}

module.exports = route;
