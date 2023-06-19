import winston from "winston";
const environment = process.env.NODE_ENV;

const customLevelOptions = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		http: 4,
		debug: 5,
	},
	colors: {
		debug: "blue",
		http: "green",
		info: "cyan",
		warning: "yellow",
		error: "red",
		fatal: "magenta",
	},
};

const devLogger = winston.createLogger({
	levels: customLevelOptions.levels,
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({
			level: "debug",
			format: winston.format.combine(
				winston.format.colorize({
					colors: customLevelOptions.colors,
				}),
				winston.format.simple()
			),
		}),
	],
});

const prodLogger = winston.createLogger({
	levels: customLevelOptions.levels,
	format: winston.format.json(),
	transports: [
		new winston.transports.Console({
			level: "info",
			format: winston.format.combine(
				winston.format.colorize({
					colors: customLevelOptions.colors,
				}),
				winston.format.simple()
			),
		}),
		new winston.transports.File({
			filename: "logs/errors.log",
			level: "error",
			format: winston.format.simple(),
		}),
	],
});

export const addLogger = (req, res, next) => {
	if (environment === "development") {
		req.logger = devLogger;
	} else {
		req.logger = prodLogger;
	}
	req.logger.http(
		`${req.method} en ${req.url} - ${new Date().toLocaleString()}`
	);
	next();
};
