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



router.get('/auth/google',
    Oauth.authenticate('google', {
        scope: ['email', 'profile']
    }));

router.get('/auth/google/callback',
    Oauth.authenticate('google', {
        failureRedirect: '/user/auth/google/failure'
    }),
    userController.authenticateByGoogle
);

router.get('/auth/google/failure', function(req, res) {
    return res.json({
        success: false,
        message: 'Google Login Api Failed!'
    });
});
module.exports = router;