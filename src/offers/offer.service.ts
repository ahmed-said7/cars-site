import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Models } from "src/enums/models";
import { mongodbId } from "src/chat/chat.service";
import { RequestDoc } from "src/schema.factory/request.schema";
import { OfferDoc } from "src/schema.factory/offer.schema";
import { CreateOfferDto } from "./dto/create.offer.dto";
import { UserDoc } from "src/schema.factory/user.schema";
import { CrudService } from "src/filter/crud.service";
import { QueryOfferDto } from "./dto/query.offer.dto";
import { UpdateOfferDto } from "./dto/update.offer.dto";
import { OnEvent } from "@nestjs/event-emitter";
import { CouponDoc } from "src/schema.factory/coupon.schema";
import { max } from "class-validator";



@Injectable()
export class OfferService {
    constructor(
        @InjectModel(Models.Request) private reqModel:Model<RequestDoc>,
        @InjectModel(Models.Offer) private offerModel:Model<OfferDoc>,
        @InjectModel(Models.Coupon) private couponModel:Model<CouponDoc>,
        private crudSrv:CrudService<OfferDoc,QueryOfferDto>
    ){};
    async createOffer(body:CreateOfferDto,user:UserDoc){
        const request = await this.reqModel.findById(body.request);
        if( !request ){
            throw new HttpException("request not found",400);
        };
        if( request.status != "both" && request.status != user.tradingType ){
            throw new HttpException("user trading type should be" + request.status  ,400);
        };
        if( request.completed ){
            throw new HttpException("request completed",400);
        };
        const brandIds=user.tradingBrand.map( ( brand ) => brand._id.toString() );
        if( !brandIds.includes(request.brand.toString()) ){
            throw new HttpException("request brand is not in your brands",400)
        };
        if( request.status != "both" && request.status != body.status ){
            throw new HttpException("offer status should be"+ request.status  ,400);
        };
        body.trader=user._id;
        const offer=await this.offerModel.create(body);
        return { offer };
    };
    async userAcceptOffer(offerId:mongodbId,user:UserDoc){
        const offer=await this.offerModel.findOne(
            { _id:offerId }
        );
        if(!offer){
            throw new HttpException("No offer found ",400);
        };
        const request= await this.reqModel
            .findOne({ _id:offer.request , user:user._id });
        if(!request){
            throw new HttpException("you are not request owner",400);
        };
        offer.userAccepted = true;
        await offer.save();
        return { status: "offer accepted",offer};
    };
    async traderAcceptOffer(offerId:mongodbId,user:UserDoc){
        const offer=await this.offerModel.findOne(
            { _id:offerId  }
        );
        if(!offer){
            throw new HttpException("No offer found ",400);
        };
        if( offer.trader.toString() != user._id.toString() ){
            throw new HttpException("you are not offer owner",400);
        };
        if( offer.userAccepted == false ){
            throw new HttpException("not accepted by user",400);
        };
        offer.traderAccepted = true;
        await offer.save();
        return { status: "offer accepted",offer};
    };
    async getOneOffer( offerId:mongodbId , user:UserDoc){
        let offer=await this.offerModel.findOne(
            { _id:offerId }
        );
        if(!offer){
            throw new HttpException("No offer found",400);
        };
        if(user.role == "trader" && user._id.toString() != offer.trader.toString() ){
            throw new HttpException("you are not offer owner",400);
        };
        const request= await this.reqModel.findOne({ _id:offer.request , user:user._id });
        if( user.role == "user" && !request ){
            throw new HttpException("you are not request owner",400);
        };
        offer=await offer.populate( this.populationOpts() );
        return {offer};
    };
    async getRequestOffers(reqId:mongodbId,query:QueryOfferDto,user:UserDoc){
        const request= await this.reqModel.findById(reqId);
        if( !request ){
            throw new HttpException("request not found",400);
        };
        if( user.role == "user" && user._id.toString() != request.user.toString() ){
            throw new HttpException("you are not request owner",400);
        };
        let obj={};
        if( user.role == "trader" ){
            obj = { trader : user._id };
        };
        return this.crudSrv.getAllDocs(
            this.offerModel.find() 
            , query , { request : reqId , ... obj },
            { path:"trader" , select:"name image" }
        );
    };
    private populationOpts(){
        return [ 
            { 
                path:"request" , 
                populate : [ 
                    { path:"brand",model:Models.Brand } , 
                    { path:"carmodel",model:Models.CarModel } ,
                    { path:"user" , select:"name image" , model:Models.User } 
                ]
            } 
            , { 
                path:"trader" , select:"name image" 
            } 
        ]
    };
    async getOffers(query:QueryOfferDto,user:UserDoc){
        let obj={};
        if( user.role == "user" ){
            let reqs=await this.reqModel.find({ user : user._id }).select("_id");
            reqs=reqs.map( field => field._id );
            obj={ request : { $in : reqs } };
        }else if( user.role == "trader"){
            obj={ trader:user._id }
        }
        return this.crudSrv.getAllDocs( 
            this.offerModel.find()
            ,query ,obj,
            this.populationOpts()
        );
    };
    async deleteOffer(offerId:mongodbId,user:UserDoc){
        let offer = await this.validateOfferOwner(offerId,user);
        await offer.deleteOne();
        return { status:"deleted" };
    };
    async updateOffer(body:UpdateOfferDto,offerId:mongodbId,user:UserDoc){
        let offer = await this.validateOfferOwner(offerId,user);
        offer = await this.offerModel.findByIdAndUpdate(offerId,body,{new:true});
        return { offer };
    };
    private async validateOfferOwner(offerId:mongodbId,user:UserDoc){
        const offer=await this.offerModel.findOne(
            { _id:offerId  }
        );
        if(!offer){
            throw new HttpException("No offer found",400);
        };
        if( offer.trader.toString() != user._id.toString() ){
            throw new HttpException("you are not offer owner",400);
        };
        if( offer.isPaid ){
            throw new HttpException("can not access offer,offer was paid by user",400);
        };
        return offer;
    };
    async applyCoupon(name:string,offerId:mongodbId,user:UserDoc){
        const coupon=await this.couponModel.findOne({ name });
        if(! coupon ){
            throw new HttpException("Coupon not found",400);
        };
        const offer=await this.offerModel.findOne(
            { _id:offerId  }
        );
        if(!offer){
            throw new HttpException("No offer found",400);
        };
        const request= await this.reqModel
            .findOne({ _id:offer.request , user:user._id });
        if( ! request ){
            throw new HttpException("you are not request owner",400);
        };
        if( user.coupons.includes(coupon._id) ){
            throw new HttpException("you have already use coupon",400);
        };
        let price = request.quantity * offer.price + offer.tax;
        if( request.priceReq > 0 ){
            price += request.priceReq + ( request.quantity - 1 ) * 5.75;
        };
        const discount= price * Math.floor( coupon.discount / 100 );
        if( discount > coupon.max ){
            throw new HttpException("Invalid discount",400);
        };
        offer.discount=coupon.discount;
        user.coupons.push(coupon._id);
        await user.save();
        await offer.save();
        return { offer };
    };
    @OnEvent("request.deleteOne")
    private async onRequestDeleted(request:RequestDoc){
        await this.offerModel.deleteMany({ request : request._id })
    };
};