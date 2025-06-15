import { User } from './user_model';
import { Matches } from './matches_model';
import { UserMatch } from './user_match_model';
import { Friendship } from './friendship_model';


async function syncDatabase(maxRetries = 3, delay = 2000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Synchroniser dans l'ordre des dépendances
            await User.sync();
            await Matches.sync();
            await UserMatch.sync();
            await Friendship.sync();

            console.log('✅ Database synchronized successfully');
			return true;
        } catch (error) {
            console.error('❌ Database sync failed:', error);
            throw error;
        }
    }
}

export { syncDatabase };