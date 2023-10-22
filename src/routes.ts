import { Router } from 'express';
import { oauthCallbackController , loginController} from './controllers/oauth.controller';
const router = Router();



router.get('/callback', oauthCallbackController);
router.get('/login', loginController)

export default router;