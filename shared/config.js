const dotenv = require("dotenv");
dotenv.config()


const database = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    idleTimeout: process.env.DB_IDLE_TIMEOUT,
    maxIdle: process.env.DB_MAX_IDLE,
};

const secret = process.env.SECRET_KEY;
const adminURL = process.env.ADMIN_URL;

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

const showServerLog = process.env.SHOW_SERVER_LOG;

module.exports = {
    database,
    secret,
    sendgridEmail,
    sendgridKey,
    supportEmail,
    stripe,
    oneSignal,
    firebaseDatabaseURL,
    kroger,
    migrationDate,
    adminURL,
    showServerLog
};

