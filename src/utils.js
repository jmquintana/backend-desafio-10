import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

// faker.locale = "es";

export const generateUser = () => {
	let numProducts = parseInt(faker.helpers.randomize([1, 2, 3, 4]));
	let products = [];
	for (let i = 0; i < numProducts; i++) {
		products.push(generateProduct());
	}
	return {
		first_name: faker.person.firstName(),
		last_name: faker.person.lastName(),
		email: faker.internet.email(),
		age: faker.number.int({ max: 100 }),
		password: faker.internet.password(),
		role: faker.helpers.enumValue(["user", "admin"]),
		cart: { products },
	};
};

export const generateProduct = () => {
	let stock = faker.number.int(100);
	const status = () => !!stock;
	return {
		id: faker.database.mongodbObjectId(),
		title: faker.commerce.productName(),
		description: faker.commerce.productDescription(),
		category: faker.commerce.productDescription(),
		code: `${faker.string
			.alpha({ length: 3 })
			.toUpperCase()}${faker.string.numeric({
			length: 4,
		})}`,
		price: faker.commerce.price(),
		thumbnails: [faker.image.url()],
		stock: stock,
		status: status(),
	};
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, `${__dirname}/public/images`);
	},
	filename: function (req, file, cb) {
		cb(null, `${file.originalname}`); //${Date.now().getFullYear}-
	},
});

export const createHash = (password) =>
	bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) =>
	bcrypt.compareSync(password, user.password);

export const uploader = multer({ storage });
export default __dirname;
