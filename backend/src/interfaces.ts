
export interface JWTpayload {
	email_adress: string;
	user_id: number;
}

export interface SignUpRequest {
	username: string;
	email_adress: string;
	password: string;
}

export interface Pub_User {
	username: string;
	email_adress: string;
	number_of_matches: number;
	number_of_win: number;
	number_of_lose: number;
	ratio: number;
	created_at: Date;
	updated_at: Date;
	avatar?: string;
	twoFA: boolean;
}

export interface UpdateData {
	username?: string;
	email_adress?: string;
	avatar?: string;
}

