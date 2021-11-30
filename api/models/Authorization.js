const mongoose = require('mongoose')

const AuthorizationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        resume: {
            type: mongoose.Schema.ObjectId,
            ref: 'Resume',
            required: true
        },
        status: {
            type: String,
            enum: ['accorded', 'in_process', 'revoked', 'refused']
        },
        message: {
            type: String
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: {
            type: Date,
            default: Date.now
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

// // Reverse populate with virtuals
// AuthorizationSchema.virtual('users', {
//     ref: 'User',
//     localField: 'user_id',
//     foreignField: '_id',
//     justOne: false
// })

// AuthorizationSchema.virtual('resumes', {
//     ref: 'Resume',
//     localField: 'resume_id',
//     foreignField: '_id',
//     justOne: false
// })

module.exports = mongoose.model('Authorization', AuthorizationSchema)
