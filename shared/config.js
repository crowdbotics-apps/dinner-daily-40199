const dotenv = require("dotenv");
const dotenvParseVariables = require("dotenv-parse-variables");

const env = dotenv.config({ path: ".env" }),
    parsedEnv = dotenvParseVariables(env.parsed);
//parsedEnv = dotenvParseVariables(process.env); // to use vscode environment variable for debug

const server = {
    host: parsedEnv.SERVER_HOST,
    port: parsedEnv.SERVER_PORT,
};

showServerLog = parsedEnv.SHOW_SERVER_LOG;

const database = {
    host: parsedEnv.DB_HOST,
    port: parsedEnv.DB_PORT,
    db: parsedEnv.DB_NAME,
    username: parsedEnv.DB_USER,
    password: parsedEnv.DB_PASS,
    connectionLimit: parsedEnv.DB_CONNECTION_LIMIT,
    idleTimeout: parsedEnv.DB_IDLE_TIMEOUT,
    maxIdle: parsedEnv.DB_MAX_IDLE,
};

const secret = parsedEnv.SECRET_KEY;
const adminURL = parsedEnv.ADMIN_URL;

const sendgridKey = parsedEnv.SENDGRID_API_KEY;
const sendgridEmail = parsedEnv.SENDGRID_EMAIL;
const supportEmail = parsedEnv.SUPPORT_EMAIL;

const stripe = {
    secretKey: parsedEnv.STRIPE_SECRET_KEY,
    publishableKey: parsedEnv.STRIPE_PUBLISHABLE_KEY,
};

const oneSignal = {
    apiKey: parsedEnv.ONE_SIGNAL_KEY,
    apiId: parsedEnv.ONE_SIGNAL_ID,
};

const firebaseDatabaseURL = parsedEnv.DATABASE_URL;

const kroger = {
    clientId: parsedEnv.KROGER_CLIENT_ID,
    clientSecret: parsedEnv.KROGER_CLIENT_SECRET,
};

const migrationDate = parsedEnv.MIGRATION_DATE;

module.exports = {
    server,
    showServerLog,
    database,
    secret,
    adminURL,
    sendgridEmail,
    sendgridKey,
    supportEmail,
    stripe,
    oneSignal,
    firebaseDatabaseURL,
    kroger,
    migrationDate,
};
