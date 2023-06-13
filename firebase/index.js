const rfr = require('rfr');
const config = rfr('/shared/config');

const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = rfr('/firebase/serviceAccount.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: config['firebaseDatabaseURL']
});

const bucket = getStorage().bucket();

module.exports = bucket;
