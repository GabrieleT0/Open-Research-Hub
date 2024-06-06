import 'survey-core/defaultV2.min.css';
import feedback_form from '../components/form_components/feedback_mapping_researchers.json';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import { base_url } from '../api';


function ResearchersFeedback(){
    const researchers_feedback = new Model(feedback_form)

    researchers_feedback.onComplete.add( function (sender, options){
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${base_url}researchers-survey-feedbacks/`)
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
        xhr.onload = xhr.onerror = function () {
            if (xhr.status === 200){
                options.showSaveSuccess("Thank you.");
            } else {
                options.showSaveError("Error during survey submission, try again.")
            }
        };
        const data = {
            data : sender.data
        }
        xhr.send(JSON.stringify(data));
    })
    return <Survey model={researchers_feedback} />
}

export default ResearchersFeedback;