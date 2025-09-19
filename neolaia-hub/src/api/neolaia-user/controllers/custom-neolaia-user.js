const { randomBytes } = require("node:crypto");

module.exports = {
    async create(ctx, next){
        try{
            const otp = randomBytes(24 / 2).toString("hex");
            const email = ctx.request.body.email
            const regex = /\b[A-Za-z0-9._%+-]+@.*?(osu\.cz|usv\.ro|usm\.ro|unic\.ac\.cy|oru\.se|svako\.lt|ujaen\.es|univ-tours\.fr|uni-bielefeld\.de|unisa\.it|osu\.eu|inrae\.fr|cnrs\.fr|inserm\.fr|sumdu\.edu\.ua|kubg\.edu\.ua)\b/;
            if(!regex.test(email))
                return ctx.badRequest("The page address must come from one of NEOLAiA's partner university domains", {email : "The page address must come from one of NEOLAiA's partner university domains"})
            const currentTimeStamp = new Date().getTime().toString();
            let entry;
            entry = await strapi.db.query('api::neolaia-user.neolaia-user').findOne({
                select: ['id', 'email'],
                where: {
                    email: email
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
        const jwt = require('jsonwebtoken');
        try{
            const email = ctx.request.body.email
            const otp = ctx.request.body.otp
            let entry
            entry = await strapi.db.query('api::neolaia-user.neolaia-user').findOne({
                select: ['id', 'email'],
                where:{
                    email : email,
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
            
            const token = jwt.sign({user_id: entry.id, email: entry.email}, process.env.JWT_SECRET_CUSTOM_AUTH, {expiresIn: process.env.JWT_EXPIRES_CUSTOM_AUTH_IN})
            ctx.send({ token })
        


        } catch (error){
            ctx.response.internalServerError(error)
        }
    }
}