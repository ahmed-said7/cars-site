import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Models } from "src/enums/models";
import { UserDoc } from "src/schema.factory/user.schema";
import { CreateAddresseDto } from "./dto/addresse.create.dto";
import { UpdateAddresseDto } from "./dto/addresse.update.dto";
import { mongodbId } from "src/chat/chat.service";

@Injectable()
export class AddresseService {
    constructor
    (
        @InjectModel(Models.User) private Usermodel: Model<UserDoc>
    ) {};
    async addAddresse(body:CreateAddresseDto,user:UserDoc){
        const result=await this.Usermodel.
        findByIdAndUpdate(user._id, { $addToSet: { addresses:body } },{new:true});
        return { addresses:result.addresses };
    };
    async updateAddresse(body:UpdateAddresseDto,addresseId:mongodbId,user:UserDoc){
        const index=user.addresses.findIndex( ( field ) => field._id.toString() === addresseId.toString());
        if(index == -1){
            throw new HttpException("addresse not found",400);
        };
        user.addresses[index]={ ... user.addresses[index] , ... body , _id:user.addresses[index]._id  };
        await user.save();
        return { addresses: user.addresses };
    };
    async deleteAddresse(addresseId:mongodbId,user:UserDoc){
        const index=user.addresses.findIndex( ( field ) => field._id.toString() === addresseId.toString());
        if(index == -1){
            throw new HttpException("addresse not found",400);
        };
        user.addresses.splice(index, 1);
        await user.save();
        return { addresses: user.addresses };
    };
}