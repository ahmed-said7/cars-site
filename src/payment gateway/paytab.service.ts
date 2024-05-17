import { HttpException, Injectable } from "@nestjs/common";
import { CreatePaytabUrlDto } from "./dto/create.url.dto";
import { mongodbId } from "src/chat/chat.service";
import { UserDoc } from "src/schema.factory/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { Model } from "mongoose";
import { OfferDoc  } from "src/schema.factory/offer.schema";
import { RequestDoc } from "src/schema.factory/request.schema";
import { Paytab } from "./paytabs";
import { Request, Response } from "express";

@Injectable()
export class PaytabService {
    constructor(
        @InjectModel(Models.Offer) private offerModel:Model<OfferDoc>,
        @InjectModel(Models.Request) private reqModel:Model<RequestDoc>,
        private paytab:Paytab
    ){}
    async getPaytabUrl(res:Response, body:CreatePaytabUrlDto,offerId:mongodbId,user:UserDoc ){
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
        return this.paytab.getPaymentUrl(
            res,user,
            { ... body , price:offer.price , requestId:offer.request  }
        )
    };
    async validateCallback(req:Request){
        this.paytab.ValidatePayment(req);
    };
};