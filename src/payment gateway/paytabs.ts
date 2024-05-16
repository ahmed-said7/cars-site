import { Injectable } from "@nestjs/common";
import { Response } from "express";
import * as paytabs from "paytabs_pt2";
import { mongodbId } from "src/chat/chat.service";
import { UserDoc } from "src/schema.factory/user.schema";

interface metadata {
    phone: string;
    street: string;
    city: string;
    state?: string;
    country?: string;
    zip?:string;
    ip?:string;
    requestId:mongodbId;
    price: number;
};


@Injectable()
export class Paytab {
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
            meta.requestId,//cart.id
            process.env.currency, //cart.currency,
            meta.price,//cart.amount,
            "buy mechanical parts",//cart.description
        ];
        let customer_details = [
            user?.name,//customer.name,
            user?.email,// customer.email,
            meta?.phone,// customer.phone,
            meta?.street,// customer.street,
            meta?.city,// customer.city,
            meta?.state,//customer.state,
            meta?.country || "saudi arabia",// customer.country,
            meta?.zip,// "000000"// customer.zip,
            meta?.ip// "127.0.0.1",// customer.IP
        ];
        let shipping_address = customer_details;
        let response_URLs = [
            process.env.response,//url.response,
            process.env.callback//url.callback
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
};