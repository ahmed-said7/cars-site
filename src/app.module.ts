import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { ApiModule } from './filter/api.module';
import { SchemaFactoryModule } from './schema.factory/schema.module';
import { SocketModule } from './websockets/websocket.module';
import { BrandModule } from './car brand/brand.module';
import { BrandModelModule } from './car model/model.module';
import { OwnCarsModule } from './user cars/user.cars.module';
import { AddresseModule } from './addresses/addresse.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReviewModule } from './reviews/review.module';
import { SpareModule } from './spare parts/spare.module';
import { APP_FILTER } from '@nestjs/core';
import { catchExceptionsFilter } from './errorHandler/base.filter';
import { RequestModule } from './requests/request.module.dto';
import { OfferModule } from './offers/offer.module';
import { PaytabModule } from './payment gateway/paytab.module';
import { OrderModule } from './order/order.module';


@Module({
  imports: [
    EventEmitterModule.forRoot({global:true}),
    ConfigModule.forRoot({ isGlobal:true  }),
    MongooseModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>{
        return { uri : config.get<string>("mongo") }
      },
      imports:[ConfigModule]
    }),
    OrderModule,
    SchemaFactoryModule,
    UserModule
    ,ChatModule,
    MessageModule
    ,
    ApiModule
    ,SocketModule,
    BrandModule,
    BrandModelModule,
    OwnCarsModule,
    AddresseModule,
    ReviewModule,
    SpareModule,
    RequestModule
    ,OfferModule,PaytabModule
  ],
  controllers: [],
  providers: [{provide:APP_FILTER,useClass:catchExceptionsFilter}]
})
export class AppModule {}
