const express = require('express')
const CourseController = require('../Controllers/CourseController')
const FrontendController = require('../Controllers/FrontendController')
const router =express.Router()
const checkuserauth= require('../middleware/auth')
const islogin = require('../middleware/islogin')
const AdminController = require('../Controllers/admin/AdminController')
const ContactController = require('../Controllers/admin/ContactController')




// route path
// frontend controller
router.get("/",islogin,FrontendController.login)
router.get("/register",FrontendController.register)
router.post('/insert',FrontendController.insert);
router.get("/dashboard", checkuserauth,FrontendController.dashboard)
router.post("/verifylogin",FrontendController.verifylogin)
router.get("/logout",FrontendController.logout)
router.get("/profile",checkuserauth,FrontendController.profile)
router.get("/about",checkuserauth,FrontendController.about)
router.get("/contact",checkuserauth,FrontendController.contact)
router.post("/change_password",checkuserauth,FrontendController.change_password)
router.post('/profile_update',checkuserauth,FrontendController.profile_update)

// course controller

router.post("/course_insert", checkuserauth,CourseController.course_insert);
router.get('/course_display', checkuserauth,CourseController.course_display);
router.get('/course_view/:id', checkuserauth,CourseController.course_view);
router.get('/course_edit/:id', checkuserauth,CourseController.course_edit);
router.post('/course_update/:id', checkuserauth,CourseController.course_update);
router.get('/course_delete/:id', checkuserauth,CourseController.course_delete);

// admin controller
router.get('/admin/dashboard', checkuserauth,AdminController.dashboard)
router.get('/admin/course_view/:id', checkuserauth,AdminController.courseview)  
router.get('/admin/course_delete/:id', checkuserauth,AdminController.coursedelete)
router.post('/update_approve/:id',checkuserauth,AdminController.update_approve)


// contact controller
router.get('/display/:id', checkuserauth,ContactController.Display)  

  module.exports=router