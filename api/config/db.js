const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
            // autoIndex: false // To be disabled in production
        })
        // console.log('process.env.MONGO_URI: ', process.env.MONGO_URI)
        // console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log('Unable to connect to MongoDB. Verify connection credentials. Connection string: ', process.env.MONGO_URI)
    }
}

module.exports = connectDB
