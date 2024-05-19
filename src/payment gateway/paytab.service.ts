import { HttpException, Injectable } from "@nestjs/common";
import { mongodbId } from "src/chat/chat.service";
import { UserDoc } from "src/schema.factory/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { Model } from "mongoose";
import { OfferDoc  } from "src/schema.factory/offer.schema";
import { RequestDoc } from "src/schema.factory/request.schema";
import { IResponsePaytab, Paytab } from "./paytabs";
import { Request, Response } from "express";
import { OrderDoc } from "src/schema.factory/order.schema";
import { OnEvent } from "@nestjs/event-emitter";

@Injectable()
export class PaytabService {
    constructor(
        @InjectModel(Models.Offer) private offerModel:Model<OfferDoc>,
        @InjectModel(Models.Request) private reqModel:Model<RequestDoc>,
        @InjectModel(Models.Order) private orderModel:Model<OrderDoc>,
        private paytab:Paytab
    ){}
    async getPaytabUrl(res:Response, offerId:mongodbId,user:UserDoc ){
        const offer=await this.offerModel.findById(offerId);
        if( !offer ){
            throw new HttpException("offer not found",400);
        };
        if( !offer.traderAccepted ){
            throw new HttpException("offer not accepted by trader",400);
        };
        const request=await this.reqModel.findById(offer.request);
        if( request.user.toString() != user._id.toString() ){
            throw new HttpException("you are not request owner",400);
        };
        if( request.completed == true ){
            throw new HttpException("your request has been paid",400);
        };
        return this.paytab.paymentUrlUsingAxios(
            res,user,
            {  price:offer.price , offerId:offer._id  }
        )
    };
    async validateCallback(req:Request){
        this.paytab.ValidatePayment(req);
    };
    @OnEvent("payment.created")
    private async paymentCreated(data:IResponsePaytab){
        const offer=await this.offerModel.findByIdAndUpdate(
            data.cart_id
            ,{
                paidAt:new Date(),
                isPaid:true
            }
        );
        if(!offer){
            console.log("No offer found",400);
            return;
        };
        const request=await this.reqModel.findByIdAndUpdate(
            offer.request
            ,{ completed:true }
        );
        if(!request){
            console.log("No request found",400);
            return;
        };
        const orderExisting=await this.orderModel.findOne({
            tranRef:data.tran_ref
        });
        if(orderExisting){
            console.log("Order already exists");
            return;
        };
        const order=await this.orderModel.create({ 
            trader:offer.trader,
            user:request.user,
            price:data.cart_amount,
            address : { 
                details:data.shipping_details.state,
                city:data.shipping_details.city,
                street:data.shipping_details.street1,
                mobile:data.shipping_details.phone
            },
            status:request.status,
            carmodel : request.carmodel,
            brand : request.brand,
            year:request.year,
            requestImage:request?.image?.split("request/")[1],
            offerImage:offer?.image?.split("offer/")[1],
            details:request.details,
            name:request.name,
            tranRef:data.tran_ref
        })
        console.log(order);
    };
};