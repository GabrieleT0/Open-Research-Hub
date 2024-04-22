import { useContext, useEffect, useState } from "react"; 
import { AuthContext } from "../components/AuthContext";
import Auth from "../components/auth";

function AuthenticatedForm(){
    const { token, loading} = useContext(AuthContext);  
    const [form, setForm] = useState(null);

    useEffect(() => {
        if (loading){
            return 
        }

        if(token){
            const form_component = (
                <p>Compila il form</p>
            )
            setForm(form_component)
        }
    }, [loading, token])
    

    return(
        <div>
            {loading && <p>Caricamento...</p>}
            {!token && <Auth />}
            {token && form}
        </div>
    )
}

export default AuthenticatedForm;