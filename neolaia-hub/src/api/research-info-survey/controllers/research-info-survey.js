'use strict';

const { default: strapiFactory } = require('@strapi/strapi');
const { push } = require('../../../../config/middlewares');

/**
 * research-info-survey controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::research-info-survey.research-info-survey', ({strapi}) => ({
    async findByUser(ctx, next){
        const user_id = ctx.request.body.data.user_id
        let entry;
        entry = await strapi.db.query('api::research-info-survey.research-info-survey').findOne({
            where: {
                user_id : user_id
            }
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
    },

    async count_submission(ctx, next){
        let {rows}  = await strapi.db.connection.raw(`
            SELECT COUNT(*) as num_submission
            FROM research_info_surveys;
        `
        )

        return rows[0].num_submission
    },
    
    async count_submission_by_uni(ctx, next){
        let {rows} = await strapi.db.connection.raw( `
            SELECT university_name, COUNT(*) as num_submission
            FROM research_info_surveys
            GROUP BY university_name;
        `
        )
        
        return rows
    },

    async count_submission_by_erc_panel(ctx, next){
        let {rows : erc_panel_1} = await strapi.db.connection.raw( `
            SELECT ERC_Panel_1, COUNT(*) as num_submission
            FROM research_info_surveys
            GROUP BY ERC_Panel_1;
        `
        )

        let {rows : erc_panel_2} = await strapi.db.connection.raw( `
            SELECT ERC_Panel_2, COUNT(*) as num_submission
            FROM research_info_surveys
            GROUP BY ERC_Panel_2;
        `
        )

        let {rows : erc_panel_3} = await strapi.db.connection.raw( `
            SELECT ERC_Panel_3, COUNT(*) as num_submission
            FROM research_info_surveys
            GROUP BY ERC_Panel_3;
        `
        )
        let new_list = erc_panel_1.concat(erc_panel_2)
        new_list = new_list.concat(erc_panel_3)
        
        return new_list
    },

    async get_free_keywords(ctx, next){
        let {rows : free_keyword_1} = await strapi.db.connection.raw(`
            SELECT free_keyword_1
            FROM research_info_surveys
        `)

        let {rows : free_keyword_2} = await strapi.db.connection.raw(`
            SELECT free_keyword_2
            FROM research_info_surveys
        `)

        let {rows : free_keyword_3} = await strapi.db.connection.raw(`
            SELECT free_keyword_3
            FROM research_info_surveys
        `)
        
        let new_list = free_keyword_1.concat(free_keyword_2)
        new_list = new_list.concat(free_keyword_3)

        const values = new_list.map(obj => {
            return Object.values(obj)[0];
        })

        return values
    },

    async count_by_departmens(ctx, next){
        let {rows} = await strapi.db.connection.raw(`
            SELECT university_name, department, COUNT(*) AS occurrences
            FROM research_info_surveys
            GROUP BY university_name, department
            ORDER BY university_name, department;
        `)

        return rows
    },

    async count_by_faculties(ctx, next){
        let {rows} = await strapi.db.connection.raw(`
            SELECT department, faculty, COUNT(*) AS occurrences
            FROM research_info_surveys
            GROUP BY department, faculty
            ORDER BY department, faculty;
        `)

        return rows
    },

    async count_by_research_units(ctx, next){
        let {rows} = await strapi.db.connection.raw(`
            SELECT university_name, research_units_tours, COUNT(*) AS occurrences
            FROM research_info_surveys
            WHERE university_name = 'University of Tours'
            GROUP BY university_name, research_units_tours
            ORDER BY university_name, research_units_tours;
        `)

        return rows
    },

    async count_by_specific_units(ctx, next){
        let {rows} = await strapi.db.connection.raw(`
            SELECT research_units_tours, specific_research_units_tours, COUNT(*) AS occurrences
            FROM research_info_surveys
            WHERE university_name = 'University of Tours'
            GROUP BY research_units_tours, specific_research_units_tours
            ORDER BY research_units_tours, specific_research_units_tours;
        `)

        return rows
    },

    async check_if_compiled(ctx,next){
        const user_id = ctx.request.body.data.user_id
        let entry;
        entry = await strapi.db.query('api::research-info-survey.research-info-survey').findOne({
            where: {
                user_id : user_id
            }
        })
        if(entry){
            const result ={
                result: true
            }
            return result
        } else {
            const result ={
                result: false
            }
            return result
        }
    },

    async delete_submission(ctx,next){
        const user_id = ctx.request.body.data.user_id
        let entry;
        entry =  await strapi.db.query('api::research-info-survey.research-info-survey').delete({
            where: { user_id: user_id },
        });

        if(entry){
            return entry
        } else {
            ctx.status = 400
            ctx.body = {error: 'Data not found'}
            return
        }
    },

    async find_researchers(ctx,next){
        const university = ctx.request.body.searchParams.university
        const first_level_str = ctx.request.body.searchParams.department
        const second_level_str = ctx.request.body.searchParams.faculty
        const research_unit_tours = ctx.request.body.searchParams.research_unit_tours
        const specific_unit_tours = ctx.request.body.searchParams.specific_unit_tours
        const erc_area = ctx.request.body.searchParams.erc_area
        const erc_panel = ctx.request.body.searchParams.erc_panel
        const erc_keyword = ctx.request.body.searchParams.erc_keyword
        const erc_area_int = ctx.request.body.searchParams.erc_area_int
        const erc_panel_int = ctx.request.body.searchParams.erc_panel_int
        const erc_keyword_int = ctx.request.body.searchParams.erc_keyword_int
        const researcher_name = ctx.request.body.searchParams.researcher_name ? ctx.request.body.searchParams.researcher_name.trim() : '';
        const researcher_surname = ctx.request.body.searchParams.researcher_surname ? ctx.request.body.searchParams.researcher_surname.trim() : '';
        const free_keywords = ctx.request.body.keywords
        const filters = { $and: [] };

        console.log(ctx.request.body.searchParams)

            // Filter for researcher name and surname
        if (researcher_name) {
            filters.$and.push({ name: { $containsi: researcher_name } });
        }
        if (researcher_surname) {
            filters.$and.push({ surname: { $containsi: researcher_surname } });
        }

        // Filter for free keywords
        if (free_keywords.length > 0) {
            filters.$and.push({
                $or: free_keywords.map(keyword => ({
                    $or: [
                        { free_keyword_1: { $containsi: keyword } },
                        { free_keyword_2: { $containsi: keyword } },
                        { free_keyword_3: { $containsi: keyword } }
                    ]
                }))
            });
        }

        // Other filters
        if (university) filters.$and.push({ university_name: university });
        if (first_level_str) filters.$and.push({ department: first_level_str });
        if (second_level_str) filters.$and.push({ faculty: second_level_str });
        if (research_unit_tours) filters.$and.push({ research_units_tours: research_unit_tours });
        if (specific_unit_tours) filters.$and.push({ specific_research_units_tours: specific_unit_tours });

        // ERC Area
        if (erc_area) {
            const abbr = erc_area.split('(')[1].replace(')', '');
            filters.$and.push({
                $or: [
                    { ERC_Panel_1: { $startsWith: abbr } },
                    { ERC_Panel_2: { $startsWith: abbr } },
                    { ERC_Panel_3: { $startsWith: abbr } }
                ]
            });
        }

        // ERC Panel
        if (erc_panel) {
            filters.$and.push({
                $or: [
                    { ERC_Panel_1: erc_panel },
                    { ERC_Panel_2: erc_panel },
                    { ERC_Panel_3: erc_panel }
                ]
            });
        }

        // ERC Keyword
        if (erc_keyword) {
            filters.$and.push({
                $or: [
                    { ERC_Keyword_1: erc_keyword },
                    { ERC_Keyword_2: erc_keyword },
                    { ERC_Keyword_3: erc_keyword }
                ]
            });
        }

        // ERC Area Interested
        if (erc_area_int) {
            const abbr = erc_area_int.split('(')[1].replace(')', '');
            filters.$and.push({
                $or: [
                    { ERC_Panel_interested_1: { $startsWith: abbr } },
                    { ERC_Panel_interested_2: { $startsWith: abbr } },
                    { ERC_Panel_interested_3: { $startsWith: abbr } }
                ]
            });
        }

        // ERC Panel Interested
        if (erc_panel_int) {
            filters.$and.push({
                $or: [
                    { ERC_Panel_interested_1: erc_panel_int },
                    { ERC_Panel_interested_2: erc_panel_int },
                    { ERC_Panel_interested_3: erc_panel_int }
                ]
            });
        }

        // ERC Keyword Interested
        if (erc_keyword_int) {
            filters.$and.push({
                $or: [
                    { ERC_Keyword_interested_1: erc_keyword_int },
                    { ERC_Keyword_interested_2: erc_keyword_int },
                    { ERC_Keyword_interested_3: erc_keyword_int }
                ]
            });
        }

        console.log(filters);

        const result = await strapi.db.query('api::research-info-survey.research-info-survey').findMany({
            where: filters
        });

        return result

        /*
        let query = 'SELECT * FROM research_info_surveys WHERE 1=1'
        const params = []

        if(researcher_name){
            query += ' AND name ILIKE $' + (params.length + 1)
            params.push(`%${researcher_name}%`);
        }

        if(free_keywords.length > 0){
            free_keywords.map((keyword) => {
                query+= ` AND (free_keyword_1 ILIKE $${params.length + 1} OR free_keyword_2 ILIKE $${params.length + 1} OR free_keyword_3 ILIKE $${params.length + 1})`
                params.push(`%${keyword}%`)
            })
        }

        if(university){
            query += ' AND university_name = $' + (params.length + 1)
            params.push(university)
        }

        if(first_level_str){
            query += ' AND department = $' + (params.length + 1)
            params.push(first_level_str)
        }

        if(second_level_str){
            query += ' AND faculty = $' + (params.length + 1)
            params.push(second_level_str)
        }

        if(erc_area){
            let abbr = erc_area.split(' ')[0]
            abbr = abbr.replace('(','')
            abbr = abbr.replace(')','')
            query += ` AND (ERC_Panel_1 LIKE $${params.length + 1}% OR ERC_Panel_2 LIKE $${params.length + 1} OR ERC_Panel_2 LIKE $${params.length + 1}%)`
            params.push(abbr)
        }

        if(erc_panel){
            query += ` AND (ERC_Panel_1 = $${params.length + 1} OR ERC_Panel_2 = $${params.length + 1} OR ERC_Panel_3 = $${params.length + 1})`
            params.push(erc_panel)
        }

        if(erc_keyword){
            query += ` AND (ERC_Keyword_1 = $${params.length + 1} OR ERC_Keyword_2 = $${params.length + 1} OR ERC_Keyword_3 = $${params.length + 1})`
            params.push(erc_keyword)
        }
    */
}
}))