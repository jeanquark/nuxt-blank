const jwt = require('jsonwebtoken')
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')
const Resume = require('../models/Resume')

// authUser routes
exports.authUser = asyncHandler(async (req, res, next) => {
    const tokenUser = req.cookies['token-user']
    // console.log('[authUser middleware] tokenUser: ', tokenUser)
    // console.log('[authUser middleware] process.env.JWT_SECRET_USER: ', process.env.JWT_SECRET_USER)
    if (tokenUser && tokenUser !== 'none') {
        const decoded = jwt.verify(tokenUser, process.env.JWT_SECRET_USER)
        // console.log('[authUser middleware] decoded: ', decoded)
        const user = await User.findById(decoded.id).populate('package', 'name slug total_space_in_bytes')
        // console.log('[authUser middleware] user: ', user)
        req.user = user
        next()
    } else {
        return next(new ErrorResponse('Not authorized to access this route', 401))
    }
})

// authResume routes
exports.authResume = asyncHandler(async (req, res, next) => {
    const tokenResume = req.cookies['token-resume']
    // console.log('[authResume middleware] req.params.slug: ', req.params.slug)
    // console.log('[authResume middleware] req.body: ', req.body)

    // 1) Check if resume is authenticated && authenticated resume slug is equal to route slug
    if (tokenResume && tokenResume !== 'none') {
        console.log('[authResume middleware] tokenResume: ', tokenResume)
        // const decoded = jwt.verify(tokenResume, process.env.JWT_SECRET)
        const decoded = jwt.verify(tokenResume, process.env.JWT_SECRET_RESUME)
        console.log('[authResume middleware] decoded: ', decoded)
        const resume = await Resume.findById(decoded.id)
        console.log('[authResume middleware] authResume: ', resume)
        if (resume.slug === req.params.slug) {
            console.log('OK continue, authenticated resume is equal to resume route slug')
            req.userResume = resume
            return next()
        }
    }

    // 2) Check if user is authenticated && owns the resume
    const tokenUser = req.cookies['token-user']
    if (tokenUser && tokenUser !== 'none') {
        const resume = await Resume.findOne({ slug: req.params.slug })
        if (!resume) {
            return next(new ErrorResponse('Resume not found', 404))
        }
        const decoded = jwt.verify(tokenUser, process.env.JWT_SECRET_USER)
        const user = await User.findById(decoded.id)

        if (resume.user == user.id) {
            console.log('OK continue, authenticated user owns the resume')
            req.userResume = resume
            return next()
        }

        // 3) Otherwise check if user is authenticated && has authorization
    }

    // 4) Check if resume visibility is public
    if (req.params.slug) {
        const { visibility } = await Resume.findOne({ slug: req.params.slug }, 'visibility')
        console.log('visibility: ', visibility)
        if (visibility === 'public') {
            return next()
        }
    }
    if (req.body) {
        const { visibility } = await Resume.findOne({ slug: req.body.resumeSlug }, 'visibility')
        console.log('visibility: ', visibility)
        if (visibility === 'public') {
            return next()
        }
    }

    console.log('[auth middleware] not authorized to access this route')
    return next(new ErrorResponse('Not authorized to access this route', 401))
})

// exports.authAdmin = asyncHandler(async (req, res, next) => {
//     console.log('[authAdmin middleware]')
//     const tokenUser = req.cookies['token-user']
//     if (tokenUser && tokenUser !== 'none') {
//         const decoded = jwt.verify(tokenUser, process.env.JWT_SECRET)
//         const user = await User.findById(decoded.id)
//         console.log('user: ', user)

//         if (user.role === 'admin') {
//             return next()
//         }
//     }
//     return next(new ErrorResponse('Not authorized to access this route', 401))
// })

// Grant access to specific roles
exports.authorize = (...roles) => {
    console.log('[middleware auth.js] ...roles: ', ...roles)
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User with role "${req.user.role}" is not authorized to access this route`, 403))
        }
        next()
    }
}
