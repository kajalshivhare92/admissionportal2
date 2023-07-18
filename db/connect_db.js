const mongoose =require('mongoose');
const url = "mongodb://127.0.0.1:27017/admissionportal"
const live_Url='mongodb+srv://shivharekajal92:kajal92@cluster0.vofjduz.mongodb.net/admissionportal?retryWrites=true&w=majority'
const connectDB=()=>{
    // For local DB
    return mongoose.connect(live_Url)


    // For cloud DB
    // return mongoose.connect(database)
    
    .then(()=>{
        console.log("Connected Succeessfully")
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports=connectDB