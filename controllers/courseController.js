const Course = require('../models/Course')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');


const get_courses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Course.find({ bootcamp: req.params.bootcampId }).populate('bootcamp');
    } else {
        query = Course.find().populate('bootcamp');
    }

    const courses = await query;
    res.status(200).json({ status: true, message: "Courses retrieved", count: courses.length, data: courses })

});


const get_single_course = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate('bootcamp')

    if (!course) return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));

    res.status(200).json({ status: true, message: "Single Bootcamp", data: course })
})


const create_course = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if (!bootcamp) return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);

    const course = await Course.create(req.body);

    res.status(200).json({ status: true, message: `New Course created for bootcamp with id of ${req.params.bootcampId}`, data: course })
})


const update_course = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id);

    if (!course) return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ status: true, message: "Course hass been updated", data: course })
})


const delete_course = asyncHandler (async (req, res, next) => {
    const course = await Course.findById(req.params.id);

    if (!course) return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));

    await course.remove();

    res.status(200).json({ status: true, message: "Course was deleted successfully" })
})


module.exports = {
    get_courses,
    get_single_course,
    create_course,
    update_course,
    delete_course
}