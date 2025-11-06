import { Request, Response,NextFunction } from "express";
import { userService } from "../services/user.service";


export class userController{
    
    private service: userService;

    constructor(){
        this.service = new userService();
    }

    public async login(req:Request,res:Response,next:NextFunction):Promise<any>{
        try {
            const user = await this.service.loginUser(req.body);
            return res.status(200).json({message:"User logged in successfully",user})
        } catch (error) {
            next(error)
        }
    }

}
