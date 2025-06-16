import fp from 'fastify-plugin';

export default fp(async function googleOAuth(fastify: any) {
	await fastify.register(require('@fastify/oauth2'), {
		name: 'googleOAuth2',
		credentials: {
			client: {
				id: process.env.GOOGLE_CLIENT_ID as string,
				secret: process.env.GOOGLE_CLIENT_SECRET as string,
			},
			auth: fastify.oauth2.GOOGLE_CONFIGURATION,
		},
		startRedirectPath: '/auth/google',
		callbackUri: process.env.GOOGLE_REDIRECT_URI as string,
		scope: ['openid', 'profile', 'email']
	});
});