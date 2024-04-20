'use strict';
/**
 * neolaia-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::neolaia-user.neolaia-user', ({strapi}) => ({
    async find(ctx){
        console.log(ctx)
    },
    async find2(ctx){
        console.log('ciao')
    }
}))
