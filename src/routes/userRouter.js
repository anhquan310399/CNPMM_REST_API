var express = require('express');
var router = express.Router();
var Oauth = require('../middleware/auth');
const userController = require('../controllers/userController');
/* GET users listing. */
router.get('/', userController.findAll);
router.get('/:username', Oauth.authenticate('login-token'), userController.findUser);
router.post('/', userController.create);
router.post('/authenticate', userController.authenticate);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;