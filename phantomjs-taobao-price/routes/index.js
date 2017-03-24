var express = require('express');
var router = express.Router();
var taobao = require('../api/v1/taobao');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/api/v1/tb', taobao.getInfo);


module.exports = router;
