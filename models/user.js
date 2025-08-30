import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    Username: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/],
        trim: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15,
        match: [/^\d+$/]
    },
    password:{
        type :String,
        required:true,
        trim: true
    }
})

export default userSchema