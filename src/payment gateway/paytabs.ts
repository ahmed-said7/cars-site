import { HttpException, Injectable } from "@nestjs/common";
import { Request, Response } from "express";
import { mongodbId } from "src/chat/chat.service";
import { UserDoc } from "src/schema.factory/user.schema";
import axios  from "axios";
import { EventEmitter2 } from "@nestjs/event-emitter";
interface metadata {
    cartId:mongodbId;
    price: number;
};

interface Urls {
    callback:string;
    response:string;
};

@Injectable()
export class Paytab {
    constructor(private events:EventEmitter2){};
    async paymentUrlUsingAxios(
        res:Response,user:UserDoc,
        meta:metadata,
        url:Urls
    ){
        return this.payUrl(
            res,user,
            url.callback,
            url.response,
            meta.cartId,
            meta.price
        );
    };
    async ValidateOfferPayment(req:Request){
        if(req.body.tran_ref){
            this.validationCallback(req.body.tran_ref).then((res) => {
                const data=res.data;
                if( data?.payment_result?.response_status && data?.payment_result?.response_status == "A" ){
                    this.events.emit("offer.payment",data);
                };
            }).catch((error) => {
                console.error('Payment query failed:', error);
            });
        };
    };
    private payUrl(
        res:Response,
        user:UserDoc,
        callback:string,
        response:string,
        cartId:mongodbId,
        price:number
    ){
        const profileId = process.env.profileId; 
        const serverKey = process.env.serverkey;
        const data = {
            profile_id: profileId,
            tran_type: "sale",
            tran_class: "ecom",
            cart_id: cartId,
            cart_description: "buy mechanical parts",
            cart_currency: process.env.currency,
            cart_amount: price,
            callback: callback,
            return: response,
            customer_details : {
                name:user?.name,
                email:user?.email
            }
        };
        const headers = {
            'Authorization': serverKey,
            'Content-Type': 'application/json'
        };
        axios.post("https://secure.paytabs.sa/payment/request", data, { headers })
            .then(response => {
                res.status(200).json({ data: response.data.redirect_url })
            })
            .catch(error => {
                throw new HttpException("creating payment url error",400);
            });
    };
    private validationCallback(tran_ref:string){
        const profileId = process.env.profileId; 
        const tranRef = tran_ref;
        const serverKey = process.env.serverkey;
        const data = {
            profile_id: profileId,
            tran_ref: tranRef
        };
        const config = { method: 'post',
            url: "https://secure.paytabs.sa/payment/query",
            headers: {
                Authorization: serverKey, 
                'Content-Type': 'application/json'
            }
            ,data 
        };
        return axios(config);
    };
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