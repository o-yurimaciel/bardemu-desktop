const winston = require('winston')
require('winston-daily-rotate-file')
const { combine, timestamp, label, printf } = winston.format

const isDevelopment = process.env.NODE_ENV !== 'production'

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${level} [${label}] - ${message}`
})

const pathLog = isDevelopment ? "./logs" : "C:/BarDeMu/logs";
const pathLogAudit = isDevelopment ? "./logs/log-audit.json" : "C:/BarDeMu/logs/log-audit.json";

var transport = new winston.transports.DailyRotateFile({
  filename: 'log-%DATE%.log',
  datePattern: "YYYY-MM-DD",
  dirname: pathLog,
  zippedArchive: false,
  options: { flags: 'a' },
  maxFiles: '7d',
  auditFile: pathLogAudit
})

winston.loggers.add('BarDeMu', {
  format: combine(
    label({ label: 'BarDeMu' }),
    timestamp({
      format: 'DD/MM/YYYY HH:mm:ss.SSSS'
    }),
    logFormat
  ),
  transports:[
    transport
  ],
  exitOnError: false
})

const log = winston.loggers.get('BarDeMu')

transport.on('rotate', function() {
  log.info('New logfile created!')
});

log.add(new winston.transports.Console({
  format: winston.format.simple(),
}));

module.exports = log