import 'dotenv/config';

export type EnvVariables = {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    STAGE_NAME: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_SECRET: string;
};

/**
 * Get environment variable value by key from .env
 *
 * @param key
 * @param isOptional
 * @returns Partial<EnvVariables>[T] | EnvVariables[T]
 */
export function getEnv<T extends keyof EnvVariables>(key: T, isOptional = false) {
    const envVariableValue = process.env[key];

    if (!isOptional && envVariableValue === undefined) {
        throw new Error(`${key} not found in .env config!`);
    }

    return envVariableValue;
}
