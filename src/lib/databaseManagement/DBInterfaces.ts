export interface DBUser {
	user_id: number;
	username: string;
	created_at: string;
}

export interface DBAuth {
	user_id: number;
	password_hash: string;
}

export interface DBRecipe {
	recipe_id: number;
	user_id: number;
	title: string;
	description: string;
	ingredients: string;
	instructions: string;
	thumbnail_url?: string | null;
	created_at: string;
}

