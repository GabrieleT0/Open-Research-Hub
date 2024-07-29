import { useContext, useEffect, useState } from "react"; 
import { useLocation } from 'react-router-dom';
import { AuthContext } from "../components/AuthContext";
import {token_is_valid, check_if_alredy_compiled} from "../utils"
import MappingResearchers from "../forms/mapping_researchers";
import Auth from "../components/auth";

function EditResearcher(){
    const { token, loading} = useContext(AuthContext);  
    const [form, setForm] = useState(null);
    const [token_validity, setTokenValidity] = useState(false)
    const location = useLocation();
    const researcher_data = location.state;

    useEffect(() => {
        if (loading){
            return 
        }
        //check on the client side if the token is expired
        setTokenValidity(token_is_valid())

        if(token && token_validity){
            //insert here the form component to render after login
            const form_component = (
                <MappingResearchers token={token} data={researcher_data}/>
            )
            setForm(form_component)
        }
    }, [loading, token, token_validity])
    

    return(
        <div>
            {loading && <p>Caricamento...</p>}
            {token && form}
        </div>
    )
}

export default EditResearcher;