import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('signup')
    signUp(@Body() dto: CreateUserDto) {
      return this.authService.signUp(dto);
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signIn(@Body() dto: LoginDto) {
      return this.authService.signIn(dto);
    }
}
