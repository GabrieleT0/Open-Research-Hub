
module.exports = {
    routes: [
        {
            method: "POST",
            path: "/research-info-surveys/find-by-user/",
            handler: "research-info-survey.findByUser"
        },
        {
            method: "GET",
            path: "/research-info-surveys/search_keywords/",
            handler: "research-info-survey.search_keywords"   
        }
    ]
}