import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName:string;

    @IsPositive()
    @IsNotEmpty()
    cost:number;

    @IsPositive()
    @IsNotEmpty()
    amountAvailable:number;
    
    @IsNumber()
    @IsNotEmpty()
    seller:number;

}
