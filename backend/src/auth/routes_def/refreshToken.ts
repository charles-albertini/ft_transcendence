import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTpayload } from '../../interfaces';
import { User } from '../../db_models/user_model';

export async function refreshToken(request: FastifyRequest, reply: FastifyReply) {
	try {
		const decoded = request.user as JWTpayload;
    	const user = await User.findByPk(decoded.user_id);
    	if (!user) {
    	    return reply.status(400).send({ error: 'User no longer exists' });
    	}

		const newToken = await reply.jwtSign({ username: user.username, user_id: decoded.user_id }, { expiresIn: '15min' });
		if (!newToken) {
			return reply.status(500).send({ error: 'Failed to generate new token' });
		}

		return reply.status(200).send({ token: newToken });
	}
	catch (error) {
		console.error('Error refreshing token:', error);
		return reply.status(403).send({ error: 'Invalid or expired refresh token' });
	}
}