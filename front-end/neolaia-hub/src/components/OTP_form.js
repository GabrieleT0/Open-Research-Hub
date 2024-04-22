import React, { useState } from 'react';

const OTPForm = ({ onAuthenticate }) => {
    const [otp, setOTP] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        onAuthenticate(otp)
    }


    return(
        <form onSubmit={handleSubmit}>
            <input type="text" value={otp} onChange={(e) => setOTP(e.target.value)} />
            <button type="submit">Login</button>
      </form>
    )
}

export default OTPForm;