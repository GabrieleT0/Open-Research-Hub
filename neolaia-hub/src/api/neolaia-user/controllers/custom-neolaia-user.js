const { randomBytes } = require("node:crypto");
const jwt = require('jsonwebtoken');
const { authMode, allowedEmail, proxySecretMatches, allowedShibbolethIdentity } = require('../services/auth-config');

module.exports = {
    async create(ctx, next){
        if (authMode() !== 'otp') return ctx.notFound();
        try{
            const otp = randomBytes(24 / 2).toString("hex");
            const email = allowedEmail(ctx.request.body?.email);
            if(!email)
                return ctx.badRequest("The page address must come from one of NEOLAiA's partner university domains", {email : "The page address must come from one of NEOLAiA's partner university domains"})
            const currentTimeStamp = new Date().getTime().toString();
            let entry;
            entry = await strapi.db.query('api::neolaia-user.neolaia-user').findOne({
                select: ['id', 'email'],
                where: {
                    email: { $eqi: email }
                }
            })
            if (entry){
                entry = await strapi.entityService.update("api::neolaia-user.neolaia-user", entry.id,{
                    data:{
                        OTP: otp,
                        otp_active: true,
                        otp_generation_timestamp: currentTimeStamp
                    }
                })
            } else {
                entry = await strapi.entityService.create("api::neolaia-user.neolaia-user", {
                    data:{
                        email: email,
                        OTP: otp,
                        otp_active: true,
                        otp_generation_timestamp: currentTimeStamp,
                    }
                })
            }
            await strapi.config.email_sender.send_mail(entry.email,entry.OTP)
            return ctx.response.created(entry)
        } catch (error){
            console.log(error)
            return ctx.response.internalServerError(error);
        }
    },
    async active(ctx, next){
        if (authMode() !== 'otp') return ctx.notFound();
        try{
            const email = allowedEmail(ctx.request.body?.email)
            const otp = ctx.request.body.otp
            let entry
            entry = await strapi.db.query('api::neolaia-user.neolaia-user').findOne({
                select: ['id', 'email'],
                where:{
                    email: { $eqi: email },
                    OTP : otp,
                    otp_active: true
                }
            })
            if (entry){
                entry = await strapi.entityService.update("api::neolaia-user.neolaia-user", entry.id,{
                    data:{
                        first_access: true, //in this way I can delete email from db that haven't done the first access
                        otp_active: false
                    }
                })
            } else {
                return ctx.response.unauthorized('You are not authorized to access this resource, you must authenticate yourself')
            }
            
            const token = jwt.sign({user_id: entry.id, email: entry.email, auth_source: 'otp'}, process.env.JWT_SECRET_CUSTOM_AUTH, {expiresIn: process.env.JWT_EXPIRES_CUSTOM_AUTH_IN})
            ctx.send({ token })
        


        } catch (error){
            ctx.response.internalServerError(error)
        }
    },
    async authConfig(ctx) {
        ctx.set('Cache-Control', 'no-store');
        ctx.send({
            mode: authMode(),
            shibbolethLoginUrl: process.env.SHIBBOLETH_LOGIN_URL || null,
        });
    },
    async shibbolethLogin(ctx) {
        if (authMode() !== 'shibboleth') return ctx.notFound();
        ctx.set('Cache-Control', 'no-store');
        // Apache must remove incoming identity headers and set these only after a
        // successful Shibboleth session. The shared secret protects direct API access.
        if (!proxySecretMatches(ctx.get('X-Shibboleth-Proxy-Secret'))) return ctx.unauthorized();
        const email = allowedEmail(ctx.get('X-Shibboleth-Email'));
        if (!email) return ctx.forbidden('An institutional email address was not released by your identity provider.');
        if (!allowedShibbolethIdentity(ctx.get('X-Shibboleth-IdP'), email)) {
            return ctx.forbidden('The identity provider is not authorized for this email domain.');
        }

        const returnUrl = process.env.SHIBBOLETH_RETURN_URL;
        if (!returnUrl) return ctx.internalServerError('SHIBBOLETH_RETURN_URL is not configured');
        let target;
        try {
            target = new URL(returnUrl);
            if (target.protocol !== 'https:' && !(process.env.NODE_ENV !== 'production' && target.hostname === 'localhost')) {
                throw new Error('Invalid return URL');
            }
        } catch (_) {
            return ctx.internalServerError('SHIBBOLETH_RETURN_URL must be an absolute HTTPS URL');
        }

        try {
            let user = await strapi.db.query('api::neolaia-user.neolaia-user').findOne({
                select: ['id', 'email'], where: { email: { $eqi: email } },
            });
            if (!user) {
                user = await strapi.entityService.create('api::neolaia-user.neolaia-user', {
                    data: { email, first_access: true, otp_active: false },
                });
            }
            const token = jwt.sign(
                { user_id: user.id, email: user.email, auth_source: 'shibboleth' },
                process.env.JWT_SECRET_CUSTOM_AUTH,
                { expiresIn: process.env.JWT_EXPIRES_CUSTOM_AUTH_IN },
            );
            target.hash = `shibboleth_token=${encodeURIComponent(token)}`;
            ctx.redirect(target.toString());
        } catch (error) {
            strapi.log.error('Shibboleth login failed', error);
            return ctx.internalServerError('Could not complete login');
        }
    },
    async find(ctx, next){
        try{
            const { email } = ctx.query;
            
            const entries = await strapi.entityService.findMany("api::neolaia-user.neolaia-user", {
                fields: ['id', 'email'],
                filters: {
                    email: email
                },
                limit: 1
            });

            if (entries && entries.length > 0){
                const user = entries[0]; 
                
                const submissions = await strapi.entityService.findMany("api::research-info-survey.research-info-survey", {
                    fields: ['user_id', 'name', 'surname', 'university_name', 'department', 'faculty', 'orcid_link', 'research_group_link', 'personal_page_link', 'research_units_tours', 'specific_research_units_tours'],
                    filters: {
                        user_id: user.id
                    },
                    limit: 1
                });
                console.log(submissions)
                if (submissions && submissions.length > 0){
                    return ctx.send({ 
                        user_id: user.id,
                        user_name: submissions[0].name, 
                        user_surname: submissions[0].surname,
                        university_name: submissions[0].university_name,
                        department_name: submissions[0].department,
                        faculty_name: submissions[0].faculty,
                        orcid_link: submissions[0].orcid_link,
                        research_group_link: submissions[0].research_group_link,
                        personal_page_link: submissions[0].personal_page_link,
                        research_units_tours: submissions[0].research_units_tours,
                        specific_research_units_tours: submissions[0].specific_research_units_tours
                    });
                } else {
                    return ctx.notFound('No submission info found for this user');
                }
            } else {
                return ctx.notFound('No user found with this email');
            }
        } catch (error){
            console.log(error);
            return ctx.internalServerError(error.message);
        }
    }
}
