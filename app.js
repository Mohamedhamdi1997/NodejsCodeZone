const express = require('express');
const path = require('path')
const cors = require('cors');
const mongoose = require('mongoose');
const httpStatusText = require('./utils/httpStatusText');
require('dotenv').config();
const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//app.use(express.urlencoded({extended: false}))

const url= process.env.MONGO_URL;


//mongoose.set("strictQuery", false)
mongoose.connect(url).then(() => {
    console.log('mongodb server started')
})
  
app.use(cors())
app.use(express.json());

const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');
app.use('/api/courses', coursesRouter)
app.use('/api/users', usersRouter)

// global middleware for not found router
app.all('*', (req,res,next)=> {
    return res.status(404).json({ status: httpStatusText.ERROR, message: 'this resource is not available'})
})

// global error handler
app.use((error, req, res, next) => {
    res.status(500).json({status: httpStatusText.ERROR, message: error.message});
})

app.listen(process.env.PORT || 5001, () => {
    console.log('listening on port 5001');
});
