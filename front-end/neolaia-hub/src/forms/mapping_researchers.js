import 'survey-core/defaultV2.min.css';
import erc_panel from '../components/form_components/erc_panel.json';
import personal_info from '../components/form_components/personal_info.json';
import free_keywords from '../components/form_components/free_keywords.json';
import university_info from '../components/form_components/university_info.json';
import survey_theme from '../components/form_components/survey_theme.json'
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


function MappingResearchers({token, data}){
    const research_survey = new Model(personal_info)
    research_survey.applyTheme(survey_theme)

    //data is not undefined when researcher want to edit the data already submitted
    //pre-fill the form with all the old data submitted
    if(data){
        let erc_area_1 = ''
        if(data.ERC_Panel_1.includes('LS')){
            erc_area_1 = 'LS-Research area'
        } else if(data.ERC_Panel_1.includes('SH')){
            erc_area_1 = 'SH-Research-area'
        } else if (data.ERC_Panel_1.includes('PE'))
            erc_area_1 = 'PE-Research area'
        let erc_area_2 = ''
        if(data.ERC_Panel_2.includes('LS')){
            erc_area_2 = 'LS-Research area'
        } else if(data.ERC_Panel_2.includes('SH')){
            erc_area_2 = 'SH-Research-area'
        } else if (data.ERC_Panel_2.includes('PE'))
            erc_area_2 = 'PE-Research area'
        let erc_area_3 = ''
        if(data.ERC_Panel_3.includes('LS')){
            erc_area_3 = 'LS-Research area'
        } else if(data.ERC_Panel_3.includes('SH')){
            erc_area_3 = 'SH-Research-area'
        } else if (data.ERC_Panel_3.includes('PE'))
            erc_area_3 = 'PE-Research area'
        
        let erc_area_1_int = ''
        if(data.ERC_Panel_interested_1.includes('LS')){
            erc_area_1_int = 'LS-Research area'
        } else if(data.ERC_Panel_interested_1.includes('SH')){
            erc_area_1_int = 'SH-Research-area'
        } else if (data.ERC_Panel_interested_1.includes('PE'))
            erc_area_1 = 'PE-Research area'
        let erc_area_2_int = ''
        if(data.ERC_Panel_interested_2.includes('LS')){
            erc_area_2_int = 'LS-Research area'
        } else if(data.ERC_Panel_interested_2.includes('SH')){
            erc_area_2_int = 'SH-Research-area'
        } else if (data.ERC_Panel_interested_2.includes('PE'))
            erc_area_2_int = 'PE-Research area'
        let erc_area_3_int = ''
        if(data.ERC_Panel_interested_3.includes('LS')){
            erc_area_3_int = 'LS-Research area'
        } else if(data.ERC_Panel_interested_3.includes('SH')){
            erc_area_3_int = 'SH-Research-area'
        } else if (data.ERC_Panel_interested_3.includes('PE'))
            erc_area_3_int = 'PE-Research area'

        let department = ''
        let second_level = ''
        if(data.university_name.includes('Salerno')){
            department = data.department
        } else if (data.university_name.includes('Örebro')){
            department = `${data.department}_Orebro`
            second_level = `${data.faculty}`
        } else if (data.university_name.includes('Šiauliai')){
            department = `${data.department}_Siauliai`
            second_level = `${data.faculty}`
        } else if (data.university_name.includes('Nicosia')){
            department = `${data.department}_Nicosia`
            second_level = `${data.faculty}`
        } else if (data.university_name.includes('Suceava')){
            department = `${data.department}_Suceava`
            second_level = `${data.faculty}`
        } else if (data.university_name.includes('Bielefeld')){
            department = `${data.department}_Bielefeld`
            second_level = `${data.faculty}`
        } else if (data.university_name.includes('Jaén')){
            department = data.department
        } else if (data.university_name.includes('Ostrava')){
            department = `${data.department}_Ostrava`
            second_level = `${data.faculty}`
        } else if (data.university_name.includes('Tours')){
            department = `${data.department}_Tours`
            second_level = `${data.faculty}`
        } 
        research_survey.data = {
            "name" : data.name,
            "surname" : data.surname,
            "personal_page_link" : data.personal_page_link,
            "ORCID_link" : data.orcid_link,
            "research_group_link" : data.research_group_link,
            "university_name" : data.university_name,
            [data.university_name] : department,
            [department] : second_level, 
            "research_units_tours" : `${data.research_units_tours}`,
            [`${data.research_units_tours}`] : `${data.specific_research_units_tours}`,
            "free_keywords" : [
                {"free_keyword" : data.free_keyword_1},
                {"free_keyword" : data.free_keyword_2},
                {"free_keyword" : data.free_keyword_3}],
            "ERC_Panel" : [{
                "Research-General-Area" : erc_area_1,
                [erc_area_1] : data.ERC_Panel_1.replaceAll(' ','-'),
                [data.ERC_Panel_1.replaceAll(' ','-')] : data.ERC_Keyword_1
            },
            {
                "Research-General-Area" : erc_area_2,
                [erc_area_2] : data.ERC_Panel_2.replaceAll(' ','-'),
                [data.ERC_Panel_2.replaceAll(' ','-')] : data.ERC_Keyword_2
            },
            {
                "Research-General-Area" : erc_area_3,
                [erc_area_3] : data.ERC_Panel_3.replaceAll(' ','-'),
                [data.ERC_Panel_3.replaceAll(' ','-')] : data.ERC_Keyword_3
            }],
            "ERC_panel_interested" : [{
                "Research-General-Area" : erc_area_1_int,
                [erc_area_1_int] : data.ERC_Panel_interested_1.replaceAll(' ','-'),
                [data.ERC_Panel_interested_1.replaceAll(' ','-')] : data.ERC_Keyword_interested_1
            },
            {
                "Research-General-Area" : erc_area_2_int,
                [erc_area_2_int] : data.ERC_Panel_interested_2.replaceAll(' ','-'),
                [data.ERC_Panel_interested_2.replaceAll(' ','-')] : data.ERC_Keyword_interested_2
            },
            {
                "Research-General-Area" : erc_area_3_int,
                [erc_area_3_int] : data.ERC_Panel_interested_3.replaceAll(' ','-'),
                [data.ERC_Panel_interested_3.replaceAll(' ','-')] : data.ERC_Keyword_interested_3
            }]
        }
    }


    //Function executed when the survey is submitted
    research_survey.onComplete.add( function (sender, options){
        options.showSaveInProgress();
        const xhr = new XMLHttpRequest();
        let id_to_update = ''
        if (data){
            id_to_update = data.id
        }
        if(!data){
            xhr.open("POST", `${base_url}research-info-surveys/`)
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
            xhr.onload = xhr.onerror = function () {
                if (xhr.status === 200){
                    options.showSaveSuccess("Thank you.");
                    research_survey.completedHtml = '<h3> Thank you for completing the survey </h3> <br> <a href="./researchersfeedback"  style="color: white;">Share your feedback with a very short 1 minute form <b>(the form will be anonymous)</b></a>'
                } else {
                    options.showSaveError("Error during survey submission, try again.")
                }
            };
            const survey_data = JSON.stringify(sender.data)
            const data_to_send = {
                survey_data : survey_data,
                token : token
            }
            xhr.send(JSON.stringify(data_to_send));
        } else {
            xhr.open("PUT", `${base_url}research-info-surveys/${id_to_update}`)
            xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
            xhr.onload = xhr.onerror = function () {
                if (xhr.status === 200){
                    options.showSaveSuccess("Thank you.");
                    research_survey.completedHtml = '<h3>Thank you, your information has been updated!</h3> <br> <a href="http://data.neolaiacampus.eu/surveysDashboard/"  style="color: white;">Go to the dashboard</a>'
                } else {
                    options.showSaveError("Error during updating, try again.")
                }
            };
            const survey_data = JSON.stringify(sender.data)
            const data = {
                survey_data : survey_data,
                token : token
            }
            xhr.send(JSON.stringify(data));
        }
    })
    return <Survey model={research_survey} />
}

export default MappingResearchers;