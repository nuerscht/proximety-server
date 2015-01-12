"use strict";

/**
 * @author Andy Villiger
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('index', { title: 'Proximety' });
});

module.exports = router;
