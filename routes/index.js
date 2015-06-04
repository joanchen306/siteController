var express = require('express');
var router = express.Router();

var io = require('socket.io')();
var http = require('http');
var data = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Site Controller' });
});

/* POST home page */
router.post('/', function(req, res, next) {
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
    } else {
      control_html = control_html + writeH(data.controls[i].name);
    }
    control_html = control_html + '</p> <p>';
  }
  console.log("html is...");
  console.log(control_html);
  res.send({name : data.name, html : control_html});
});

function writeInputH(name) {
  return name + ": <input type='text'> </input>";
}

function writeH(name) {
  return "<button>" + name + "</button>";
}

module.exports = router;
