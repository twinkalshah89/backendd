import { Router } from 'express';
import { userController } from '../controllers/user.controller';


export class UserRouter {
    router: Router;
    private controller: userController;

    constructor() {
        this.router = Router();
        this.controller = new userController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/login',this.controller.login.bind(this.controller));
    }
}