const path = require("path")
const express = require("express")
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth')
const bootRoutes = require('./routes/bootcamps')
const courseRoutes = require('./routes/courses')
const morgan = require('morgan')
const errorHandler = require('./middleware/error')
const connectDB = require('./config/db')
const fileUpload = require('express-fileupload');

//load env vars
dotenv.config({ path: './config/config.env' });

//connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

//  dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'))
}

//file uploading
app.use(fileUpload());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/bootcamps', bootRoutes)
app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/auth', authRoutes)

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, console.log(`Server runing in ${process.env.NODE_ENV} mode on port ${PORT}`))

//handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server and exit process
    server.close(() => process.exit(1));
})