module.exports = {
    routes: [
        {
            method: 'GET', path: '/neolaia-usr/auth-config',
            handler: 'custom-neolaia-user.authConfig', config: { auth: false }
        },
        {
            method: 'GET', path: '/neolaia-usr/shibboleth/login',
            handler: 'custom-neolaia-user.shibbolethLogin', config: { auth: false }
        },
        {
            method: 'POST',
            path: '/neolaia-usr/create',
            handler: 'custom-neolaia-user.create',
            config: {
                auth: false,
            }
        },
        {
            method: 'POST',
            path: '/neolaia-usr/active',
            handler: 'custom-neolaia-user.active',
            config: {
                auth: false,
            }
        },
         {
            method: 'GET',
            path: '/neolaia-usr/',
            handler: 'custom-neolaia-user.find',
            config: {
                auth: false,
            }
        } 

    ]
}
