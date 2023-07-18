const CourseModel = require("../models/Course")
const nodemailer = require('nodemailer')

class CourseController {


    static course_insert = async (req, res) => {
        try {
            const { name, email, id, image } = req.user
            // console.log(req.body)
            const course = req.body.course

            const result = new CourseModel({
                name: req.body.name,
                email: req.body.email,
                mobile_number: req.body.mobile_number,
                address: req.body.address,
                gender: req.body.gender,
                qualification: req.body.qualification,
                course: req.body.course,
                user_id: req.user.id

            })
            await result.save()
            this.SendEmail(course, email)
            req.flash('success', 'Course registration Successfully')
            res.redirect('/course_display')


        } catch (error) {
            console.log(error)
        }

    }

    static course_display = async (req, res) => {
        try {
            const { name, email, id, image } = req.user
            const data = await CourseModel.find({ user_id: id })
            console.log(data)

            // console.log(data);
            res.render('courses/display', { d: data, message: req.flash('success'), n: name, image: image.url });



        } catch (error) {
            console.log(error)
        }
    }


    static course_view = async (req, res) => {
        try {
            //  console.log(req.params.id)
            const data = await CourseModel.findById(req.params.id)
            const { name, email, _id, image } = req.user
            console.log(data);
            res.render('courses/view', { d: data, n: name, image: image });



        } catch (error) {
            console.log(error)
        }
    }

    static course_edit = async (req, res) => {
        try {
            console.log(req.params.id)
            const data = await CourseModel.findById(req.params.id)
            const { name, email, _id, image } = req.user
            console.log(data);
            res.render('courses/edit', { d: data, n: name, image: image });



        } catch (error) {
            console.log(error)
        }
    }

    static course_update = async (req, res) => {
        try {
            console.log(req.body);
            console.log(req.params.id);
            const update = await CourseModel.findByIdAndUpdate(req.params.id, {

                name: req.body.name,
                email: req.body.email,
                mobile_number: req.body.mobile_number,
                address: req.body.address,
                gender: req.body.gender,
                qualification: req.body.qualification,
                course: req.body.course

            })
            req.flash('success', 'Updated Successfully')
            res.redirect('/course_display')

        } catch (error) {
            console.log(error)
        }
    }

    static course_delete = async (req, res) => {
        try {
            //  console.log(req.body);
            //  console.log(req.params.id);
            const update = await CourseModel.findByIdAndDelete(req.params.id)
            req.flash('success', 'Delete Successfully ')
            res.redirect('/course_display')


        } catch (error) {
            console.log(error)
        }
    }



    static SendEmail = async (course, email) => {

        //  console.log(course)
        //  console.log(email)

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
            html: `your course register successfully<b>${course}</b>`, // html body
        });


    }




}




module.exports = CourseController
