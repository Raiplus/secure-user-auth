
//============================ FN for OTP generation ================================================
export async function generateOTP(data) {
  try{const response = await fetch('http://127.0.0.1:3000/generate-otp', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Failed to generate OTP");
  else{
    console.log("otp generation works")
  }
  return response.json();}
  catch(err){
    console.error(err)
  }
  
}

//================ Fn for resend opt ====================
export async function resendOtp(data) {
  return generateOTP(data)
}

//==================================================== Fn for otp verification ============================
export async function verifyOtp(data) {
  const response = await fetch('http://127.0.0.1:3000/verify-otp', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)  
  });
  if (!response.ok) throw new Error("Invalid OTP");
  
    else {
        // API for user registration
        console.log("OTP verified, proceed with registration");
    }
  
  return response.json();
}
//otp verification 
export let registerUser=null