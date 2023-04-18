const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

//router.post('/', eventController.addevent);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.delete('/:id', eventController.deleteEvent);
router.post('/', eventController.attendeeCheckin);
module.exports = router;