import { IsEnum, IsNotEmpty, IsNumber, IsString, isEnum } from "class-validator";
import { UserRole } from "../../user/user-role.enum";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username:string;
    
    @IsString()
    @IsNotEmpty()
    password:string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role:string;
}
