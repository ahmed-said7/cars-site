import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Models } from "src/enums/models";
import { CrudService } from "src/filter/crud.service";
import { CouponDoc } from "src/schema.factory/coupon.schema";
import { QueryCouponDto } from "./dto/query.coupon.dto";



interface CreateCoupon {
    name: string;
    max: number;
    discount:number;
};
interface UpdateCoupon {
    name?: string;
    max?:number;
    discount?: number;
};

@Injectable()
export class CouponServices {
    constructor(
        @InjectModel(Models.Coupon) private model:Model<CouponDoc>,
        private api:CrudService<CouponDoc,QueryCouponDto>
    ){};
    getAllCoupons(query:QueryCouponDto){
        return this.api.getAllDocs(this.model.find(),query);
    };
    async deleteCoupon(id:ObjectId){
        await this.api.deleteDocument(id,this.model);
        return { status :"deleted" }
    };
    async getCoupon(id:ObjectId){
        const coupon=await this.api.getDocument(id,this.model);
        return { coupon };
    };
    async createCoupon(body:CreateCoupon){
        await this.validateCoupon(body.name);
        const coupon=await this.model.create(body);
        if(! coupon ){
            throw new HttpException('Cannot create coupon',400);
        };
        return { coupon }; 
    };
    async updateCoupon(id:ObjectId,body:UpdateCoupon){
        if(body.name){
            await this.validateCoupon(body.name);
        };
        const coupon=await this.model.findByIdAndUpdate(id,body,{new : true});
        if(! coupon){
            throw new HttpException('Cannot update coupon',400);
        };
        return { coupon };
    };
    private async validateCoupon(name:string){
        const coupon=await this.model.findOne({name});
        if( coupon ){
            throw new HttpException('coupon should be unique',400);
        };
    }
};