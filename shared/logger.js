const winston = require('winston');
const fse = require('fs-extra');
const { timeStamp } = require('console');
require('winston-daily-rotate-file');

const logDir = './logs';

// Create the `logs` directory if it does not exist
if (!fse.existsSync(logDir)) {
  fse.mkdirsSync(logDir);
}

const transport = new winston.transports.DailyRotateFile({
  filename: 'thedinnerdaily-%DATE%.log',
  dirname: `${logDir}`,
  datePattern: 'DDMMMYYYY',
  maxFiles: '90d'
});

transport.on('rotate', function(oldFilename, newFilename) {
  // do something
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [transport]
});

module.exports = logger;
