import 'survey-core/defaultV2.min.css';
import erc_panel from '../components/form_components/erc_panel.json';
import personal_info from '../components/form_components/personal_info.json';
import free_keywords from '../components/form_components/free_keywords.json';
import university_info from '../components/form_components/university_info.json';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';
import $ from "jquery";
import * as SurveyCore from "survey-core";
import { autocomplete } from "surveyjs-widgets";
import { base_url } from '../api';

window["$"] = window["jQuery"] = $;
require("easy-autocomplete/dist/jquery.easy-autocomplete.js");
autocomplete(SurveyCore);

const erc_panel_interest = JSON.parse(JSON.stringify(erc_panel));
erc_panel_interest.pages[0].elements[0].title = 'Indicate at most 3 ERC Panel and keyword which you are also interested in'

//To solve question already answered from the research are panel, rename all key 
erc_panel_interest.name = 'erc_panel_research_area_interested'
erc_panel_interest.pages[0].name= 'interested_research_area'
erc_panel_interest.pages[0].elements[0].name = 'ERC_panel_interested'
erc_panel_interest.pages[0].elements[0].isRequired = false
erc_panel_interest.pages[0].elements[0].templateElements[0].isRequired = false

personal_info.pages.push(university_info.pages[0])
personal_info.pages.push(erc_panel.pages[0])
personal_info.pages.push(erc_panel_interest.pages[0])
personal_info.pages.push(free_keywords.pages[0])


function MappingResearchers({token}){
    const research_survey = new Model(personal_info)
    //Function executed when the survey is submitted
    research_survey.onComplete.add( function (sender, options){
        options.showSaveInProgress();
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${base_url}research-info-surveys/`)
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
        xhr.onload = xhr.onerror = function () {
            if (xhr.status === 200){
                options.showSaveSuccess("Thank you.");
                research_survey.completedHtml = 'Thank you for completing the survey <br> <a href="./researchersfeedback">Share your feedback with a very short 1 minute form</a>'
            } else {
                options.showSaveError("Error during survey submission, try again.")
            }
        };
        const survey_data = JSON.stringify(sender.data)
        const data = {
            survey_data : survey_data,
            token : token
        }
        xhr.send(JSON.stringify(data));
    })
    return <Survey model={research_survey} />
}

export default MappingResearchers;