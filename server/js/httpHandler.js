const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messages = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {

  if (req.method === 'GET') {
    res.writeHead(200, headers);
    // res.data = this.randomCommand();
    res.data = messages.dequeue();
    // console.log(res.data);
    res.end(res.data);
  }

  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  res.end();
  next(); // invoke next() at the end of a request to help with testing!
};

////////////////////////////////////////////////////////
// random swim command function (not sure if this is the best placement for this function).
module.exports.randomCommand = () => {
  var randomIndex = Math.floor(Math.random() * 3);
  var commandArray = ['left', 'right', 'up', 'down'];
  return commandArray[randomIndex];
};
