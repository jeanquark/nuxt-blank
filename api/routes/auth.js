const express = require('express');
const {
  register,
  loginUser,
  loginUserOAuth,
  loginResume,
  logoutUser,
  logoutResume,
  // authUser,
  getMe,
  getAuthUser,
  getAuthResume,
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
// router.get('/auth-user', authUser);
// router.get('/me', authUser, getMe);
// router.get('/me', getMe);
// router.get(authUser, '/user', getAuthUser);
router
    .route('/user')
    .get(authUser, getAuthUser);
// router.get(authResume, '/resume', getAuthResume);

// router.put('/updatedetails', authUser, updateDetails);
router.put('/update-password', authUser, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// router.put('/update-user', updateUser);

router.route('/user-update')
    .put(authUser, updateUser);

// Test route for refresh token. This needs to be precised.
router.post('/refreshtoken', refreshToken);

module.exports = router;
