"use strict";

/**
 * @author avi
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Proximety' });
});

module.exports = router;
