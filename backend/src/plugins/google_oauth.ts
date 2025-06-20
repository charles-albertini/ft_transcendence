import fp from 'fastify-plugin';

export default fp(async function googleOAuth(fastify: any) {
    await fastify.register(require('@fastify/oauth2'), {
        name: 'googleOAuth2',
        credentials: {
            client: {
                id: process.env.GOOGLE_CLIENT_ID as string,
                secret: process.env.GOOGLE_CLIENT_SECRET as string,
            },
            auth: {
                authorizeHost: 'https://accounts.google.com',
                authorizePath: '/o/oauth2/v2/auth',
                tokenHost: 'https://oauth2.googleapis.com',
                tokenPath: '/token'
            }
        },
        startRedirectPath: '/auth/google',
        callbackUri: process.env.GOOGLE_REDIRECT_URI as string,
        scope: ['openid', 'profile', 'email']
    });
    
    // Log pour debug
    console.log('✅ Google OAuth plugin configured');
    console.log('🔗 Redirect URI:', process.env.GOOGLE_REDIRECT_URI);
    console.log('🆔 Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set');
});