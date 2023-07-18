const UserModel = require('../models/user')
const CourseModel = require('../models/Course')
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

cloudinary.config({
    cloud_name: 'dbteh0acf',
    api_key: '927442271426694',
    api_secret: 'FLaUleLiB6truUcyoF1r5fz7cUo',

});


class FrontendController {



    static dashboard = async (req, res) => {

        try {

            // console.log(req.user)
            const { name, email, id, image } = req.user
            const btech = await CourseModel.findOne({ user_id: id, course: 'btech' })
            const bca = await CourseModel.findOne({ user_id: id, course: 'BCA' })
            const mca = await CourseModel.findOne({ user_id: id, course: 'MCA' })
            res.render('dashboard', { n: name, image: image.url, b: btech, bc: bca, mc: mca })

        } catch (error) {
            console.log(error)

        }


    }

    static login = async  (req, res) => {
        res.render('login', { message: req.flash('success'), error: req.flash('error') })
    }

    static about = async (req, res) => {
        try {
            const { name, image,_id } = req.user
            res.render('about', { n: name, image: image.url })
        } catch (error) {
            console.log(error);
        }
    };
   
    static contact = async (req, res) => {
        try {
          const { name, email, id, image } = req.user;
          res.render("contact", { n: name, image: image.url });
        } catch (error) {
          console.log(error);
        }
      };
        

    static register = async (req, res) => {
        try {
            res.render('register', { message: req.flash('error') })
        } catch (error) {
            console.log('error')
        }
    }

    static insert = async (req, res) => {
        // console.log(req.files.image)
        const file = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {

            folder: 'studentimage'
        })
        // console.log(imageUpload)
        const { n, e, p_number, p, c } = req.body
        const user = await UserModel.findOne({ email: e })
        console.log(user)
        if (user) {
            req.flash('error', 'Email already exist.')
            //   this is use for routh path
            res.redirect('/register')
        } else {
            if (n && e && p && c) {
                if (p == c) {

                    try {
                        const hashp = await bcrypt.hash(p, 10)
                        const result = new UserModel({
                            name: n,
                            email: e,
                            p_number: p_number,
                            password: hashp,
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url
                            }

                        })
                        await result.save()
                        req.flash('success', 'Resgistration Successfully Please login here')
                        // this is use for routh path
                        res.redirect('/')

                    } catch (error) {
                        console.log(error)
                    }


                } else {
                    req.flash('error', 'password and confirm password does not match.')
                    res.redirect('/register')
                }

            } else {
                req.flash('error', 'All Field are required.')
                res.redirect('/register')
            }
        }
    }

    static verifylogin = async (req, res) => {
        try {
            //   console.log(req.body)
            const { email, password } = req.body
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                // console.log(user)
                if (user != null) {
                    const ismatch = await bcrypt.compare(password, user.password)
                    if (ismatch) {
                        // multiple login
                        if (user.role == 'student') {
                            // Generate token
                            const token = jwt.sign({ ID: user._id }, 'KajalShivhare@12345678');
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/dashboard')

                        }

                        if (user.role == 'admin') {
                            // Generate token
                            const token = jwt.sign({ ID: user._id }, 'KajalShivhare@12345678');
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/admin/dashboard')
                        }
                    } else {
                        req.flash('error', 'email or password is not valid.')
                        res.redirect('/')

                    }
                } else {
                    req.flash('error', 'you are not registered in email.')
                    res.redirect('/')
                }
            } else {
                req.flash('error', 'All Field are required.')
                res.redirect('/')
            }
        } catch (error) {
            console.log(error)

        }
    }
    static logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (error) {
            console.log('error')
        }
    }
    static profile = async (req, res) => {
        try {
            const { name, email, p_number, id, image } = req.user
            res.render("profile", { n: name, image: image.url, email: email, p: p_number, message: req.flash('success'), error: req.flash('error') })
        } catch (error) {
            console.log(error);
        }
    }

    static change_password = async (req, res) => {
        try {
            const { name, email, id, image } = req.user
            //  console.log(req.body)
            const { oldpassword, newpassword, confirmpassword } = req.body
            if (oldpassword && newpassword && confirmpassword) {
                const user = await UserModel.findById(id)
                const ismatched = await bcrypt.compare(oldpassword, user.password)
                if (!ismatched) {

                    req.flash('error', 'old password is incorrect')
                    res.redirect('/profile')
                }
                else {
                    if (newpassword !== confirmpassword) {
                        req.flash('error', 'password and confirmpassword does not matched')
                        res.redirect('/profile')
                    }
                    else {
                        const newHashpassword = await bcrypt.hash(newpassword, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            $set: { password: newHashpassword }

                        })
                        req.flash('message', 'password change successfully')
                        res.redirect('/logout')
                    }
                }
            }
            else {
                req.flash('error', 'All Field are required.')
                res.redirect('/profile')
            }

        } catch (error) {
            console.log(error)
        }
    }

    static profile_update = async (req, res) => {
        try {
            //  console.log(req.files.image)
            if (req.files) {
                const user = await UserModel.findById(req.user.id);
                const image_id = user.image.public_id;
                await cloudinary.uploader.destroy(image_id);

                const file = req.files.image;
                const myimage = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'studentimage',
                });
                var data = {
                    name: req.body.name,
                    email: req.body.email,
                    image: {
                        public_id: myimage.public_id,
                        url: myimage.secure_url,
                    },
                };
            } else {
                var data = {
                    name: req.body.name,
                    email: req.body.email,
                }
            }
            const update_profile = await UserModel.findByIdAndUpdate(req.user.id, data)
            res.redirect('/profile')
        } catch (error) {
            console.log(error)
        }
    }
}





module.exports = FrontendController