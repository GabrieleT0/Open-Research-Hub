import React, { useState, useContext } from "react";
import axios from 'axios';
import { base_url } from '../api';
import { AuthContext } from "./AuthContext";
import EmailForm from "./email_form";
import OTPForm from "./OTP_form";


const Auth = ({privacy_message,accept_policy_message, privacy_policy}) => {
    const [email, setEmail] = useState("");
    const [error_message, setErrorMessage] = useState(null)
    const { setToken, authMode, authError, loading, shibbolethLoginUrl } = useContext(AuthContext)

    const handle_email_submit = async (email) => {
        setEmail(email)
        try {
            const response = await axios.post(`${base_url}neolaia-usr/create`,{
                email,
            });
        setEmail(response.data.email)
        } catch (error){
            console.error("Authentication failed:", error)
            setToken(null);
            localStorage.removeItem("token")
            if( error.response && error.response.data){
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.")
            }
        }
    }
    
    const handle_authentication = async (otp) => {
        try {
            const response = await axios.post(`${base_url}neolaia-usr/active`,{
                email,
                otp,
            });
            setToken(response.data.token)
            localStorage.setItem("token", response.data.token);
        } catch (error){
            console.error("Authentication failed:", error)
            setToken(null);
            localStorage.removeItem("token")
            if( error.response && error.response.data){
                setErrorMessage(error.response.data);
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.")
            }
        }
    }


    return(
        <div>
            {authError && <p role="alert">{authError}</p>}
            {!loading && authMode === 'shibboleth' && <ShibbolethLogin loginUrl={shibbolethLoginUrl} privacy_message={privacy_message} accept_policy_message={accept_policy_message} privacy_policy={privacy_policy} />}
            {!loading && authMode === 'otp' && !email && <EmailForm onNext={handle_email_submit} privacy_policy={privacy_message} accept_policy_message={accept_policy_message} policy_message={privacy_policy}/>}
            {!loading && authMode === 'otp' && email && <OTPForm onAuthenticate={handle_authentication} />}
            {error_message && <p role="alert">Authentication failed. Please try again.</p>}
        </div>
    )

}
function ShibbolethLogin({ loginUrl, privacy_message, accept_policy_message, privacy_policy }) {
    const [openDataAccepted, setOpenDataAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showError, setShowError] = useState(false);
    const login = (event) => {
        event.preventDefault();
        if (!openDataAccepted || !privacyAccepted) return setShowError(true);
        window.location.assign(loginUrl);
    };
    return <form id="shibboleth-form" onSubmit={login}>
        {privacy_message}
        <div className="shibboleth-policy-options">
            <label><input type="checkbox" checked={openDataAccepted} onChange={event => setOpenDataAccepted(event.target.checked)} />{accept_policy_message}</label>
            <label><input type="checkbox" checked={privacyAccepted} onChange={event => setPrivacyAccepted(event.target.checked)} />{privacy_policy}</label>
        </div>
        {showError && <p role="alert">Please accept both policies to continue.</p>}
        <button className="shibboleth-login-button" type="submit">Sign in with your university (eduGAIN)</button>
    </form>;
}
export default Auth;
