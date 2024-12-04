import React, { useState } from 'react';

const EmailForm = ( {onNext, privacy_policy, accept_policy_message, policy_message} ) => {
    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isPolicyAccepted, setIsPolicyAccepted] = useState(false);
    const [policyMessage,setPolicyMessage] = useState('')
    const [isSecondPolicyAccepted, setIsSecondPolicyAccepted] = useState(false);
    const [secondPolicyMessage,setSecondPolicyMessage] = useState('')

    const handle_submit = (e) => {
        e.preventDefault();
        const regex = /\b[A-Za-z0-9._%+-]+@.*?(osu\.cz|usv\.ro|usm\.ro|unic\.ac\.cy|oru\.se|svako\.lt|ujaen\.es|univ-tours\.fr|uni-bielefeld\.de|unisa\.it|osu\.eu)\b/;
        if(isPolicyAccepted === false){
            const policy_error = <span style={{color:"red"}}>You must agree that your information will be published as OPEN DATA (except for the email address)</span>
            setPolicyMessage(policy_error)
        } else {
            setPolicyMessage('')
        }
        if(isSecondPolicyAccepted === false){
            const policy_error = <span style={{color:"red"}}>You must accept the privacy policy in order to continue</span>
            setSecondPolicyMessage(policy_error)
        } else {
            setSecondPolicyMessage('')
        }
        if(regex.test(email)){
            setIsValid(true)
            
        }else{
            setIsValid(false)

            return
        }
        if(isValid === true && isPolicyAccepted === true && isSecondPolicyAccepted == true)
            onNext(email);
    };

    return (
        <form onSubmit={handle_submit} id='email-form'>
            {privacy_policy}
            <div style={{ textAlign: "left", marginLeft: "20px"}}>
                <label style={{ display: "block", marginBottom: "10px" }}>
                    <input
                        type="checkbox"
                        checked={isPolicyAccepted}
                        onChange={(e) => setIsPolicyAccepted(e.target.checked)}
                    />
                    {accept_policy_message}
                </label>
                {policyMessage && <div>{policyMessage}</div>}

                <label style={{ display: "block", marginBottom: "10px" }}>
                    <input
                        type="checkbox"
                        checked={isSecondPolicyAccepted}
                        onChange={(e) => setIsSecondPolicyAccepted(e.target.checked)}
                    />
                    {policy_message}
                </label>
                {secondPolicyMessage && <div>{secondPolicyMessage}</div>}
            </div>
            <br />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Insert your email'
                id='input-mail'
                style={{ margin: "10px 0" }}
            />
            <br/>
            {!isValid && <><span style={{ color: "red" }}>Invalid e-mail</span><br /></>}
            <button type="submit" id='send-otp-btn'>Send me the OTP</button>
        </form>
    );
};

export default EmailForm;