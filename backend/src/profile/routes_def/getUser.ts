import { Pub_User } from "../../interfaces";
import { User } from "../../db_models/user_model";
import { FastifyRequest, FastifyReply } from "fastify";

export async function getUser(request: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply) {
	try {
		const user = await User.findOne({ where: { username: request.params.username }, })

		if (!user) {
			return reply.status(404).send({ error: 'User not found' });
		}

		const Public: Pub_User = {
			username: user.username,
			email_adress: user.email_adress,
			number_of_matches: user.number_of_matches,
			number_of_win: user.number_of_win,
			number_of_lose: user.number_of_lose,
			ratio: user.number_of_win / (user.number_of_matches || 1),
			created_at: user.creation_date,
			updated_at: user.last_update,
			avatar: user.avatar,
			twoFA: user.twoFA
		};

		return reply.status(200).send(Public);
	} catch (error) {
		console.error('Error fetching user:', error);
		return reply.status(500).send({ error: 'Internal server error' });
	}
}