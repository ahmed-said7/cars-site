import { ArgumentMetadata, HttpException, PipeTransform } from "@nestjs/common";


export class ParseMongoId implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        if(/^[0-9a-fA-F]{24}$/.test(value)){
            return value;
        };
        throw new HttpException("provide a vaild mongodb id",400);
    };
};