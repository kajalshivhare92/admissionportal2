const ContactModel = require("../../models/Contact")

class ContactController{

    static Display =  (req,res)=>{
        res.render('admin/display')
    }
 

    
}
module.exports = ContactController