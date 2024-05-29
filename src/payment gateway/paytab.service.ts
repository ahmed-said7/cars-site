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
import { SpareDoc } from "src/schema.factory/spare.schema";

@Injectable()
export class PaytabService {
    constructor(
        @InjectModel(Models.Offer) private offerModel:Model<OfferDoc>,
        @InjectModel(Models.Request) private reqModel:Model<RequestDoc>,
        @InjectModel(Models.Order) private orderModel:Model<OrderDoc>,
        private paytab:Paytab
    ){}
    async createOfferPaymentUrl(res:Response, offerId:mongodbId,user:UserDoc ){
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
        const meta={  price:offer.price , cartId:offer._id  };
        const urls={ 
            callback: process.env.callback , 
            response:process.env.response 
        };
        return this.paytab.paymentUrlUsingAxios(res,user,meta,urls)
    };
    async validateOfferCallback(req:Request){
        this.paytab.ValidateOfferPayment(req);
    };
    @OnEvent("offer.payment")
    private async offerPaymentCreated(data:IResponsePaytab){
        const offer=await this.offerModel.findByIdAndUpdate(
            data.cart_id
            ,{
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
            offer:offer._id,
            request:request._id,
            tranRef:data.tran_ref
        });
        console.log(order);
    };
    // @OnEvent("spare.payment")
    // private async sparePaymentCreated(data:IResponsePaytab){
    //     const user=await this.userModel.findById(data.cart_id)
    //     if( !user ){
    //         console.log("user not found");
    //     };
    //     const spares=await this.spareModel.find();
    //     const reqs=spares.map( (spare) => {
    //         return { 
    //             name:spare.name,
    //             carmodel:spare.carmodel,
    //             brand:spare.brand,
    //             user:data.cart_id,
    //             year:spare.from,
    //             image:spare.image?.split("spare/")[1]
    //         }
    //     });
    //     const result=await this.reqModel.insertMany(reqs);
    //     console.log("payment completed");
    // };
};