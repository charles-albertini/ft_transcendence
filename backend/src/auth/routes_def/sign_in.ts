import { FastifyRequest, FastifyReply } from 'fastify'
import bcrypt from 'bcryptjs'
import { User } from '../../db_models/user_model'

export async function sign_in(request: FastifyRequest, reply:FastifyReply) {
	const { email, password } = request.body as {
		email: string;
		password: string;
	};

	try {
		const user = await User.findOne({ where: { email_adress: email } })
		if (!user) {
		  return reply.code(404).send({ error: 'User not found' })
		}

		const isPasswordValid = await bcrypt.compare(password, user.hashed_password)
		if (!isPasswordValid) {
		  return reply.code(400).send({ error: 'Invalid password' })
		}

		if(user.twoFA) {
			const tmp_token = await reply.jwtSign({
				username: user.username,
				user_id: user.user_id,
				twoFA: true }, { expiresIn: '2m' });
			return reply.code(200).send({ 
				requires2FA: true,
				tmpToken: tmp_token,
				message: '2FA verification required'
			})
		}

		const token = await reply.jwtSign({ username: user.username, user_id: user.user_id }, { expiresIn: '15min'})
		const refreshToken = await reply.jwtSign({ username: user.username, user_id: user.user_id }, { expiresIn: '7d' })

		if (!token || !refreshToken) {
			return reply.code(500).send({ error: 'Failed to generate tokens' })
		}

		const userData = {
			username: user.username,
			email: user.email_adress,
			userId: user.user_id,
			avatar: user.avatar,
			stats: {
				matches: user.number_of_matches,
				wins: user.number_of_win,
				losses: user.number_of_lose
			}
		}
		
		return reply.code(200).send({ token: token, refreshToken, user: userData })
	}
	catch (error) 
	{
		console.error('Error during sign-in:', error)
		return reply.code(500).send({ error: 'Internal server error' })
	}
}