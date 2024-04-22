import React, { useState, useContext } from "react";
import axios from 'axios';
import { base_url } from '../api';
import { AuthContext } from "./AuthContext";
import EmailForm from "./email_form";
import OTPForm from "./OTP_form";


const Auth = () => {
    const [email, setEmail] = useState("");
    const [otp, setOTP] = useState("");
    const [error_message, setErrorMessage] = useState(null)
    const { setToken } = useContext(AuthContext)

    const handle_email_submit = async (email) => {
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
            {!email && <EmailForm onNext={handle_email_submit} />}
            {email && <OTPForm onAuthenticate={handle_authentication} />}
        </div>
    )

}
export default Auth;