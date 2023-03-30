
export interface ApiConfig {
  environment: "development" | "production" | "test"
  http2?: boolean
  port?: number
  https: {
    key: string,
    cert: string,
    required?: boolean,
  },
  elastic: {
    username: string,
    password: string,
    caPath: string,
    url: string
  },
  googleApiKey: string,
  secret: string,
  allowedEmails: string[]
}

const getRequiredEnv = (envName: string): string => {

  const value = process.env[envName];
  if (!value) {

    throw new Error(`Missing required env: ${envName}`);

  }
  return value;

},

  getEnvOr = (envName: string, otherwise: string): string => process.env[envName] || otherwise,

  getArrayOfStrings = (envName: string, required = true): string[] => {
    if (required && !process.env[envName]?.length) throw new Error(`Missing required env: ${envName}`)
    const envValue = (envName in process.env && typeof process.env[envName] === 'string' ? process.env[envName] as string : '')
    return envValue.split(",").map(str => str.trim())
  }



export const config: ApiConfig = {
  "elastic": {
    "username": getEnvOr(
      "ELASTIC_USERNAME",
      "elastic"
    ),
    "password": getRequiredEnv("ELASTIC_PASSWORD"),
    "caPath": getRequiredEnv("ELASTIC_CA_PATH"),
    "url": getEnvOr(
      "ELASTIC_URL",
      "https://localhost:9200"
    )
  },
  "port": Number(getEnvOr(
    "PORT",
    "8080"
  )),
  "googleApiKey": getRequiredEnv("GOOGLE_API_KEY"),
  "environment": getRequiredEnv("NODE_ENV") as ApiConfig["environment"],
  "https": {
    "key": getEnvOr(
      "HTTPS_KEY",
      ""
    ),
    "cert": getEnvOr(
      "HTTPS_CERT",
      ""
    ),
    "required": getEnvOr(
      "HTTPS_REQUIRED",
      ""
    ) == "true"
  },
  "http2": Boolean(getEnvOr(
    "HTTP2",
    ""
  )),
  "secret": getEnvOr("SECRET", 'aisjdiasidj'),
  "allowedEmails": getArrayOfStrings("ALLOWED_EMAILS")
};

const NODE_ENV_ALLOWED = [
  "production",
  "development",
  "test"
];
if (!NODE_ENV_ALLOWED.includes(config.environment)) {

  throw new TypeError(`NODE_ENV must be one of [${NODE_ENV_ALLOWED.join(", ")}] but got ${config.environment}`);

}

