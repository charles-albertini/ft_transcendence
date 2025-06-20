import { FastifyReply, FastifyRequest } from 'fastify';
import { Matches } from '../../db_models/matches_model';
import { User } from '../../db_models/user_model';
import { UserMatch } from '../../db_models/user_match_model';
import { CreateMatchRequest } from '../../interfaces';

export async function SaveMatch(request: FastifyRequest<{ Body: CreateMatchRequest}>, reply: FastifyReply) {
	const { Players, game_duration } = request.body as CreateMatchRequest;
	if (!Players || Players.length === 0) {
		return reply.code(400).send({ error: 'Players are required' });
	}
	if (!game_duration) {
		return reply.code(400).send({ error: 'Game duration is required' });
	}
	if (Players.length < 2) {
		return reply.code(400).send({ error: 'At least two Players are required' });
	}
	try {
		const match = await Matches.create({ game_duration: game_duration });
		if (!match) {
			return reply.code(400).send({ error: 'Failed to create match' });
		}

		for (let i = 0; i < Players.length; i++) {
			const player = Players[i];
			let winnerCount = 0;
			if (!player.user_id || player.score === undefined || player.is_winner === undefined) {
				return reply.code(400).send({ error: 'Invalid player data' });
			}
			if (player.is_winner) {
				winnerCount++;
			}
			else if (player.is_winner && winnerCount > 0) {
				return reply.code(400).send({ error: 'Only one player can be marked as winner' });
			}
			if (player.score < 0) {
				return reply.code(400).send({ error: 'Player score cannot be negative' });
			}

			const user = await User.findByPk(player.user_id);

			if (!user) {
				return reply.code(404).send({ error: `User with ID ${player.user_id} not found` });
			}

			const userMatch = await UserMatch.create({
				match_id: match.match_id,
				user_id: player.user_id,
				winner: player.is_winner,
				user_score: player.score
			});
			if (!userMatch) {
				return reply.code(400).send({ error: 'Failed to save user match data' });
			}
		}
		return reply.code(201).send({
			message: 'Match saved successfully',
			match_id: match.match_id,
		});
	}
	catch (error) {
		console.error('Error saving match:', error);
		return reply.code(500).send({ error: 'Internal server error' });
	}
}