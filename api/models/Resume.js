const crypto = require('crypto')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator')
// const { serverRules } = require('../utils/rules')
const validationRulesServer = require('../utils/validationRulesServer')
// const { minLength } = require('vuelidate/lib/validators')
const ErrorResponse = require('../utils/errorResponse')

// console.log('rules server: ', rules)
// const rules = {
//     job_title: {
//         // required: true,
//         // max: 5,
//         required: [true, 'Please add a job title'],
//         minlength: [2, 'Job title must have at least 2 characters'],
//         maxlength: [5, 'validation.max.string'],
//     }
// }

// function isVisibilityNotPublic() {
//     console.log('this.visibility2: ', this.visibility)
//     console.log('resumeSchema.visibility: ', resumeSchema.visibility)
//     if (this.visibility !== 'public') {
//         return true
//     } else {
//         return false
//     }
// }

const educationSubSchema = new mongoose.Schema({
    title: {
        type: String,
        // required: [true, 'Please add a title'],
        // maxlength: [2, 'server.max'],
        ...validationRulesServer.education.title
    },
    description: {
        type: String,
        // maxlength: [2, 'server.max'],
        ...validationRulesServer.education.description
    },
    school: {
        type: String,
        // maxlength: [2, 'server.max'],
        ...validationRulesServer.education.school
    },
    city: {
        type: String,
        // maxlength: [64, 'City can have max 64 characters'],
        ...validationRulesServer.education.city
    },
    country: {
        type: String,
        // maxlength: [64, 'Country can have max 64 characters'],
        ...validationRulesServer.education.country
    },
    start_date: {
        type: String,
        // maxlength: [32, 'Start date can have max 32 characters'],
        ...validationRulesServer.education.start_date
    },
    end_date: {
        type: String,
        // maxlength: [32, 'End date can have max 32 characters'],
        ...validationRulesServer.education.end_date
    },
    image: {
        type: String
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
})
const workExperienceSubSchema = new mongoose.Schema({
    job_title: {
        type: String,
        // required: [true, 'Please add a job title'],
        // maxlength: [64, 'Title can have max 64 characters']
        ...validationRulesServer.work_experience.job_title
    },
    job_description: {
        type: String,
        ...validationRulesServer.work_experience.job_description
    },
    company: {
        type: String,
        // maxlength: [64, 'Company can have max 64 characters']
        ...validationRulesServer.work_experience.company
    },
    city: {
        type: String,
        // maxlength: [64, 'City can have max 64 characters']
        ...validationRulesServer.work_experience.company
    },
    country: {
        type: String,
        // maxlength: [64, 'Country can have max 64 characters']
        ...validationRulesServer.work_experience.country
    },
    start_date: {
        type: String,
        // maxlength: [64, 'Start date can have max 64 characters']
        ...validationRulesServer.work_experience.start_date
    },
    end_date: {
        type: String,
        // maxlength: [64, 'End date can have max 64 characters']
        ...validationRulesServer.work_experience.end_date
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
})
const skillSubSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        // maxlength: [2, 'server.max']
        // maxlength: [64, 'server.max']
        ...validationRulesServer.skill.name
    },
    slug: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.skill.slug
    },
    category: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.skill.category
    },
    type: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.skill.type
    },
    value: {
        type: Number,
        // min: [1, 'server.min_number'],
        // max: [100, 'server.max_number']
        ...validationRulesServer.skill.value
    }
})
const uploadSubSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, 'Please add a name'],
        // maxlength: [512, 'server.max']
        ...validationRulesServer.upload.name
    },
    title: {
        type: String,
        // maxlength: [64, 'server.max']
        // maxlength: [2, 'server.max']
        ...validationRulesServer.upload.title
    },
    mime_type: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.upload.mime_type.name
    },
    type: {
        type: String,
        enum: ['file', 'image', 'other'],
        default: 'file'
    },
    category: {
        type: String,
        // enum: ['downloadable_file', 'profile_picture', 'other'],
        maxlength: [128, 'server.max'],
        // default: 'downloadable_file'
    },
    download_url: {
        type: String,
        // maxlength: [512, 'Download URL can have max 512 characters']
        ...validationRulesServer.upload.download_url
    },
    size_in_bytes: {
        type: Number
    },
    statistics: {
        total_downloads_count: {
            type: Number,
            default: 0
        },
        last_visitors: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',

                },
                date: {
                    type: Date,
                    default: Date.now()
                }
            }
        ],

    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})
const socialNetworkSubSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, 'Please add a name'],
        // maxlength: [64, 'server.max']
        ...validationRulesServer.social_network.name
    },
    slug: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.social_network.slug
    },
    icon: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.social_network.icon
    },
    link: {
        type: String,
        // maxlength: [512, 'server.max']
        ...validationRulesServer.social_network.link
    }
})
const languageSubSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, 'server.required'],
        // maxlength: [64, 'server.max']
        ...validationRulesServer.language.name
    },
    slug: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.language.slug
    },
    native_name: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.language.native_name
    },
    native_speaker: {
        type: Boolean,
        default: false
    },
    code: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.language.code
    },
    level: {
        type: Number,
        ...validationRulesServer.language.level
    }
})

const nationalitySubSchema = new mongoose.Schema({
    // type: mongoose.Schema.ObjectId,
    // ref: 'Country'
    name: {
        type: String,
        // required: [true, 'server.required'],
        // maxlength: [64, 'server.max']
        ...validationRulesServer.nationality.name
    },
    slug: {
        type: String,
        // maxlength: [64, 'server.max']
        ...validationRulesServer.nationality.slug
    }
})

const ResumeSchema = new mongoose.Schema(
    {
        slug: {
            type: String,
            // alias: 'personal_data.slug',
            // required: [true, 'Please add a slug'],
            // minlength: [2, 'Slug must have at least 2 characters'],
            // maxlength: [200, 'Slug can have max {PATH} {VALUE} {TYPE} characters'],
            // unique: true
            ...validationRulesServer.slug
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            // required: [true, 'Please add a user']
            ...validationRulesServer.user
        },
        template: {
            type: mongoose.Schema.ObjectId,
            ref: 'Template',
            // required: [true, 'Please add a template']
            ...validationRulesServer.template
        },
        template_details: {
            type: Object
        },
        password: {
            type: String,
            select: false,
            ...validationRulesServer.password
        },
        visibility: {
            type: String,
            enum: ['public', 'semi-private', 'private']
        },
        job_title: {
            type: String,
            // required: [true, 'Please add a job title'],
            // minlength: [2, 'Job title must have at least 2 characters'],
            // maxlength: [2, 'Job title must have at least 2 characters'],
            // maxlength: [rules.job_title.max, 'validation.max.string'],
            ...validationRulesServer.job_title
        },
        job_description: {
            type: String,
            // maxlength: [512, 'Job description can have max 512 characters'],
            // required: [true, 'server.required'],
            // minlength: [1, 'server.min']
            ...validationRulesServer.job_description
        },
        profile_picture: {
            type: String
        },
        is_active: {
            type: Boolean,
            default: true
        },
        colors: {
            background: {
                type: String,
                // maxlength: [10, 'server.max']
                ...validationRulesServer.colors.background
            },
            text: {
                type: String,
                // maxlength: [10, 'server.max']
                ...validationRulesServer.colors.text
            },
            primary: {
                type: String,
                // maxlength: [10, 'server.max']
                ...validationRulesServer.colors.primary
            },
            secondary: {
                type: String,
                // maxlength: [10, 'server.max']
                ...validationRulesServer.colors.secondary
            },
            tertiary: {
                type: String,
                // maxlength: [10, 'server.max']
                ...validationRulesServer.colors.tertiary
            }
        },
        contact_form_validation: {
            email_is_required: {
                type: String,
                trim: true,
                lowercase: true,
                default: 'Email field is required'
            }
        },

        personal_data: {
            firstname: {
                type: String,
                // maxlength: [2, 'First name can have max 2 characters']
                ...validationRulesServer.personal_data.firstname
            },
            lastname: {
                type: String,
                ...validationRulesServer.personal_data.lastname
                // required: [true, 'Please add a lastname'],
                // maxlength: [64, 'Last name can have max 64 characters']
            },
            middlename: {
                type: String,
                // required: [true, 'server.required'],
                ...validationRulesServer.personal_data.middlename
                // maxlength: [64, 'Middlename can have max 64 characters']
            },

            email: {
                type: String,
                trim: true,
                ...validationRulesServer.personal_data.email
                // lowercase: true,
                // maxlength: [128, 'Email can have max 128 characters']
            },
            website: {
                type: String,
                ...validationRulesServer.personal_data.website
            },
            phone_number: {
                type: String,
                ...validationRulesServer.personal_data.phone_number
                // maxlength: [16, 'Phone number can have max 16 characters']
            },
            birthday: {
                type: Date
            },
            city: {
                type: String,
                ...validationRulesServer.personal_data.city
                // maxlength: [64, 'City can have max 64 characters']
            },
            // password2: {
            //     type: String,
            //     required: [true, 'server.required'],
            //     select: false
            // },
            // country: {
            //     name: {
            //         type: String
            //     },
            //     slug: {
            //         type: String
            //     }
            // },

            country: {
                type: mongoose.Schema.ObjectId,
                ref: 'Country'
            },
            // nationalities: [nationalitySubSchema],
            nationalities: [{ type: mongoose.Schema.ObjectId, ref: 'Country' }]
        },
        education: [educationSubSchema],
        work_experience: [workExperienceSubSchema],
        skills: [skillSubSchema],
        uploads: [uploadSubSchema],
        social_networks: [socialNetworkSubSchema],
        languages: [languageSubSchema],
        menus: {
            contact: {
                type: String,
                // maxlength: [32, 'Contact menu can have max 32 characters']
                ...validationRulesServer.menus.contact
            },
            education: {
                type: String,
                // maxlength: [32, 'Education menu can have max 32 characters']
                ...validationRulesServer.menus.education
            },
            files: {
                type: String,
                // maxlength: [32, 'Files menu can have max 32 characters']
                ...validationRulesServer.menus.files
            },
            home: {
                type: String,
                // maxlength: [32, 'Home menu can have max 32 characters']
                ...validationRulesServer.menus.home
            },
            presentation: {
                type: String,
                // maxlength: [32, 'Presentation menu can have max 32 characters']
                ...validationRulesServer.menus.presentation
            },
            skills: {
                type: String,
                // maxlength: [32, 'Skills menu can have max 64 characters']
                ...validationRulesServer.menus.skills
            },
            work_experience: {
                type: String,
                // maxlength: [32, 'Work experience menu can have max 32 characters']
                ...validationRulesServer.menus.work_experience
            }
        },
        statistics: {
            total_views_count: {
                type: Number,
                default: 0
            },
            last_visitors: [
                {
                    user: {
                        type: mongoose.Schema.ObjectId,
                        ref: 'User'
                    },
                    date: {
                        type: Date,
                        default: Date.now
                    }
                }
            ]
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

// Add unique validator plugin
ResumeSchema.plugin(uniqueValidator, { message: 'unique_slug' })

// Encrypt visitor password using bcrypt
ResumeSchema.pre('save', async function (next) {
    console.log('pre save')
    if (!this.isModified('password')) {
        // if (!this.isModified('visitor_password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    // this.visitor_password = await bcrypt.hash(this.visitor_password, salt)
})


ResumeSchema.pre('update', async function(next) {
    console.log('pre update')
})

// Encrypt updated visitor password using bcrypt
ResumeSchema.pre('findOneAndUpdate', async function (next) {
    console.log('[models] Resume pre findOneAndUpdate _update.visibility: ', this._update.visibility)
    // console.log('pre findOneAndUpdate _update.password: ', this._update.password)
    // console.log('pre findOneAndUpdate this.isModified(visibility): ', this.visibility)

    // if (!this.isModified('password')) {
    //     next()
    // }

    // Making sure a password is provided for private or semi-private resumes
    if (this._update.visibility !== 'public') {
        // if (!this._update.password) {
        //     console.log('A password is required!')
        //     let err = new Error()
        //     err.name = 'ValidationError'
        //     err.errors = {
        //         password: {
        //             message: 'server.required'
        //         }
        //     }
        //     next(err)
        // }
        // if (this._update.password.length < 6) {
        //     console.log('Password is too short!')
        //     let err = new Error()
        //     err.name = 'ValidationError'
        //     err.errors = {
        //         password: {
        //             message: 'server.min'
        //         }
        //     }
        //     next(err)
        // }
        // if (this._update.password.length > 64) {
        //     console.log('Password is too long!')
        //     let err = new Error()
        //     err.name = 'ValidationError'
        //     err.errors = {
        //         password: {
        //             message: 'server.max'
        //         }
        //     }
        //     next(err)
        // }
    } else {
        this._update.password = ''
    }

    if (this._update.password) {
        if (this._update.password.length < 6) {
            // console.log('Password is too short!')
            let err = new Error()
            err.name = 'ValidationError'
            err.errors = {
                password: {
                    message: 'server.min'
                }
            }
            next(err)
        }
        if (this._update.password.length > 64) {
            // console.log('Password is too long!')
            let err = new Error()
            err.name = 'ValidationError'
            err.errors = {
                password: {
                    message: 'server.max'
                }
            }
            next(err)
        }
        const salt = await bcrypt.genSalt(10)
        // this._update.password = await bcrypt.hash('secret', salt)
        this._update.password = await bcrypt.hash(this._update.password, salt)
    }
    next()
})

// Sign JWT and return
ResumeSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_RESUME, {
        // return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE_RESUME
        // expiresIn: process.env.JWT_EXPIRE
    })
}

// Match user entered password to hashed password in database
ResumeSchema.methods.matchPassword = async function (enteredPassword) {
    // return await bcrypt.compare(enteredPassword, this.password)
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generate and hash password token
ResumeSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model('Resume', ResumeSchema)
