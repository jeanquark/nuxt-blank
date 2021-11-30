const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
    let error = { ...err }
    // console.log('[api/middleware/error.js errorHandler] error: ', error)
    // console.log('[api/middleware/error.js errorHandler] err: ', err)
    // console.log('[api/middleware/error.js errorHandler] error.statusCode: ', error.statusCode)
    // console.log('[api/middleware/error.js errorHandler] err.message: ', err.message)

    error.message = err.message

    // Log to console for dev
    if (process.env.NODE_ENV === 'development') {
        console.log('err: ', err)
        console.log('err.name: ', err.name)
        // console.log('err2: ', err.split(','))
        console.log('err.message: ', err.message)
    }

    // Missing authorizations
    if (err.statusCode === 403) {
        const message = 'Not authorized'
        error = new ErrorResponse(message, 403)
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`
        error = new ErrorResponse(message, 404)
    }

    // Expired token
    if (err.name === 'TokenExpiredError') {
        const message = `Token has expired`
        error = new ErrorResponse(message, 401)
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered'
        error = new ErrorResponse(message, 400)
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        // console.log('errorHandler server: validation error: ', err.errors)
        const message = Object.values(err.errors).map(val => val.message)
        const errorObject = {}
        // Object.values(err.errors).forEach(error => {
        //     errorObject[error.path] = error.message
        // })
        // console.log('errorObject: ', errorObject)
        // error = new ErrorResponse(message, 422)
        // error = new ErrorResponse(errorObject, 422)
        // error = new ErrorResponse(err.message, 422)
        // error.message = {
        //     'slug': 'abc',
        //     'title': 'def'
        // }
        console.log('error.errors: ', error.errors)
        // const errorObject = {}
        Object.keys(error.errors).forEach(field => {
            console.log('field: ', field)
            errorObject[field] = error.errors[field]['message']
        })
        console.log('errorObject: ', errorObject)
        error.message = errorObject
        error.statusCode = 422
    }
    
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler
