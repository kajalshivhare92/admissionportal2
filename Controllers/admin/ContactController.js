const ContactModel = require('../../models/Contact')

class ContactController {

  static contactinsert = async (req, res) => {
    try {
      // console.log(req.body) 
      const insert = await new ContactModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message
      })
      await insert.save()
      res.redirect('/contact')

    } catch (error) {
      console.log(error)
    }

  }

  static viewcontact = async (req, res) => {
    try {
      const { name, email, id, image } = req.user
      const data = await ContactModel.find()
      // console.log(data)
      res.render('admin/viewcontact', { d: data, n: name, e: email, image: image.url })
    } catch (error) {
      console.log(error)
    }

  }
}

module.exports = ContactController