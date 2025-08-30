import mongoose from "mongoose";

const temp_otpSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
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
  otp:{
    type:String,
    required:true
  }
});
export default temp_otpSchema

