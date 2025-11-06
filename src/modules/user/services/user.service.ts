import { UserRepository } from "../repositories/user.repository";
import { NotFoundError } from "@infrastructure/errors";

export class userService{

    private repo : UserRepository
    
    constructor(){
        this.repo = new UserRepository();
    }

    public async loginUser(body:any):Promise<any>{
        const user = await this.repo.findByEmail(body);
        if(!user) throw new NotFoundError("User not found")
        return user;
    }

}