import { jwtDecode } from "jwt-decode";
import { decode } from "base-64";
import { base_url } from './api';
import axios from 'axios';
global.atob = decode;


function token_is_valid(){
    let token = localStorage.getItem('token');
    try{
        let decodedToken = jwtDecode(token)
        let currentDate = new Date();

        //token expired
        if (decodedToken.exp * 1000 < currentDate.getTime()){
            return false
        }
    }catch (error){
        console.log(error)
        return false
    }
    return true
}

async function check_if_alredy_compiled(token){
    try {
        const response = await axios.post(`${base_url}research-info-surveys/check_if_compiled/`,{
            token:token
        });
        const result = response.data.result

        return result
    } catch (error){
        console.error("Error:", error)
        if( error.response && error.response.data){
            return error.response.data
        } else {
            return "An unexpected error occurred. Please try again."
        }
    }
}

export {
    token_is_valid, 
    check_if_alredy_compiled,
};