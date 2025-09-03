
//============================ FN for OTP generation ================================================
export async function generateOTP(data) {
  try {
    const response = await fetch('/generate-otp', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error("Failed to generate OTP");
    else {
      console.log("otp generation works")
    }
    return response.json();
  }
  catch (err) {
    console.error(err)
  }

}

//================ Fn for resend opt ====================
export async function resendOtp(data) {
  return generateOTP(data)
}

//==================================================== Fn for otp verification ============================
export async function verifyOtp(data) {
  const response = await fetch('/verify-otp', {
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
export let registerUser = null
//====================== ============================
export async function login(data) {
  const response = await fetch('/login', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
const result = await response.json(); 
if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }
  return result;
}

