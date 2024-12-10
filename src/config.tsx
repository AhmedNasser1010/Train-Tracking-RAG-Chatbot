// Main object
let envVars: Env = {};

// Set the env object
export function setEnv(env) {
  envVars = env;
}

// Get a specific variable
export function getEnvVar(key) {
  return envVars[key];
}
