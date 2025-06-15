import { User } from "../../db_models/user_model";
import { UserMatch } from "../../db_models/user_match_model";
import { Matches } from "../../db_models/matches_model";
import { FastifyRequest, FastifyReply } from "fastify";
import { Op } from "sequelize";

export async function getHistory(request: FastifyRequest<{ Params: { username: string } }>, reply: FastifyReply) {
	try {
		const name = request.params.username;
		const user = await User.findOne({where: { username: name },})

		if (!user) {
			return reply.status(404).send({ error: 'User not found' });
		}

		const userMatches = await UserMatch.findAll({ where: { user_id: user.user_id },
			attributes: ['match_id', 'user_score', 'winner'],
			include: [
			{
				model: Matches,
				as: 'match',
				attributes: ['match_id', 'match_date', 'game_duration'],
				include: [
				{
					model: UserMatch,
					as: 'userMatches',
					where: { 
						user_id: { [Op.ne]: user.user_id }
					},
					required: false,
					attributes: ['user_id', 'user_score', 'winner'],
					include: [
					{
						model: User,
						as: 'user',
						attributes: ['username']
					}]
				}]
			}],
			order: [
				[{ model: Matches, as: 'match' }, 'match_date', 'DESC'],
				[{ model: Matches, as: 'match' }, 'match_id', 'DESC']
			]
		});

		if (!userMatches || userMatches.length === 0) {
			return reply.status(200).send({ message: 'No matches found for this user' });
		}
		const formattedMatches = userMatches.map(userMatch => ({
			match_id: (userMatch as any).match.match_id,
			match_date: (userMatch as any).match.match_date,
			game_duration: (userMatch as any).match.game_duration,
			my_score: userMatch.user_score,
			i_won: userMatch.winner,

			opponents: (userMatch as any).match.userMatches?.map((opponent: any) => ({
				username: opponent.user.username,
				score: opponent.user_score,
				won: opponent.winner
			})) || []
		}));

		return reply.status(200).send({
			total_matches: formattedMatches.length,
			matches: formattedMatches
		});

		} catch (error) {
			console.error('Error:', error);
			return reply.status(500).send({ error: 'Internal server error' });
		}
}