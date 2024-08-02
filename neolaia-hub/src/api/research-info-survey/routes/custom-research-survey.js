const middlewares = require("../../../../config/middlewares");

module.exports = {
    routes: [
        {
            method: "POST",
            path: "/research-info-surveys/find-by-user/",
            handler: "research-info-survey.findByUser",
            config:{
                middlewares: ["global::otp-auth"]
            }
        },
        {
            method: "GET",
            path: "/research-info-surveys/search_keywords/",
            handler: "research-info-survey.search_keywords"   
        },
        {
            method: "GET",
            path : "/research-info-surveys/count_submission/",
            handler: "research-info-survey.count_submission"
        },
        {
            method: "GET",
            path : "/research-info-surveys/count_submission_by_uni/",
            handler: "research-info-survey.count_submission_by_uni"
        },
        {
            method: "GET",
            path : "/research-info-surveys/count_submission_by_erc_panel/",
            handler: "research-info-survey.count_submission_by_erc_panel"
        },
        {
            method: "GET",
            path : "/research-info-surveys/get_free_keywords/",
            handler: "research-info-survey.get_free_keywords"
        },
        {
            method: "GET",
            path : "/research-info-surveys/count_by_departmens/",
            handler: "research-info-survey.count_by_departmens"
        },
        {
            method: "GET",
            path : "/research-info-surveys/count_by_faculties/",
            handler: "research-info-survey.count_by_faculties"
        },
        {
            method: "GET",
            path : "/research-info-surveys/count_by_research_units/",
            handler: "research-info-survey.count_by_research_units"
        },
        {
            method: "GET",
            path : "/research-info-surveys/count_by_specific_units/",
            handler: "research-info-survey.count_by_specific_units"
        },
        {
            method: "POST",
            path : "/research-info-surveys/check_if_compiled/",
            handler: "research-info-survey.check_if_compiled",
            config:{
                middlewares: ["global::otp-auth"]
            }
        },
        {
            method: "POST",
            path : "/research-info-surveys/delete_submission/",
            handler: "research-info-survey.delete_submission",
            config:{
                middlewares: ["global::otp-auth"]
            }
        },
        {
            method: "POST",
            path : "/research-info-surveys/search_researchers/",
            handler: "research-info-survey.find_researchers",
        },
    ]
}