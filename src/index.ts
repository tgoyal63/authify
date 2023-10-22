import { PORT } from "./config";
import express from "express";
import dbConnect from "./utils/dbconn.util";
import { loginToBot } from "./discord";
import routes from "./routes";

const app = express();
app.use(express.json());
app.use(routes);

dbConnect().then(() => {
	app.listen(PORT, () => {
		console.log(`Server listening on port ${PORT}`);
		loginToBot();
	});
});
