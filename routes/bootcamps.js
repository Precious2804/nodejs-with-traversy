const express = require('express')
const { get_bootcamps, single_bootcamp, create_bootcamp, update_bootcamp, delete_bootcamp, get_bootcamps_radius, upload_photo } = require('../controllers/bootcampController')

const router = express.Router();

router.get('/', get_bootcamps)

router.get('/:id', single_bootcamp)

router.post('/', create_bootcamp)

router.put('/:id', update_bootcamp)

router.delete('/:id', delete_bootcamp)

router.get('/radius/:zipcode/:distance', get_bootcamps_radius)

router.put('/:id/photo', upload_photo)

module.exports = router