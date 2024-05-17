import { HttpException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import * as paytabs from "paytabs_pt2";
import { mongodbId } from "src/chat/chat.service";
import { UserDoc } from "src/schema.factory/user.schema";
import axios  from "axios";
import { EventEmitter2 } from "@nestjs/event-emitter";
interface metadata {
    offerId:mongodbId;
    price: number;
};


@Injectable()
export class Paytab {

    constructor(private events:EventEmitter2){};
    async getPaymentUrl(res:Response,user:UserDoc,meta:metadata){
        let profileID = process.env.profileId;
        let serverKey = process.env.serverkey;
        let region = process.env.region;
        paytabs.setConfig( profileID, serverKey, region);
        let paymentMethods = ["all"];
        let transaction_details = [
            "sale", // transaction type
            "ecom" // transaction class
        ];
        let cart_details = [
            meta.offerId,//cart.id
            process.env.currency, //cart.currency,
            meta.price,//cart.amount,
            "buy mechanical parts",//cart.description
        ];
        let customer_details = [
            user?.name,//customer.name,
            user?.email,// customer.email,
            //meta?.phone,// customer.phone,
            //meta?.street,// customer.street,
            //meta?.city,// customer.city,
            //meta?.state,//customer.state,
            //meta?.country || "saudi arabia",// customer.country,
            //meta?.zip,// "000000"// customer.zip,
            //meta?.ip// "127.0.0.1",// customer.IP
        ];
        let shipping_address = customer_details;
        let response_URLs = [
            process.env.response,
            process.env.callback
        ];
        let lang = "ar";
        let paymentPageCreated = function (results) {
            res.status(200).json({ url:results.redirect_url });
        };
        let frameMode = true;
        paytabs.createPaymentPage(
            paymentMethods,
            transaction_details,
            cart_details,
            customer_details,
            shipping_address,
            response_URLs,
            lang,
            paymentPageCreated,
            frameMode 
        );
    };
    async ValidatePayment(req:Request){
        if(req.body.tranRef){
            const data = {
                profile_id: process.env.profileId,
                tran_ref: req.body.tranRef
            };
            const config = {
                method: 'post',
                url: `${process.env.paytaburl}/payment/query`,
                headers: {
                    Authorization: process.env.serverkey,
                    'Content-Type': 'application/json',
                }, data
            };
            try{
                const res=await axios(config);
                const data=res.data;
                if( data?.payment_result?.response_status && data?.payment_result?.response_status == "A" ){
                    this.events.emit("payment.created",data);
                };
            }catch(err){
                console.log("paymentFailed");
                // throw new HttpException("paymentFailed", 400);
            };
        };
    }
};

export interface IResponsePaytab{
    tran_ref: string,
    tran_type: string,
    cart_id: string,
    cart_description: string,
    cart_currency: string,
    cart_amount: string,
    tran_currency: string,
    tran_total: string,
    customer_details: {
        name: string,
        email: string,
        phone: string,
        street1: string,
        city: string,
        state: string,
        country: string,
        ip: string
    },
    shipping_details: {
        name: string,
        email: string,
        phone: string,
        street1: string,
        city: string,
        state: string,
        country: string
    },
    payment_result: {
        response_status: string,
        response_code: string,
        response_message: string,
        transaction_time: string
    },
    payment_info: {
        payment_method: string,
        card_type: string,
        card_scheme: string,
        payment_description: string,
        expiryMonth: number,
        expiryYear: number
    },
        serviceId: number,
        profileId: number,
        merchantId: number,
        trace: string
}