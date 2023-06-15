const dotenv = require("dotenv");
dotenv.config()


// const database = {
//     host: parsedEnv.DB_HOST,
//     port: parsedEnv.DB_PORT,
//     db: parsedEnv.DB_NAME,
//     username: parsedEnv.DB_USER,
//     password: parsedEnv.DB_PASS,
//     connectionLimit: parsedEnv.DB_CONNECTION_LIMIT,
//     idleTimeout: parsedEnv.DB_IDLE_TIMEOUT,
//     maxIdle: parsedEnv.DB_MAX_IDLE,
// };

const secret = process.env.SECRET_KEY;


const sendgridKey = process.env.SENDGRID_API_KEY;
const sendgridEmail = process.env.SENDGRID_EMAIL;
const supportEmail = process.env.SUPPORT_EMAIL;

const stripe = {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
};

const oneSignal = {
    apiKey: process.env.ONE_SIGNAL_KEY,
    apiId: process.env.ONE_SIGNAL_ID,
};

const firebaseDatabaseURL = process.env.DATABASE_URL;

const kroger = {
    clientId: process.env.KROGER_CLIENT_ID,
    clientSecret: process.env.KROGER_CLIENT_SECRET,
};

const migrationDate = process.env.MIGRATION_DATE;

module.exports = {

    secret,
    sendgridEmail,
    sendgridKey,
    supportEmail,
    stripe,
    oneSignal,
    firebaseDatabaseURL,
    kroger,
    migrationDate,
};
