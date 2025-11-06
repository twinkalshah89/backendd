import { Router } from "express";
import { UserRouter } from "./user/routes/user.route";

export class AppRoutes {
    public router: Router;

     constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

      private initializeRoutes() {
        this.router.use('/user', new UserRouter().router);
      }
}

export default new AppRoutes().router;