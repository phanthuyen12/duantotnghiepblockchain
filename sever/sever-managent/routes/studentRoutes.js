const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { json } = require('body-parser');

router.post('/add', studentController.addStudent);
router.get('/:id', studentController.getStudent);
router.get('/getall', studentController.getAllStudents);
router.get('/index', (req, res) => {
    res.json({ message: 'Xin chào các bạn!' });
});module.exports = router;
