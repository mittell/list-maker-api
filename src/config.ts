interface ENV {
	PORT: number | undefined;
}

interface Config {
	PORT: number;
}

const getConfig = (): ENV => {
	return {
		PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
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
