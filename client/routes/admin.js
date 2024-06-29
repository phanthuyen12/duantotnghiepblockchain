const express = require('express');
const router = express.Router();
router.get('/',(req,res)=>{
    res.render('index');
});
router.get('/createrDocter',(req,res)=>{
    res.render('createrdocter');
});
module.exports = router;