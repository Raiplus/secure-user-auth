import express from 'express';
import cors from 'cors';
import { generateOTP, sendResponseEmail } from './src/utils.js';
import mongoose from 'mongoose'
import userSchema from "./models/user.js";
import temp_otpSchema from "./models/temp_otp.js"
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
const port = 3000;
//======================= connection to the OTP storing DB =============================
const User_OTP = await mongoose.createConnection(process.env.MONGO_URI_OTP)
User_OTP.on("connected", () => {
  console.log('conncet to database which store OTP (status code: 200)')
})
User_OTP.on("error", (err) => {
  console.log("failed to connect to the db which store OTP (status code: 500)")
})

const temp_otp = User_OTP.model("temp_otp", temp_otpSchema);

User_OTP.on("connected", () => {
  console.log('Connected to OTP DB');
});
User_OTP.on("error", (err) => {
  console.log(" Failed to connect OTP DB:", err.message);
});

//======================= connection to the OTP storing DB =============================
const User_data = await mongoose.createConnection(process.env.MONGO_URI_users)
User_data.on("connected", () => {
  console.log("Connected to User DB (status code: 200)");
});

User_data.on("error", (err) => {
  console.error("Failed to connect to User DB (status code: 500)", err.message);
});
const userdata = User_data.model("user", userSchema);

User_data.on("connected", () => {
  console.log("Connected to User DB");
});
User_data.on("error", (err) => {
  console.error(" Failed to connect User DB:", err.message);
});


//================ serve static files from 'views' ====================================================
app.use(express.static('views'));

//================================================ API  logic for otp generation ====================================================
app.post('/generate-otp', async (req, res) => {
  let data = req

  console.log(data.body)
  console.log('hit ')
  //==================== OTP GENERATION ================
  let OTP = await generateOTP()

  console.log(OTP, ":OTP genration")
  //============================ mail sending ================================================ 

  sendResponseEmail(data.body.email, OTP)

  //================================= bcrypt for OTP  encptrition ========================================
  await bcrypt.hash(OTP, 8, function (err, hash) {
    console.log(hash)
    if (err) {
      console.log("Error hashing OTP:", err);
      return;
    }
    //================= db ============================
    //==================== first cheaking is ther already a otp stored by this name due to invalid logingin session by the user  ========================
    async function handleOTP(data) {
      try {
        let userOTP = await temp_otp.findOne({ email: data.body.email });

        console.log(userOTP, ":user otp status");

        if (userOTP) {
          let user = await temp_otp.findOneAndUpdate({ email: data.body.email }, {
            fullName: data.body.fullName,
            phone: data.body.phone,
            otp: hash
          });
          if (user.password) {
            res.status(200).json({ "success": true, message: "User credentails are updated" })
          }
          else {
            console.log("user  updated");
            res.status(200).json({ "success": true, message: "ok" });
          }

        } else {
          //===================== conectin it to User_OTP is DB ==========================

          temp_otp.create({ fullName: data.body.fullName, email: data.body.email, phone: data.body.phone, otp: hash })
            .then(() => {
              console.log("user added");
              res.status(200).json({ "success": true, message: "ok" });
            })
            .catch((error) => {
              console.log("unable to process this request", error.message);
              res.status(500).json({ "success": false, message: " Unexpected server error " });
            });



        }
      } catch (err) {
        console.log("Error:", err);
      }
    }

    handleOTP(data)

  });

})


//=================================== API FOR OTP VERIFICATION ===========================================

app.post('/verify-otp', async (req, res) => {
  const data = req.body

  console.log(data)
  //use jwt and 
  //====================== db otp verification =======================
  try {
    if (!data.otpInput) {
      res.status(400).json({ "success": false, message: "Missing fields like email/password." });
      throw new Error("OTP record not found");
    }
    let userOTP = await temp_otp.findOne({ email: data.email })
    console.log(userOTP)
    let result = await bcrypt.compare(data.otpInput, userOTP.otp)
    console.log()
    await console.log(result)

    if (result == false) {
      console.log("user not found in otp verification")
      res.status(401).json({ "success": false, message: "uthentication required or failed" })
      throw new Error("unabel to find user ")

    }
    else {
      //============== saving user data and sendin to the dashbord by the EJS ===============
      saveUser(req,res)
async function saveUser(req, res) {
  try {
    const data = req.body;

    // Hash the password
    const hash = await bcrypt.hash(data.password, 8);

    // Check if user already exists
    let user = await userdata.findOne({ email: data.email });

    if (user) {
      // Update existing user
      await userdata.updateOne(
        { email: data.email }, // filter
        {
          $set: {
            fullName: data.fullName,
            Username: data.username,
            phone: data.phone,
            password: hash,
          },
        }
      );
      return res.status(200).json({ success: true, message: "User updated" });
    } else {
      // Create new user
      const newUser = await userdata.create({
        fullName: data.fullName,
        Username: data.username,
        email: data.email,
        phone: data.phone,
        password: hash,
      });
      console.log("New user credential saved:", newUser);
      return res.status(200).json({ success: true, message: "User created" });
    }
  } catch (err) {
    console.error("Error in saving user:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Unexpected server error" });
  }
}
    }
}
  catch {
    console.log("user not found in otp verification")
  }
  finally {
    try {
      if (await temp_otp.deleteOne({ email: data.email })) {
        console.log("user credential are deleted by the section completion")
      }
      else {
        throw new Error("unable to delete user credential after the active section")
      }
    }
    catch (err) {
      console.log("Error:", err.message)
    }
  }

})

//================================================== API login =========================================================
app.post("/", (req, res) => {

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
