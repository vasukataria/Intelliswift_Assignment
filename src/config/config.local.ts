export const dynamicConfig = {
    version: '1.0.0',
    swaggerDefinition: {
        basePath: '/api',
        info: {
            description: 'Intelliswift Swagger',
            title: 'Intelliswift',
        },
        securityDefinitions: {
            Bearer: {
                in: 'header',
                name: 'Authorization',
                type: 'apiKey',
            },
        },
    },
    swaggerUrl: '/api-docs',
    authProvider: {
        authorization: {
            rules: []
        },
    },
};
