import { User } from "../../db_models/user_model";
import { JWTpayload } from "../../interfaces";
import { Friendship } from "../../db_models/friendship_model";
import { FastifyRequest, FastifyReply } from "fastify";
import { Op } from "sequelize";

export async function friendrequest(request: FastifyRequest<{Params: { username : string }}>, reply: FastifyReply) {
	try {
		const senderId = (request.user as JWTpayload).user_id;
		const receiverName = request.params.username;
		const receiver = await User.findOne({ where: { username: receiverName}});

		if (!receiver) {
			return reply.status(404).send({ error: 'receiver user not found' });
		}

		const existingFriendship = await Friendship.findOne({
 			 where: {
				user_id1: receiver.user_id,
				user_id2: senderId,
				[Op.or]: [
					{ status: 'pending' },
					{ status: 'accepted' },
					{ status: 'declined' },
					{ status: 'none' }
				],
			}
		});
		if (existingFriendship && existingFriendship.status)
		{
			if (existingFriendship?.status === 'accepted') {
				return reply.status(400).send({ error: 'You are already friends with this user' });
			}

			if (existingFriendship.status=== 'pending') {
				return reply.status(400).send({ error: 'Friend request already sent' });
			}

			if (existingFriendship?.status === 'declined') {
				return reply.status(200).send({ message: 'This user declined your request' });
			}

			if (existingFriendship?.status === 'none') {
				await existingFriendship.update({ status: 'pending' });
				return reply.status(200).send({ message: 'Friend request re-sent successfully' });
			}
		}

		const NewFriendship = await Friendship.create({
			user_id1: receiver.user_id,
			user_id2: senderId,
			status: 'pending'
		})

		if (!NewFriendship) {
			return reply.status(400).send({ error: 'Failed to create friendship' });
		}
		return reply.status(200).send({ message: 'Friend request processed successfully' });
	}
	catch (error) {
		console.error('Error processing friend request:', error);
		return reply.status(500).send({ error: 'Internal server error' });
	}
}