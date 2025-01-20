// Main object
let envVars: Env = {
  BOT_ID: '',
	OWNER_ID: '',
	CLIENT_EMAIL: '',
	CLIENT_ID: '',
	CLIENT_X509_CERT_URL: '',
	TELEGRAM_API: '',
	PROJECT_ID: '',
	PRIVATE_KEY_ID: '',
	PRIVATE_KEY: '',
};

// Set the env object
export function setEnv(env: Env) {
  envVars = env;
}

// Get a specific variable
export function getEnvVar(key: keyof Env): string {
  return envVars[key] ?? '';
}