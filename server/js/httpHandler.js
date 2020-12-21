const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');
const messages = require('./messageQueue');
// const url = require('url');

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
      fs.readFile(module.exports.backgroundImageFile, (err, data) => {
        if (err) {
          res.writeHead(404, headers);
        } else {
          res.writeHead(200, headers);
          res.write(data, 'binary');
        }
        res.end();
        next();
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
    let file = Buffer.alloc(0);

    req.on('data', (chunk) => {
      file = Buffer.concat([file, chunk]);
    });

    req.on('end', () => {
      var multipartFile = multipart.getFile(file);
      fs.writeFile(module.exports.backgroundImageFile, multipartFile.data, (err) => {
        if (err) {
          res.writeHead(400, headers);
          res.end();
          // next();
        } else {
          res.writeHead(201, headers)
          res.end(file);
        }
        next();
      });
    })
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
