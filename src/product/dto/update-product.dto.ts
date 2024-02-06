import { IsNotEmpty, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateProductDto {
    
    @IsPositive()
    @IsOptional()
    cost?:number;

    @IsPositive()
    @IsOptional()
    amountAvailable?:number;

}
