import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Models } from "src/enums/models";
import { CrudService } from "src/filter/crud.service";
import { BrandDoc } from "src/schema.factory/car.brand.schema";
import { QueryBrandDto } from "./dto/query.brand.dto";
import { CreateBrandDto } from "./dto/create.brand.dto";
import { UserDoc } from "src/schema.factory/user.schema";
import { mongodbId } from "src/chat/chat.service";
import { UpdateBrandDto } from "./dto/update.brand.dto";


@Injectable()
export class BrandService {
    constructor( 
        @InjectModel(Models.Brand) private brandModel:Model<BrandDoc>,
        private crudSrv:CrudService< BrandDoc  , QueryBrandDto >
    ){};
    async createBrand(body:CreateBrandDto){
        await this.validateBrandName(body.name);
        const brand=await this.brandModel.create(body);
        return brand;
    };
    async getBrand(id:mongodbId){
        const brand=await this.crudSrv.getDocument(id,this.brandModel,{path:"models",select:"_id name"});
        return { brand };
    };
    async deleteBrand(id:mongodbId){
        const brand=await this.crudSrv.deleteDocument(id,this.brandModel);
        return { status:"deleted" };
    };
    async getAllBrands(query:QueryBrandDto){
        return this.crudSrv.getAllDocs(this.brandModel.find(),query);
    };
    async updateBrand(body:UpdateBrandDto,brandId:mongodbId){
        if(body.name){
            await this.validateBrandName(body.name);
        };
        const brand=await this.brandModel.findByIdAndUpdate(brandId,body,{new:true});
        if(!brand){
            throw new HttpException("brand not found",400);
        };
        return { brand };
    }
    private async validateBrandName(name:string){
        const brandExist=await this.brandModel.findOne({ name });
        if(brandExist){
            throw new HttpException("brand add before",400);
        };
    };
};