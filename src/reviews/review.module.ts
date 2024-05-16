import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Models } from "src/enums/models";
import { ApiModule } from "src/filter/api.module";
import { ReviewSchema } from "src/schema.factory/review.schema";
import { SchemaFactoryModule } from "src/schema.factory/schema.module";
import { UserSchema } from "src/schema.factory/user.schema";
import { ReviewService } from "./review.service";
import { ReviewController } from "./review.controller";


@Module({
    imports:
    [
        ApiModule,SchemaFactoryModule,
        MongooseModule.forFeatureAsync([
            {
                imports:[SchemaFactoryModule],
                inject:[ReviewSchema],
                name:Models.Review,
                useFactory:function(reviewSchema:ReviewSchema){
                    return reviewSchema.schema;
                }
            },
            {
                imports:[SchemaFactoryModule],
                inject:[UserSchema],
                name:Models.User,
                useFactory:function(userSchema:UserSchema){
                    return userSchema.schema;
                }
            }
        ])
    ],
    controllers : [ReviewController],
    providers : [ReviewService]
})
export class ReviewModule {};