const express = require('express');
const {
  register,
  loginUser,
  loginUserOAuth,
  loginResume,
  logoutUser,
  logoutResume,
  getAuthUser,
  forgotPassword,
  resetPassword,
  updateUser,
  updatePassword,
  refreshToken
} = require('../controllers/auth');

const { authUser } = require('../middleware/auth')


const router = express.Router();

// const { authUser, authResume } = require('../middleware/auth');

router.post('/register', register);
router.post('/login-user', loginUser);
router.post('/login-user-oauth', loginUserOAuth);
router.post('/login-resume', loginResume);
router.get('/logout-user', logoutUser);
router.get('/logout-resume', logoutResume);
router
    .route('/user')
    .get(authUser, getAuthUser);

router.put('/update-password', authUser, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

router.route('/user-update')
    .put(authUser, updateUser);

// Test route for refresh token. This needs to be precised.
router.post('/refreshtoken', refreshToken);

module.exports = router;
