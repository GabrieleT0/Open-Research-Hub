import React, { useState } from 'react';

const OTPForm = ({ onAuthenticate }) => {
    const [otp, setOTP] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = otp.trim()
        onAuthenticate(trimmed)
    }


    return(
        <form onSubmit={handleSubmit} id='otp-form'>
            <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} id='input-otp'/>
            <br></br>
            <button type="submit" id='login-btn'>Login</button>
      </form>
    )
}

export default OTPForm;