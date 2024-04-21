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
    }
})
)
