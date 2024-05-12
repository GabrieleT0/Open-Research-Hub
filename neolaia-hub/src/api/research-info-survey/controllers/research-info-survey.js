'use strict';

/**
 * research-info-survey controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::research-info-survey.research-info-survey', ({strapi}) => ({
    async findByUser(ctx, next){
        const user_id = ctx.request.body.data.user_id
        let entry;
        entry = await strapi.db.query('api::research-info-survey.research-info-survey').findOne({
            user_id : user_id
        })
        if(entry){
            return entry
        } else {
            return ctx.badRequest("You haven't filled out the form yet");
        }
    },

    async search_keywords(ctx, next){
        let { rows } = await strapi.db.connection.raw(`
        SELECT matched_keyword, COUNT(*) AS occurrences
        FROM (
            SELECT free_keyword_1 AS matched_keyword FROM research_info_surveys
            UNION ALL
            SELECT free_keyword_2 AS matched_keyword FROM research_info_surveys
            UNION ALL
            SELECT free_keyword_3 AS matched_keyword FROM research_info_surveys
        ) AS keywords
        WHERE matched_keyword IS NOT NULL
        GROUP BY matched_keyword;
        `
        )
        for(let i = 0; i<rows.length; i++){
            rows[i]['display_value'] = rows[i]['matched_keyword'] + ' (' + rows[i]['occurrences'] + ')'
        }
            
        return rows
    }
}))
