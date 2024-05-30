import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Models } from "src/enums/models";
import { SpareDoc } from "src/schema.factory/spare.schema";
import { UserDoc } from "src/schema.factory/user.schema";
import { BrandDoc } from "src/schema.factory/car.brand.schema";
import { ModelDoc } from "src/schema.factory/car.model.schema";
import { mongodbId } from "src/chat/chat.service";
import { CrudService } from "src/filter/crud.service";
import { CreateRequestDto } from "./dto/create.request.dto";
import { QueryRequestDto } from "./dto/query.request.dto";
import { RequestDoc } from "src/schema.factory/request.schema";
import { UpdateRequestDto } from "./dto/update.request.dto";
import { EventEmitter2 } from "@nestjs/event-emitter";



@Injectable()
export class RequestService {
    constructor(
        @InjectModel(Models.Request) private requestModel:Model<RequestDoc>,
        @InjectModel(Models.CarModel) private CarBrandModel:Model<ModelDoc>,
        @InjectModel(Models.Brand) private BrandModel:Model<BrandDoc>,
        @InjectModel(Models.Spare) private spareModel:Model<SpareDoc>,
        private crudSrv:CrudService<SpareDoc,QueryRequestDto>,
        private events:EventEmitter2
    ){};
    async createRequest(body:CreateRequestDto,user:UserDoc){
        await this.validateCarmodelBrand(body.carmodel,body.brand)
        const request=await this.requestModel.create({ ... body , user:user._id });
        return { request };
    };
    private async validateCarmodelBrand(carmodelId:mongodbId,brandId:mongodbId){
        const brand=await this.BrandModel.findOne({ _id: brandId });
        if( !brand ){ 
            throw new HttpException("brand not found",400); 
        };
        const carmodel =await this.CarBrandModel.findOne({
            brand: brandId ,
            _id: carmodelId
        });
        if( !carmodel ){
            throw new HttpException("car model not found",400);
        };
    };
    private async accessRequest(reqId:mongodbId,user:UserDoc){
        const request =await this.requestModel.findOne({
            _id:reqId
        });
        if(!request){
            throw new HttpException("No request found",400);
        };
        if( request.user.toString() != user._id.toString()  ){
            throw new HttpException("you are not allowed to edit this request",400);
        };
        if(request.completed){
            throw new HttpException("can not access this request has been completed",400);
        }
        return request;
    }
    async updateRequest(body:UpdateRequestDto,reqId:mongodbId,user:UserDoc){
        let request=await this.accessRequest(reqId,user);
        if(body.carmodel && body.brand){
            await this.validateCarmodelBrand(body.carmodel,body.brand);
        }else if( body.carmodel ){
            await this.validateCarmodelBrand(body.carmodel,request.brand);
        }else if( body.brand ){
            await this.validateCarmodelBrand(request.carmodel,body.brand);
        };
        request= await this.requestModel
            .findByIdAndUpdate( reqId , body , {new:true} ).populate( this.populationOpts() );
        return { request };
    };
    async deleteRequest( reqId:mongodbId,user:UserDoc ){
        const request=await this.accessRequest(reqId,user);
        await request.deleteOne();
        this.events.emit("request.deleteOne",request);
        return { status : "deleted"  };
    };
    async getRequest( reqId:mongodbId,user:UserDoc ){
        let request=await this.requestModel.findById(reqId).populate({ path:"offers" });
        if(!request){
            throw new HttpException("request not found",400);
        };
        if( request.user.toString() != user._id.toString() && user.role == "user"  ){
            throw new HttpException("you are not request owner",400);
        };
        const brandIds=user.tradingBrand.map( ( brand ) => brand._id.toString() );
        if( user.role == "trader" && !brandIds.includes(request.brand.toString()) ){
            throw new HttpException("request brand is not in your brands",400)
        };
        request=await request.populate( this.populationOpts() );
        return { request };
    };
    private populationOpts(){
        return [
            {path:"brand",select:"name image"},
            {path:"carmodel",select:"name"},
            {path:"user",select:"name image"}
        ]
    };
    async getAllTraderRequests(query:QueryRequestDto,user:UserDoc){
        const brandIds=user.tradingBrand.map( ( brand ) => brand._id );
        return this.crudSrv.getAllDocs( this.requestModel.find() ,query ,
            { 
                $or : 
                [ 
                    { brand: { $in : brandIds } , status : user.tradingType } 
                    ,{ brand: { $in : brandIds } , status:"both" } 
                ] 
            },
            this.populationOpts()
        );
    };
    async getAllRequests(query:QueryRequestDto,user:UserDoc){
        let obj={};
        if( user.role == "user" ){
            obj = { user : user._id };
        };
        return this.crudSrv.getAllDocs( this.requestModel.find() , { ... query } ,
            obj ,
            this.populationOpts()
        );
    };
    async activateRequest(reqId:mongodbId,user:UserDoc){
        let request=await this.accessRequest(reqId,user);
        request= await this.requestModel.findByIdAndUpdate
            ( 
                reqId , { createdAt:new Date() , updatedAt:new Date() } , {new:true} 
            )
            .populate( this.populationOpts() );
        return { request };
    };
    async allSpareRequest(user:UserDoc){
        const spares=await this.spareModel.find();
        const reqs=spares.map( (spare) => {
            return { 
                name:spare.name,
                carmodel:spare.carmodel,
                brand:spare.brand,
                user:user._id,
                year:spare.from,
                image:spare.image?.split("spare/")[1],
                priceReq:11.5
            }
        });
        const result=await this.requestModel.insertMany(reqs);
        return { requests:result }
    };
};