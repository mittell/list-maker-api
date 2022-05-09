namespace NodeJS {
	interface ProcessEnv {
		PORT: string;
		SENTRY_URL: string;
		NODE_ENV: string;
		MONGO_URL: string;
		API_VERSION: string;
		JWT_SECRET: string;
	}
}
