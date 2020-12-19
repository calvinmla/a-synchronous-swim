const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messages = require('./messageQueue');

// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'spec', 'water-lg.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);

  if (req.method === 'GET') {

    // Have no idea if this is rigtht or not. Just made the url match the updated backgroundImageFile path
    // if (req.url === 'spec/missing.jpg') {
    //   res.writeHead(404, headers);
    //   res.end();
    //   next();
    // }

    // need to use node fs module > get file data > put file data on response (cannot use res.data)
    if (req.url === '/background.jpg') {
      fs.readFile(this.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
          console.log(err);
          res.end();
          next();
        } else {
          res.writeHead(200, headers);
          res.end(data);
          next();
        }
      })
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
};

////////////////////////////////////////////////////////
// random swim command function (not sure if this is the best placement for this function).
module.exports.randomCommand = () => {
  var randomIndex = Math.floor(Math.random() * 3);
  var commandArray = ['left', 'right', 'up', 'down'];
  return commandArray[randomIndex];
};
