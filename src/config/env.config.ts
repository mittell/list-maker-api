interface ENV {
	PORT: number | undefined;
	SENTRY_URL: string | undefined;
	NODE_ENV: string | undefined;
	MONGO_URL: string | undefined;
}

interface Config {
	PORT: number;
	SENTRY_URL: string;
	NODE_ENV: string;
	MONGO_URL: string;
}

const getConfig = (): ENV => {
	return {
		PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
		SENTRY_URL: process.env.SENTRY_URL ? process.env.SENTRY_URL : undefined,
		NODE_ENV: process.env.NODE_ENV ? process.env.NODE_ENV : undefined,
		MONGO_URL: process.env.MONGO_URL ? process.env.MONGO_URL : undefined,
	};
};

const getSanitizedConfig = (configValues: ENV): Config => {
	for (const [key, value] of Object.entries(configValues)) {
		if (value === undefined) {
			throw new Error(`Missing key: '${key}' in config.env...`);
		}
	}
	return configValues as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
