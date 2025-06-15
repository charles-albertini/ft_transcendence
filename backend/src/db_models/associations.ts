import { User } from './user_model';
import { Matches } from './matches_model';
import { UserMatch } from './user_match_model';
import { Friendship } from './friendship_model';

// Relations User <-> UserMatch <-> Matches (Many-to-Many via UserMatch)
User.belongsToMany(Matches, {
	through: UserMatch,
	foreignKey: 'user_id',
	otherKey: 'match_id',
	as: 'matches'
});

Matches.belongsToMany(User, {
	through: UserMatch,
	foreignKey: 'match_id',
	otherKey: 'user_id',
	as: 'users'
});

// Relations directes avec UserMatch pour accéder aux détails
User.hasMany(UserMatch, {
	foreignKey: 'user_id',
	as: 'userMatches'
});

UserMatch.belongsTo(User, {
	foreignKey: 'user_id',
	as: 'user'
});

Matches.hasMany(UserMatch, {
	foreignKey: 'match_id',
	as: 'userMatches'
});

UserMatch.belongsTo(Matches, {
	foreignKey: 'match_id',
	as: 'match'
});

// Relations Friendship avec User
// Un utilisateur peut avoir plusieurs demandes d'amitié envoyées
User.hasMany(Friendship, {
	foreignKey: 'user_id1',
	as: 'sentFriendships'
});

// Un utilisateur peut avoir plusieurs demandes d'amitié reçues
User.hasMany(Friendship, {
	foreignKey: 'user_id2',
	as: 'receivedFriendships'
});

// Une amitié appartient à un utilisateur (celui qui l'a envoyée)
Friendship.belongsTo(User, {
	foreignKey: 'user_id1',
	as: 'sender'
});

// Une amitié appartient à un utilisateur (celui qui l'a reçue)
Friendship.belongsTo(User, {
	foreignKey: 'user_id2',
	as: 'receiver'
});

export {
	User,
	Matches,
	UserMatch,
	Friendship
};