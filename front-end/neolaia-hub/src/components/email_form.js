import React, { useState } from 'react';

const EmailForm = ( {onNext} ) => {
    const [email, setEmail] = useState('');

    const handle_submit = (e) => {
        e.preventDefault();

        //TODO: validate mail
        
        onNext(email);
    };

    return (
        <form onSubmit={handle_submit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Send me the OTP</button>
      </form>
    )
}

export default EmailForm;