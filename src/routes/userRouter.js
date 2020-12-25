var express = require('express');
var router = express.Router();
const userController = require('../controllers/userController');
var { authLogin, authAdmin } = require('../middleware/auth');
/* GET users listing. */

router.get('/info', authLogin, userController.getInfo);

router.get('/students', authAdmin, userController.findAllStudent);

router.get('/:code', userController.findUser);

router.get('/', authAdmin, userController.findAll);

router.post('/', authAdmin, userController.create);

router.put('/:id', authLogin, userController.update);

router.delete('/:id', authAdmin, userController.delete);

router.post('/authenticate', userController.authenticate);

router.post('/auth/google/', userController.authenticateGoogleToken);

router.post('/auth/facebook/', userController.authenticateFacebookToken);

router.put('/auth/facebook/link', authLogin, userController.linkFacebookAccount);

router.put('/auth/facebook/unlink', authLogin, userController.unlinkFacebookAccount);

module.exports = router;