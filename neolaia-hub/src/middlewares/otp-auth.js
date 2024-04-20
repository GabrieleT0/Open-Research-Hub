module.exports = (config, { strapi }) => {
    return async (ctx, next) =>{
        require('dotenv').config();
        const jwt = require('jsonwebtoken');
        const token = ctx.request.header.authorization.split(' ')[1];
        if (!token) return ctx.unauthorized("Access denied.");
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                ctx.request.email = decoded.email;
                ctx.request.user_id = decoded.user_id;
                return next();
            } catch (error) {
                ctx.unauthorized("This action is unauthorized.");
            }
    }
}
