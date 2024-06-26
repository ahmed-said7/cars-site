import { HttpException, Injectable } from "@nestjs/common";
import mongoose, { Model, Query } from "mongoose";
import { mongodbId } from "src/chat/chat.service";
import { apiFeatures, g } from "./api.service";
import { Models } from "src/enums/models";

export type Opts= 
    {path:string; select?:string , populate?:Opts , model?:Models }[] 
    | {path:string; select?:string , populate?:Opts , model?:Models }


@Injectable()
export class CrudService <doc extends mongoose.Document , m extends g > {
    constructor(private api:apiFeatures<doc,m>){};
    async getDocument(
        id:mongodbId,
        model:Model<doc> ,
        opts? : Opts
    ){
        let query=model.findById(id);
        if(opts){
            query=query.populate(opts);
        };
        const doc=await query;
        if(!doc){
            throw new HttpException("document not found",400);
        };
        return doc;
    };
    async deleteDocument(
        id:mongodbId,
        model:Model<doc> 
    ){
        let query=await model.findByIdAndDelete(id);
        if(!query){
            throw new HttpException("document not found",400);
        };
    };
    async getAllDocs(
        query:Query<doc[],doc>,queryObj:m
        ,obj={},populationOptions?:Opts
    ){
        let api=this.api.filter(query,queryObj,obj);
        if(populationOptions){
            api=api.population(populationOptions);
        };
        let { query:result , paginationObj  }=await api.sort().search()
            .select().pagination();
        const data=await result;
        return { data , paginationObj };
    };
};