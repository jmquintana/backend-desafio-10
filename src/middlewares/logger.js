import winston from "winston";
const environment = process.env.NODE_ENV;

const logger = winston.createLogger({
	level: "http",
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple()
			),
		}),
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

export const addLogger = (req, res, next) => {
	req.logger = logger;
	req.logger.http(`${req.method} ${req.originalUrl} ${req.ip}`);
	next();
};
