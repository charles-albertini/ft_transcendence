// backend/src/profile/utils/routes.ts
import fp from 'fastify-plugin';
import { getUser } from '../routes_def/getUser';
import { deleteUser } from '../routes_def/deleteUser';
import { update } from '../routes_def/update';
import { changePassword } from '../routes_def/changePassword';
import { getHistory } from '../routes_def/getHistory';
import { friendrequest } from '../routes_def/friendRequest';
import { pendingRequest } from '../routes_def/PendingRequest';
import { acceptRequest } from '../routes_def/acceptRequest';
import { deleteFriendship } from '../routes_def/deleteFriendship';
import { declineRequest } from '../routes_def/declineRequest';
import { friendList } from '../routes_def/friendList';
import { anonymization } from '../routes_def/anonymization';
import { sentRequests } from '../routes_def/sentRequests';
import { searchUsers } from '../routes_def/searchUsers';
import { updateOnlineStatus, getUserOnlineStatus, getMultipleUsersOnlineStatus, setOfflineStatus } from '../routes_def/onlineStatus';

export default fp(async function routes_profile(fastify: any) {
	// Routes utilisateur existantes
	fastify.get('/profile/user/:username', { preHandler: fastify.authenticate }, getUser);
	fastify.delete('/profile/delete', { preHandler: fastify.authenticate }, deleteUser);
	fastify.patch('/profile/update', { preHandler: fastify.authenticate }, update);
	fastify.patch('/profile/changePassword', { preHandler: fastify.authenticate }, changePassword);
	fastify.get('/profile/history/:username', { preHandler: fastify.authenticate }, getHistory);
	fastify.patch('/profile/anonymization', { preHandler: fastify.authenticate }, anonymization);
	
	// Routes d'amitié existantes
	fastify.post('/profile/friendRequest/:username', { preHandler: fastify.authenticate }, friendrequest);
	fastify.get('/profile/friendRequest/pending', { preHandler: fastify.authenticate }, pendingRequest);
	fastify.patch('/profile/friendRequest/accept', { preHandler: fastify.authenticate }, acceptRequest);
	fastify.patch('/profile/friendRequest/delete', { preHandler: fastify.authenticate }, deleteFriendship);
	fastify.patch('/profile/friendRequest/decline', { preHandler: fastify.authenticate }, declineRequest);
	fastify.get('/profile/friendList', { preHandler: fastify.authenticate }, friendList);
	
	// 🆕 NOUVELLES ROUTES - AJOUTER CES LIGNES
	fastify.get('/profile/friendRequest/sent', { preHandler: fastify.authenticate }, sentRequests);
	fastify.get('/profile/search', { preHandler: fastify.authenticate }, searchUsers);
	
	// Routes de statut en ligne
	fastify.post('/profile/status/online', { preHandler: fastify.authenticate }, updateOnlineStatus);
	fastify.post('/profile/status/offline', { preHandler: fastify.authenticate }, setOfflineStatus);
	fastify.get('/profile/status/:username', { preHandler: fastify.authenticate }, getUserOnlineStatus);
	fastify.post('/profile/status/multiple', { preHandler: fastify.authenticate }, getMultipleUsersOnlineStatus);
});