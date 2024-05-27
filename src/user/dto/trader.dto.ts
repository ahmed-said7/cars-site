

import { IsBoolean, IsOptional } from "class-validator";

export enum tradingType {
    used="used",
    new="new"
};

export class allowTradingDto {
    @IsOptional()
    @IsBoolean()
    allowTrading:boolean;
};




