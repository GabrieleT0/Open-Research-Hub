import React, { useState } from 'react';

const EmailForm = ( {onNext} ) => {
    const [email, setEmail] = useState('');

    const handle_submit = (e) => {
        e.preventDefault();

        //TODO: validate mail
        
        onNext(email);
    };

    return (
        <form onSubmit={handle_submit} id='email-form'>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Insert your email' id='input-mail'/>
            <br></br>
            <button type="submit" id='send-otp-btn'>Send me the OTP</button>
      </form>
    )
}

export default EmailForm;