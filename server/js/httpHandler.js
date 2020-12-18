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
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'GET') {
    if (req.url === '/background.jpg') {
      console.log('requested background');
      res.writeHead(200, headers);
      res.data = this.backgroundImageFile;
      res.end(res.data);
      next();
    }
    if (req.url === '/') {
      res.writeHead(200, headers);
      res.data = messages.dequeue();
      res.end(res.data);
      next();
    }
  }

  if (req.method === 'POST') {
    next();
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next(); // invoke next() at the end of a request to help with testing!
  }

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(404, headers);
    res.end();
  }

};

////////////////////////////////////////////////////////
// random swim command function (not sure if this is the best placement for this function).
module.exports.randomCommand = () => {
  var randomIndex = Math.floor(Math.random() * 3);
  var commandArray = ['left', 'right', 'up', 'down'];
  return commandArray[randomIndex];
};
