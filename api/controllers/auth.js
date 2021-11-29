const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const sendEmail = require('../utils/sendEmail')
const User = require('../models/User')
const Resume = require('../models/Resume')
const mongoose = require('mongoose')
// const { v4: uuidv4 } = require('uuid')

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
    console.log('[auth controller] @register req.body: ', req.body)
    const { firstname, lastname, email, password, role, oauth } = req.body

    // Create user
    const user = await User.create({
        firstname,
        lastname,
        email,
        password,
        role,
    })

    sendTokenResponseUser(user, 200, res)
})

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
// exports.loginUser2 = asyncHandler(async (req, res, next) => {
//     console.log('[auth controller @loginUser]')
//     const { email, password } = req.body
//     const valid = email.length && password === '123456'
//     const expiresIn = '15d'

//     // Check for user
//     const user = await User.findOne({ email })
//         .populate('resumes')
//         .populate('authorizations')
//         .select('+password')

//     if (!user) {
//         return next(new ErrorResponse('Invalid credentials', 401))
//     }
//     // if (!valid) {
//     //     throw new Error('Invalid username or password')
//     // }

//     // Check if password matches
//     const isMatch = await user.matchPassword(password)

//     if (!isMatch) {
//         return next(new ErrorResponse('Invalid credentials', 401))
//     }

//     if (user.password) {
//         user.password = undefined
//     }
//     const accessToken = jsonwebtoken.sign(
//         {
//             // email,
//             // picture: 'https://github.com/nuxt.png',
//             // name: 'User ' + email,
//             // occupation: 'Web developer',
//             // scope: ['test', 'user']
//             id: user.id,
//             email: user.email
//         },
//         // 'dummy',
//         process.env.JWT_SECRET,
//         {
//             expiresIn
//         }
//     )
//     console.log('accessToken: ', accessToken)

//     res.json({
//         token: {
//             accessToken,
//             user_id: user.id
//         }
//     })
// })





// @desc      Login user
// @route     POST /api/v1/auth/login-user
// @access    Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    console.log('[auth controllers]  @loginUser')
    const { email, password } = req.body

    // 1) Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    // 2) Check for user
    const user = await User.findOne({ email })
        // .populate('resumes')
        .populate('authorizations')
        .populate('package')
        .select('+password')

    if (!user) {
        return next(new ErrorResponse('server.invalid_credentials', 401))
    }

    console.log('user from loginUser: ', user)
    // user.resumes = [
    //     {
    //         id: 1,
    //         name: 'abc'
    //     }
    // ]

    // 3) Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('server.invalid_credentials', 401))
    }

    // 4) Update refresh token
    console.log('process.env.JWT_COOKIE_EXPIRE_USER_REFRESH_TOKEN: ', process.env.JWT_COOKIE_EXPIRE_USER_REFRESH_TOKEN)
    // user.refreshToken = uuidv4()
    user.refreshToken = '123'
    let expiredAt = new Date()
    console.log('expiredAt: ', expiredAt)
    expiredAt.setSeconds(
        // expiredAt.getSeconds() + (process.env.JWT_REFRESH_TOKEN_EXPIRE_USER || 3600 * 24 * 14)
        expiredAt.getSeconds() + process.env.JWT_COOKIE_EXPIRE_USER_REFRESH_TOKEN
    )
    user.refreshTokenExpire = expiredAt.getTime()
    await user.save()

    sendTokenResponseUser(user, 200, res)
})

// @desc      Login resume
// @route     POST /api/v1/auth/login-resume
// @access    Public
exports.loginResume = asyncHandler(async (req, res, next) => {
    console.log('Call to loginResume method in auth controller: ')
    const { slug, password } = req.body

    // Validate email & password
    if (!slug || !password) {
        return next(new ErrorResponse('Please provide a slug and password', 400))
    }

    // Check for resume
    const resume = await Resume.findOne({ slug }).select('+password')
    // console.log('[auth controller] @loginResume resume: ', resume)

    if (!resume) {
        return next(new ErrorResponse('server.invalid_credentials', 401))
    }

    // Check if password matches
    const isMatch = await resume.matchPassword(password)

    if (!isMatch) {
        return next(new ErrorResponse('server.invalid_credentials', 401))
    }

    sendTokenResponseResume(resume, 200, res)
})

exports.loginUserOAuth = asyncHandler(async (req, res, next) => {
    console.log('[auth controller] @loginUserOAuth req.body: ', req.body)
    const { email, name, picture } = req.body
    console.log('email: ', email)
    console.log('name: ', name)

    // Check for user
    // const user = await User.findOne({ email: 'john.doe@example.com' })
    let user = await User.findOne({ email })
        .populate('resumes')
        .populate('authorizations')
        // .populate('package')
        .select('+password')
    console.log('user: ', user)

    if (!user) {
        const split = name.split(' ', 3)
        const firstname = split[0]
        const lastname = split.slice(1).join(' ')
        // Register new user
        // this.register(email, oauth = true)
        user = await User.create({
            email,
            firstname,
            lastname,
            picture,
            // picture: 'abc',
            oauth: true
        })
        console.log('user3: ', user)
        // return next(new ErrorResponse('User not found', 404))
    }

    sendTokenResponseUser(user, 200, res)
})

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logoutUser = asyncHandler(async (req, res, next) => {
    console.log('logoutUser controller')

    res.cookie('token-user', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
})

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logoutResume = asyncHandler(async (req, res, next) => {
    console.log('logoutResume controller')

    res.cookie('token-resume', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        data: {}
    })
})

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.authUser = asyncHandler(async (req, res, next) => {
    console.log('[auth controller] @authUser req.user: ', req.user)
    // const user = await User.findById(req.user.id)
    res.json({ user: req.user })
    // const user = req.user

    // res.status(200).json({
    //     success: true,
    //     data: user
    // })
})

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
// exports.getMe2 = asyncHandler(async (req, res, next) => {
//     console.log('getMe controller req.user: ', req.user)
//     // const user = await User.findById(req.user.id)
//     const user = {}

//     res.status(200).json({
//         success: true,
//         data: user
//     })
// })

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getAuthUser = asyncHandler(async (req, res, next) => {
    // console.log('[auth controller] getAuthUser req.user: ', req.user)
    const user = await User.findById(req.user.id)
        // .populate('resumes')
        // .populate('packages')
        // .populate('authorizations')
        // .populate('resumes')
        .populate('authorizations')
        .populate('package')
    // console.log('[auth controller] getAuthUser user: ', user)
    if (!user) {
        return next(new ErrorResponse(`User not found with id of ${req.user.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.TOBEDELETED_getAuthResume2 = asyncHandler(async (req, res, next) => {
    // console.log('[auth controller] getAuthResume req.resume1: ', req.resume1)
    const resume = await Resume.findById(req.resume1.id)
    // const user = {}

    res.status(200).json({
        success: true,
        data: resume
    })
})

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.TOBEDELETED_updateDetails2 = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user
    })
})

// @desc      Update user details
// @route     PUT /api/v1/auth/update-user
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    // res.status(200).json({
    //     success: true,
    //     data: 'abc',
    //     req: req.body
    // })

    const fieldsToUpdate = {
        // firstname: req.body.fistname,
        firstname: 'john',
        // lastname: req.body.lastname,
        lastname: 'doe',
        user_preferences: {
            darkTheme: req.body.darkTheme
        }
    }

    // const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        data: user,
        fieldsToUpdate,
        req1: req.body,
        req2: req.user
    })
})

// @desc      Update password
// @route     PUT /api/v1/auth/update-password
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    console.log('[auth controller] @updatePassword req.body: ', req.body)
    console.log('[auth controller] @updatePassword req.user: ', req.user)
    const user = await User.findById(req.user.id).select('+password')
    console.log('[auth controller] @updatePassword user: ', user)
    // return next(new ErrorResponse('Password is incorrect', 401))
    console.log('[auth controller] @updatePassword req.body.currentPassword: ', req.body.currentPassword)
    console.log('[auth controller] @updatePassword req.body.newPassword: ', req.body.newPassword)


    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('server.invalid_credentials', 401))
    }

    user.password = req.body.newPassword
    await user.save()

    sendTokenResponse(user, 200, res)
})

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    console.log('[auth controller] @forgotPassword req.body: ', req.body)
    const user = await User.findOne({ email: req.body.email })
    console.log('user: ', user)
    // return next(new ErrorResponse('server.email_could_not_be_sent', 500))

    if (!user) {
        return next(new ErrorResponse('server.user_does_not_exist', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()
    console.log('resetToken: ', resetToken)

    await user.save({ validateBeforeSave: false })

    // Create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
    console.log('resetUrl: ', resetUrl)
    // return next(new ErrorResponse('Forced error', 500))

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            // message,
            content: `<html><head><style>
            .button {
                font: bold 14px Arial;
                font-weight: 500;
                text-transform: uppercase;
                text-decoration: none;
                background-color: #7A528F;
                color: var(--v-primary-base);
                padding: 10px 20px;
                border-radius: 5px;
                border-top: 1px solid #CCCCCC;
                border-right: 1px solid #333333;
                border-bottom: 1px solid #333333;
                border-left: 1px solid #CCCCCC;
            }
            .button:hover {
                cursor: pointer;
            }
            </style></head><body><h2>Hi there!</h2><p>You are receiving this message because a request to reset the password of your account has been triggered.</p>
            <a href="${process.env.BASE_URL}/auth/reset-password/${resetToken}" class="button">Reset password</a><br /><p>This link will expire in 60 minutes. <br />If you are not at the origin of this request, you can safely ignore this message.</p>Best regards,<br />Your LoginMyCV team</p><br /></body></html>`,
            // resetToken
        })

        res.status(200).json({ success: true, data: 'Email sent' })
    } catch (err) {
        console.log(err)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({ validateBeforeSave: false })

        return next(new ErrorResponse('server.email_could_not_be_sent', 500))
    }
})

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    console.log('[auth controller] @resetPassword req.params: ', req.params)
    console.log('[auth controller] @resetPassword req.body: ', req.body)
    // return next(new ErrorResponse('Forced error', 500))
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex')
    console.log('resetPasswordToken: ', resetPasswordToken)

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorResponse('Invalid token', 400))
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    sendTokenResponseUser(user, 200, res)
})

// Essai
// @desc      Refresh token
// @route     POST /api/v1/auth/refreshtoken
// @access    Public
exports.refreshToken = asyncHandler(async (req, res, next) => {
    // console.log('[auth controller] @refreshToken req.body: ', req.body)
    // const userId = req.body.user.id
    // console.log('[auth controller] @refreshToken userId: ', userId)
    const { refreshToken } = req.body
    console.log('[auth controller] @refreshToken refreshToken: ', refreshToken)

    // let newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_USER, {
    //     expiresIn: process.env.JWT_EXPIRE_USER,
    // });
    // console.log('[auth controller] @refreshToken newAccessToken: ', newAccessToken)

    // const user = await User.findById(userId)

    // 1) Find token
    const user = await User.findOne({
        refreshToken
    })
    if (!user) {
        return res.status(404).send({ message: "User Not found." })
    }
    console.log('[auth controller] @refreshToken user: ', user)
    
    // 2) Is refresh token still valid?
    if (user.refreshTokenExpire.getTime() < new Date().getTime()) {
        return res.status(403).json({
            message: "Refresh token was expired. Please make a new signin request.",
        })
    }

    // 3) Remove refresh token from DB
    user.refreshToken = null
    user.refreshTokenExpire = null
    user.save()
    
    sendTokenResponseUser(user, 200, res, true)
})


// Get token from model, create cookie and send response
const sendTokenResponseUser = (user, statusCode, res, refreshToken) => {
    console.log('[auth controller] @sendTokenResponseUser user: ', user)
    console.log('[auth controller] @sendTokenResponseUser refreshToken: ', refreshToken)
    console.log('[auth controller] @sendTokenResponseUser process.env.JWT_COOKIE_EXPIRE_USER: ', process.env.JWT_COOKIE_EXPIRE_USER)
    console.log('[auth controller] @sendTokenResponseUser process.env.NODE_ENV: ', process.env.NODE_ENV)

    // 1) Create token
    const token = user.getSignedJwtToken()
    console.log('token: ', token)
    if (user.password) {
        user.password = undefined
    }

    const options = {
        expires: refreshToken ? new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_USER_REFRESH_TOKEN * 1000) : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_USER * 1000),
        // expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_USER * 1000),
        httpOnly: true
    }

    // if (process.env.NODE_ENV === 'production') {
    //     options.secure = true // Does not work if website is not https
    // }

    res.status(statusCode)
        .cookie('token-user', token, options)
        .json({
            success: true,
            user,
            token
        })
}

const sendTokenResponseResume = (resume, statusCode, res) => {
    // Create token
    const token = resume.getSignedJwtToken()
    console.log('[auth controller] @senTokenResponseResume token: ', token)

    if (resume.password) {
        resume.password = undefined
    }

    const options = {
        // expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE_RESUME * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }

    res.status(statusCode)
        .cookie('token-resume', token, options)
        .json({
            success: true,
            resume,
            token
        })
}
