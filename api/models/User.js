const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validationRulesServer = require('../utils/validationRulesServer')

const UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            // required: [true, 'Please add a firstname'],
            // minlength: [2, 'Firstname must be at least 2 characters length'],
            // maxlength: [64, 'Firstname can have max 64 characters'],
            // index: true
            // text: true
            ...validationRulesServer.register.firstname
        },
        lastname: {
            type: String,
            // minlength: [2, 'Lastname must be at least 2 characters length'],
            // maxlength: [64, 'Lastname can have max 64 characters'],
            // index: true
            // text: true
            ...validationRulesServer.register.lastname
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
            index: true
        },
        package: {
            type: mongoose.Schema.ObjectId,
            ref: 'Package'
        },
        user_preferences: {
            dark_theme: {
                type: Boolean,
                default: true
            }
        },
        role: {
            type: String,
            enum: ['user', 'moderator', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            // required: [true, 'Please add a password'],
            // minlength: 6,
            select: false,
            ...validationRulesServer.password
        },
        oauth: {
            type: Boolean,
            default: false
        },
        // fullname: {
        //     type: String,
        //     minlength: [2, 'Fullname must be at least 2 characters length'],
        //     maxlength: [255, 'Fullname can have max 255 characters']
        // },
        picture: {
            type: String
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        refreshToken: String,
        refreshTokenExpire: Date,
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
        // resumes: [{ type: mongoose.Schema.ObjectId, ref: 'Resume' }]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_USER, {
        expiresIn: process.env.JWT_EXPIRE_USER
    })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    // Set expire
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000

    return resetToken
}

// Reverse populate with virtuals
UserSchema.virtual('resumes', {
    ref: 'Resume',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

UserSchema.virtual('authorizations', {
    ref: 'Authorization',
    localField: '_id',
    foreignField: 'user',
    justOne: false
})

// UserSchema.virtual('package', {
//     ref: 'Packages',
//     localField: 'package',
//     foreignField: '_id',
//     justOne: true
// })

// UserSchema.set('autoIndex', false);
UserSchema.index({ firstname: 'text', lastname: 'text' });

module.exports = mongoose.model('User', UserSchema)
