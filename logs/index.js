const Winston = require('winston');
const dateFormat = require('dateformat');

// logger setup
const logger = Winston.createLogger(
    {
        level: 'silly',
        format: Winston.format.combine(
            Winston.format.colorize(),
            Winston.format.timestamp(),
            Winston.format.printf(info => dateFormat(info.timestamp,"yyyy-mm-dd h:MM:ss") + ` [${info.level}]: ${info.message}`),
        ),
        transports: [
            new Winston.transports.File({
                filename: 'logs/error.log',
                level: 'silly',
                format: Winston.format.json()
            }),
            new Winston.transports.Console()
        ]
    })

module.exports = logger
