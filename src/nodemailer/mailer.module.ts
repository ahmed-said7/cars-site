import { Module } from "@nestjs/common";
import { mailerService } from "./mailer.service";


@Module({
    providers:[mailerService],
    exports:[mailerService]
})
export class mailerModule {};