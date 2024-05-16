import { Module } from "@nestjs/common";
import { apiFeatures } from "./api.service";
import { CrudService } from "./crud.service";

@Module({
    exports:[apiFeatures,CrudService],
    providers:[apiFeatures,CrudService]
})
export class ApiModule {};