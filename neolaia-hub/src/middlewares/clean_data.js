module.exports = (config, { strapi }) => {
    return async (ctx, next) =>{
        const survey_data = ctx.request.body.data
        let excludeKeys = ["name", "surname","free_keyword_1","free_keyword_2","free_keyword_3","orcid_link","research_group_link","personal_page_link","university_name","faculty","research_units_tours"];
        for(let key in survey_data){
            if (excludeKeys.includes(key)) {
                // If the keys is to exclude, jump the key
                continue;
            }
            if(typeof survey_data[key] === 'string'){
                survey_data[key] = survey_data[key].replace(/-/g, ' ').replace(/_(?!\d+).*/, '');
            }
        }

        return next()
    }
}