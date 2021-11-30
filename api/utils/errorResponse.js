class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        // this.path = 'slug'
        console.log('ErrorResponse message: ', message)
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorResponse
