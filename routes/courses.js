const express = require('express');
const { get_courses, get_single_course, create_course, update_course, delete_course } = require('../controllers/courseController');

const router = express.Router();

router.get('/', get_courses);

router.get('/bootcamps/:bootcampId', get_courses);

router.get('/:id', get_single_course);

router.post('/:bootcampId', create_course);

router.put('/:id', update_course);

router.delete('/:id', delete_course);

module.exports = router;