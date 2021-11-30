const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
// const dotenv = require('dotenv');
require('dotenv').config()

// Load env vars
// dotenv.config({ path: './config/config.env' });

// Load models
// const Bootcamp = require('./models/Bootcamp')
// const Course = require('./models/Course')
const User = require('./models/User')
// const Review = require('./models/Review')
const Resume = require('./models/Resume')
const ResumeModel = require('./models/ResumeModel')
// const Authorization = require('./models/Authorization')
const Country = require('./models/Country')
const Template = require('./models/Template')
const Language = require('./models/Language')
const SocialNetwork = require('./models/SocialNetwork')
const Package = require('./models/Package')

// Connect to DB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
// })
// console.log('MongoDB Connected')
const connectDB = require('./config/db')
connectDB()

// Read JSON files
// const bootcamps = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
// );

// const courses = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
// );

const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))

// const reviews = JSON.parse(
//   fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
// );

const resumes = JSON.parse(fs.readFileSync(`${__dirname}/_data/resumes.json`, 'utf-8'))

const resumesModels = JSON.parse(fs.readFileSync(`${__dirname}/_data/resumesModels.json`, 'utf-8'))

// const authorizations = JSON.parse(fs.readFileSync(`${__dirname}/_data/authorizations.json`, 'utf-8'))

const packages = JSON.parse(fs.readFileSync(`${__dirname}/_data/packages.json`, 'utf-8'))

const countries = JSON.parse(fs.readFileSync(`${__dirname}/_data/countries.json`, `utf-8`))

const templates = JSON.parse(fs.readFileSync(`${__dirname}/_data/templates.json`, `utf-8`))

const languages = JSON.parse(fs.readFileSync(`${__dirname}/_data/languages.json`, `utf-8`))

const socialNetworks = JSON.parse(fs.readFileSync(`${__dirname}/_data/socialNetworks.json`, `utf-8`))

// Import into DB
const importData = async () => {
    try {
        // await Bootcamp.create(bootcamps);
        // await Course.create(courses);
        await User.create(users)
        // await Review.create(reviews);
        await Resume.create(resumes)
        await ResumeModel.create(resumesModels)
        // await Authorization.create(authorizations)
        await Package.create(packages)
        await Country.create(countries)
        await Template.create(templates)
        await Language.create(languages)
        await SocialNetwork.create(socialNetworks)
        console.log('Data Imported...'.green.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

// Delete data
const deleteData = async () => {
    try {
        // await Bootcamp.deleteMany()
        // await Course.deleteMany()
        await User.deleteMany()
        // await Review.deleteMany()
        await Resume.deleteMany()
        await ResumeModel.deleteMany()
        // await Authorization.deleteMany()
        await Package.deleteMany()
        await Country.deleteMany()
        await Template.deleteMany()
        await Country.deleteMany()
        await Language.deleteMany()
        await SocialNetwork.deleteMany()
        console.log('Data Destroyed...'.red.inverse)
        process.exit()
    } catch (err) {
        console.error(err)
    }
}

if (process.argv[2] === '-i') {
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
    if (process.env.NODE_ENV == 'development') {
        importData()
    } else {
        console.log('Not in development environment, abort.'.red.inverse)
        process.exit()
    }
} else if (process.argv[2] === '-d') {
    console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)
    if (process.env.NODE_ENV == 'development') {
        deleteData()
    } else {
        console.log('Not in development environment, abort.'.red.inverse)
        process.exit()
    }
}