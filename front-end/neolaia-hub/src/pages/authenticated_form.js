import { useContext, useEffect, useState } from "react"; 
import { AuthContext } from "../components/AuthContext";
import Auth from "../components/auth";
import {token_is_valid, check_if_alredy_compiled} from "../utils"
import MappingResearchers from "../forms/mapping_researchers";
import PrivacyMessageResearchersMapping from "../components/privacy_policy_researchers_mapping"; 
import AcceptPolicyMessage from "../components/accept_policy_message_researchers_mapping";
import PrivacyPolicy from "../components/privacy_policy";
import ModifyDeleteForm from "../components/modify_delete_modal";


function AuthenticatedForm(){
    const { token, loading} = useContext(AuthContext);  
    const [form, setForm] = useState(null);
    const [token_validity, setTokenValidity] = useState(false)

    const check_if_compiled = async () => {
        try{
            //check if form is already compiled
            const result = await check_if_alredy_compiled(token)
            if(result === true){
                setForm(<ModifyDeleteForm token={token}/>)
            }
        }catch (error){
            console.error('Error: ',error)
            }
    }

    useEffect(() => {
        if (loading){
            return 
        }
        //check on the client side if the token is expired
        setTokenValidity(token_is_valid())

        if(token && token_validity){
            check_if_compiled()
            //insert here the form component to render after login
            const form_component = (
                <MappingResearchers token={token}/>
            )
            setForm(form_component)
        }
    }, [loading, token, token_validity])
    

    return(
        <div>
            {loading && <p>Caricamento...</p>}
            {(!token || !token_validity) && <Auth privacy_message={<PrivacyMessageResearchersMapping />} accept_policy_message={<AcceptPolicyMessage />} privacy_policy={<PrivacyPolicy />} />}
            {token && form}
        </div>
    )
}

export default AuthenticatedForm;