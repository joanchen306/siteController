var express = require('express');
var router = express.Router();

var io = require('socket.io');
var http = require('http');
var data = {};
var domain = '';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Site Controller' });
});

/* POST home page */
router.post('/', function(req, res, next) {
  domain = req.body.path
  var path = req.body.path + '/site-controller';
  console.log("SUBMITTED PATH: " + path);
  var options = {
    host: req.body.host,
    port: req.body.port,
    path: path,
    method: 'GET',
    headers: {
      Host: req.body.host
    }
  };

  http.get(options, function(res) {
    //res.socket.setTimeout(1000);
    res.on('data', function(obj) {
      data = JSON.parse(obj);
      console.log('Name: ' + data.name);
      console.log('Controls: ' + data.controls);
    });
  });


});

router.get('/controls', function(req, res, next) {
  //maybe write the html here?
  var control_html = "<p>"
  for(i = 0; i < data.controls.length; i++) {
    if(data.controls[i].type == 'input') {
      control_html = control_html + writeInputH(data.controls[i].name);
    } else if (data.controls[i].type == 'button') {
      control_html = control_html + writeButH(data.controls[i].name);
    } else if (data.controls[i].type == 'form') {
      control_html = control_html + writeFormH(data.controls[i].name);
    }
    control_html = control_html + '</p> <p>';
  }
  res.send({name : data.name, html : control_html});

  //connect to site's socket io
  getIo2();

});

function writeInputH(name) {
  return name + ": <input type='text'> </input>";
}

function writeButH(name) {
  return "<button>" + name + "</button>";
}

function writeFormH(name) {
  var retH = "<form >"
}

function getIo2() {
  var socket2 = require('socket.io-client')('http://localhost:3000');
}

module.exports = router;
