import { NotFoundError } from "@infrastructure/errors"
import UserModel from "../models/user.model"


export class UserRepository{

    constructor(){}

    public async findByEmail(data: any): Promise<any>{
        const user = await UserModel.findOne({email:data.email})
        return user
    }


}