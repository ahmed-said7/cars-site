import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Models } from "src/enums/models";
import { CrudService } from "src/filter/crud.service";
import { BrandDoc } from "src/schema.factory/car.brand.schema";
import { mongodbId } from "src/chat/chat.service";
import { QueryCarModelDto } from "./dto/car.model.query.dto";
import { CreateCarModelDto } from "./dto/car.model.create.dto";
import { UpdateCarModelDto } from "./dto/update.model.dto";
import { ModelDoc } from "src/schema.factory/car.model.schema";



@Injectable()
export class BrandModelService {
    constructor( 
        @InjectModel(Models.CarModel) private CarBrandModel:Model<ModelDoc>,
        @InjectModel(Models.Brand) private BrandModel:Model<BrandDoc>,
        private crudSrv:CrudService< ModelDoc  , QueryCarModelDto >
    ){};
    async createModel(body:CreateCarModelDto){
        const brand= await this.BrandModel.findById(body.brand);
        if(!brand){
            throw new HttpException("brand not found",400);
        }
        await this.validateBrandModelName(body.name,body.brand);
        const model=await this.CarBrandModel.create(body);
        return { model };
    };
    async getBrandModel(id:mongodbId){
        const model=await this.crudSrv.getDocument(id,this.CarBrandModel);
        return { model };
    };
    async deleteModel(id:mongodbId){
        await this.crudSrv.deleteDocument(id,this.CarBrandModel);
        return { status:"deleted" };
    };
    async getAllModels(query:QueryCarModelDto){
        return this.crudSrv.
            getAllDocs(this.CarBrandModel.find(),query);
    };
    async getBrandModels( id:mongodbId , query:QueryCarModelDto ){
        return this.crudSrv.
            getAllDocs(this.CarBrandModel.find() , query ,{ brand: id } );
    };
    async updateModel(body:UpdateCarModelDto,id:mongodbId){
        let {model} =await this.getBrandModel(id);
        if( body.name && body.brand ){
            await this.validateBrandModelName(body.name,body.brand);
        }else if( body.name ){
            await this.validateBrandModelName(body.name,model.brand);
        }else if( body.brand ){
            await this.validateBrandModelName(model.name,body.brand);
        };
        model=await this.CarBrandModel.findByIdAndUpdate(id,body,{new:true});
        if(!model){
            throw new HttpException("model not found",400);
        };
        return { model };
    }
    private async validateBrandModelName(name:string,brandId:mongodbId){
        const brandExist=await this.CarBrandModel.findOne({ name,brand:brandId });
        if(brandExist){
            throw new HttpException("model added before",400);
        };
    };
};