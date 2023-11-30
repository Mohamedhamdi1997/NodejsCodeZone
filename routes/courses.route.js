
const express = require('express');
const router = express.Router();

const {body} = require('express-validator');
const courseController = require('../controllers/courses.controller');
const { validationSchema } = require('../middelware/validationSchema');
const verifyToken = require('../middelware/verifyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middelware/allowedTo');

// get all courses
router.route('/')
             .get(courseController.getAllCourses )
             .post( verifyToken, allowedTo(userRoles.MANAGER), validationSchema(), courseController.addCourse);
/*
router.get('/:courseId', courseController.getCourse);
router.patch('/:courseId', courseController.updateCourse)
router.delete('/:courseId', courseController.deleteCourse);
*/
router.route('/:courseId')
      .get(courseController.getCourse)
      .patch(courseController.updateCourse)
      .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANAGER), courseController.deleteCourse);
module.exports= router;