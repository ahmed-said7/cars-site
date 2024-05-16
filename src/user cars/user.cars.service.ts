import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Models } from "src/enums/models";
import { CrudService } from "src/filter/crud.service";
import { BrandDoc } from "src/schema.factory/car.brand.schema";
import { mongodbId } from "src/chat/chat.service";
import { ModelDoc } from "src/schema.factory/car.model.schema";
import { OwnCarsDoc } from "src/schema.factory/user.cars.schema";
import { CreateUserCarsDto } from "./dto/usercars.create.dto";
import { UserDoc } from "src/schema.factory/user.schema";
import { UpdateUserCarsDto } from "./dto/usercars.update.dto";
import { UserCarsQueryDto } from "./dto/usercars.query.dto";



@Injectable()
export class OwnCarService {
    constructor( 
        @InjectModel(Models.CarModel) private CarBrandModel:Model<ModelDoc>,
        @InjectModel(Models.Brand) private BrandModel:Model<BrandDoc>,
        @InjectModel(Models.userCars) private OwnCarModel:Model<OwnCarsDoc>,
        private crudSrv:CrudService<OwnCarsDoc,UserCarsQueryDto>
    ){};
    async createMyOwnCar(body:CreateUserCarsDto,user:UserDoc){
        await this.validateCarBrandModel(body.brand,body.carmodel);
        body.user=user._id;
        const car=await this.OwnCarModel.create(body);
        return { car };
    };
    async updateMyOwnCar(body:UpdateUserCarsDto,carId:mongodbId,user:UserDoc){
        let { car }=await this.getCar(carId,user);
        if( body.brand && body.carmodel ){
            await this.validateCarBrandModel(body.brand,body.carmodel);
        }else if( body.brand  ){
            await this.validateCarBrandModel(body.brand,car.carmodel);
        }else if( body.carmodel ){
            await this.validateCarBrandModel(car.brand,body.carmodel);
        };
        car=await this.OwnCarModel.findByIdAndUpdate(carId,body,{new:true});
        return { car };
    };
    private async validateCarBrandModel(brandId:mongodbId,modelId:mongodbId){
        const brand= await this.BrandModel.findById(brandId);
        if(!brand){
            throw new HttpException("brand not found",400);
        };
        const carmodel=await this.CarBrandModel.findOne({ _id:modelId , brand:brandId });
        if(!carmodel){
            throw new HttpException("car model not found",400);
        };
    };
    async getCar(id:mongodbId,user:UserDoc){
        const car=await this.crudSrv.getDocument(id,this.OwnCarModel);
        if(user._id.toString() != car.user.toString() ){
            throw new HttpException("you are not car owner ",400);
        };
        return { car };
    };
    async deleteCar(id:mongodbId,user:UserDoc){
        await this.getCar(id,user);
        await this.crudSrv.deleteDocument(id,this.OwnCarModel);
        return { status:"deleted" };
    };
    async getAllMyOwnCars(query:UserCarsQueryDto,user:UserDoc){
        return this.crudSrv
        .getAllDocs(
            this.OwnCarModel.find(),
            query,
            {user:user._id}
            ,[{path:"brand",select:"name image"},{path:"carmodel",select:"name"}]
        );
    };
};