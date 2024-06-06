import React, { useState } from 'react';

const EmailForm = ( {onNext} ) => {
    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(true)

    const handle_submit = (e) => {
        e.preventDefault();
        const regex = /\b[A-Za-z0-9._%+-]+@.*?(osu\.cz|usv\.ro|usm\.ro|unic\.ac\.cy|oru\.se|svako\.lt|ujaen\.es|univ-tours\.fr|uni-bielefeld\.de|unisa\.it)\b/;
        if(regex.test(email)){
            setIsValid(true)
            onNext(email);
        }else{
            setIsValid(false)
        }
    };

    return (
        <form onSubmit={handle_submit} id='email-form'>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Insert your email' id='input-mail'/>
            {!isValid && <p>Email non valida</p>}
            <br></br>
            <p>Privacy policy here</p>
            <button type="submit" id='send-otp-btn'>Send me the OTP</button>
      </form>
    )
}

export default EmailForm;