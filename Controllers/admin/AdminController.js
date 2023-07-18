const CourseModel = require('../../models/Course')
const nodemailer = require('nodemailer') 

class AdminController {

  // static dashboard = async(req,res)=>{
  //   try{
  //       const{name,email,id,image} = req.user
  //       const course =await CourseModel.find()
  //       // console.log(course)
  //       res.render('admin/dashboard',{n:name, e:email, image:image.url,c:course})

  //   }catch(error){
  //       console.log('error')
  //   }
  // }
  static dashboard = async (req, res) => {
    try {
      const { name, email, id, image } = req.user
      const data = await CourseModel.find()
      // console.log(course)
      res.render('admin/dashboard', { d: data, n: name, e: email, image: image.url })

    } catch (error) {
      console.log('error')
    }
  }
  static courseview = async (req, res) => {
    try {
      const { name, email, id, image } = req.user
      const data = await CourseModel.findById(req.params.id)
      // console.log(course)
      res.render('admin/view', { d: data, n: name, e: email, image: image.url })

    } catch (error) {
      console.log('error')
    }
  }
  static coursedelete = async (req, res) => {
    try {
      const { name, email, id, image } = req.user
      const data = await CourseModel.findByIdAndDelete(req.params.id)
      // console.log(course)
      res.redirect('/admin/dashboard')

    } catch (error) {
      console.log('error')
    }
  }





  static update_approve = async (req, res) => {
    try {
      // console.log(req.body)
      const { course, email, name,comment, status} = req.body
      const result = await CourseModel.findByIdAndUpdate(req.params.id, {
        comment: req.body.comment,
        status: req.body.status
      })
      this.SendEmail(comment,status, course, name, email)
      req.flash('success', 'approve successfully update')
      res.redirect('/admin/dashboard')
    } catch (error) {
      console.log(error)
    }
  }

  static SendEmail = async (comment, status, course, name, email) => {

    console.log(comment, status, course, name, email)
    //console.log(email)
    // 1RHfz85p4XfEue4Juv
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'shivharekajal92@gmail.com',
        pass: 'xxhzpybdjgqlsdea'
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"shivharekajal92@gmail.com" <shivharekajal92@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: `${name} your ${course} course  ${status} successfully, <br><b>${comment}</b>`, // html body
    });


  }






}




module.exports = AdminController