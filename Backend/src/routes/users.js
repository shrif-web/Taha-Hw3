var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', controller.register)

module.exports = router;
