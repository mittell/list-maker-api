interface ENV {
	PORT: number | undefined;
	SENTRY_URL: string | undefined;
}

interface Config {
	PORT: number;
	SENTRY_URL: string;
}

const getConfig = (): ENV => {
	return {
		PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
		SENTRY_URL: process.env.SENTRY_URL ? process.env.SENTRY_URL : undefined,
	};
};

const getSanitizedConfig = (config: ENV): Config => {
	for (const [key, value] of Object.entries(config)) {
		if (value === undefined) {
			throw new Error(`Missing key: '${key}' in config.env...`);
		}
	}
	return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitizedConfig(config);

export default sanitizedConfig;
