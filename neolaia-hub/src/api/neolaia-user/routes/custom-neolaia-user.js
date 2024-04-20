module.exports = {
    routes: [
        {
            method: 'POST',
            path: '/neolaia-usr/create',
            handler: 'custom-neolaia-user.create',
            config: {
                auth: false,
            }
        }
    ]
}