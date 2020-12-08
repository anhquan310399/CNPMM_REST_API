var express = require('express');
var router = express.Router();
var { authLogin } = require('../middleware/auth');
const userController = require('../controllers/userController');
/* GET users listing. */
router.get('/', userController.findAll);
router.get('/:id', userController.findUser);
router.post('/', userController.create);
router.post('/login', userController.login);
router.put('/:id', authLogin, userController.update);
router.delete('/:id', authLogin, userController.delete);

router.post('/upload', userController.upload);
module.exports = router;