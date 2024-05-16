import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Models } from "src/enums/models";
import { SpareDoc } from "src/schema.factory/spare.schema";
import { CreateSpareDto } from "./dto/create.spare.dto";
import { UserDoc } from "src/schema.factory/user.schema";
import { BrandDoc } from "src/schema.factory/car.brand.schema";
import { ModelDoc } from "src/schema.factory/car.model.schema";
import { mongodbId } from "src/chat/chat.service";
import { UpdateSpareDto } from "./dto/update.spare.dto";
import { userType } from "src/enums/user.type";
import { CrudService } from "src/filter/crud.service";
import { QuerySpareDto } from "./dto/query.spare.dto";



@Injectable()
export class SpareService {
    constructor(
        @InjectModel(Models.Spare) private SpareModel:Model<SpareDoc>,
        @InjectModel(Models.CarModel) private CarBrandModel:Model<ModelDoc>,
        @InjectModel(Models.Brand) private BrandModel:Model<BrandDoc>,
        private crudSrv:CrudService<SpareDoc,QuerySpareDto>
    ){};
    async createSpare(body:CreateSpareDto,user:UserDoc){
        const brand=await this.BrandModel.findOne({ _id: body.brand });
        if( !brand ){ 
            throw new HttpException("brand not found",400); 
        };
        await this.validateCarmodelBrand(body.carmodel,body.brand)
        const spare=await this.SpareModel.create({ ... body , user:user._id });
        return { spare };
    };
    private async validateCarmodelBrand(carmodelId:mongodbId,brandId:mongodbId){
        const carmodel =await this.CarBrandModel.findOne({
            brand: brandId ,
            _id: carmodelId
        });
        if( !carmodel ){
            throw new HttpException("carmodel not found",400);
        };
    };
    private async accessSpare(spareId:mongodbId,user:UserDoc){
        const spare =await this.SpareModel.findOne({
            _id:spareId
        });
        if(!spare){
            throw new HttpException("No spare found",400);
        }
        if( spare.user.toString() != user._id.toString() && user.role != userType.admin ){
            throw new HttpException("you are not allowed to edit this spare",400);
        };
        return spare;
    };
    async updateSpare(body:UpdateSpareDto,spareId:mongodbId,user:UserDoc){
        let spare=await this.accessSpare(spareId,user);
        if( spare.user.toString() != user._id.toString() ){
            throw new HttpException("you are not allowed to update this spare",400);
        };
        if(body.carmodel && body.brand){
            await this.validateCarmodelBrand(body.carmodel,body.brand);
        }else if( body.carmodel ){
            await this.validateCarmodelBrand(body.carmodel,spare.brand);
        }else if( body.brand ){
            await this.validateCarmodelBrand(spare.carmodel,body.brand);
        };
        spare = await this.SpareModel.findByIdAndUpdate( spareId , body , { new:true } );
        return { spare };
    };
    async deleteSpare( spareId:mongodbId,user:UserDoc ){
        const spare=await this.accessSpare(spareId,user);
        await spare.deleteOne();
        return { status : "deleted"  };
    };
    async getSpare( spareId:mongodbId ){
        const spare=await this.SpareModel.findById(spareId).
            populate([ "brand" , "carmodel" , {path:"user",select:"name image"} ]);
        if( ! spare ){
            throw new HttpException("spare not found",400);
        };
        return { spare };
    };
    async getAllSpares(query:QuerySpareDto){
        return this.crudSrv.getAllDocs(
            this.SpareModel.find(),query,undefined,
            [ { path:"brand",select:"name image"} , {path:"carmodel",select:"name"} , {path:"user",select:"name image"} ]
        )
    }
};