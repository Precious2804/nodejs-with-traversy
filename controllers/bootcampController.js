const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');
const path = require("path")


//@desc  GET all bootcamps
//@route GET /api/v1/bootcamps
//acces Public
const get_bootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await Bootcamp.find().populate('courses');
    res.status(200).json({ status: true, message: "Bootcamps retrieved", count: bootcamps.length, data: bootcamps })
});

//@desc  GET single
//@route GET /api/v1/bootcamps/:id
//acces Public
const single_bootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

    res.status(200).json({ status: true, message: "Single Bootcamp", data: bootcamp })
});

//@desc  Create new bootcamp
//@route POST /api/v1/bootcamps
//@acces Private
const create_bootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        status: true,
        message: "New Bootcamp created",
        data: bootcamp
    });
});

//@desc  Update bootcamp
//@route GET /api/v1/bootcamps/:id
//@acces Private
const update_bootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

    res.status(200).json({ status: true, message: "Bootcamp updated", data: bootcamp })
});

//@desc  Delete bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@acces Private
const delete_bootcamp = asyncHandler(async (req, res, next) => {
    let bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

    res.status(200).json({ status: true, message: "Bootcamp deleted" })
});


// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
const get_bootcamps_radius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // Divide dist by radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });

    res.status(200).json({
        status: true,
        message: "Bootcamps around a Radius",
        count: bootcamps.length,
        data: bootcamps
    });
});

const upload_photo = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));

    if (!req.files) return next(new ErrorResponse(`Please upload a file`, 400));

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) return next(new ErrorResponse(`Please upload an image file`, 400));

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        let bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({ status: true, message: "Bootcamp photo uploaded successfully", data: bootcamp });
    });

})


module.exports = {
    get_bootcamps,
    single_bootcamp,
    create_bootcamp,
    update_bootcamp,
    delete_bootcamp,
    get_bootcamps_radius,
    upload_photo
}