import config from "./config";
import express from "express";
import {Request, Response} from "express";
import dbConnect from "./utils/dbconn.util";
import { loginToBot} from "./discord";

const app = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
})

dbConnect().then(() => {
    app.listen(config.port, () => {
        console.log(`Server listening on port ${config.port}`);
        loginToBot();
    }
    );
})
