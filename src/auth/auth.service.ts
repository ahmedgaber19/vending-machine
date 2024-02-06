import { ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Exception } from 'src/util/exception';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
    )
    {}
    
    
    async signUp(dto: CreateUserDto) {

        try{
            const user = await this.usersRepository.findBy({userName:dto.username});
            if(user.length!==0){
                const exception = new Exception('fail',`Username '${dto.username}' already exists`);
                throw new HttpException(exception,HttpStatus.CONFLICT);
            }
            const newUser = new User();
            newUser.userName = dto.username;
            newUser.password = await argon.hash(dto.password);
            newUser.role = dto.role;
            
            const savedUser = await this.usersRepository.save(newUser);
            delete savedUser.password
            console.log(`User '${savedUser.userName}' signed up successfully.`);

            return savedUser;
        }
        catch(error)
        {
            if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
                throw error;
            else{
                console.error('Error occurred during sign up:', error);
                const exception = new Exception('fail',`Internal server error`);
                throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    

    async signIn(dto: LoginDto) {
        try
        { 
            const user = await this.usersRepository.findOneBy({userName:dto.username})
            if(!user){
                const exception = new Exception('fail',`Cardinalities incorrect`);
                throw new HttpException(exception,HttpStatus.FORBIDDEN);
            }
            const passwordMatch = await argon.verify(user.password,dto.password);
            if(!passwordMatch){
                const exception = new Exception('fail',`Cardinalities incorrect`);
                throw new HttpException(exception,HttpStatus.FORBIDDEN);
            }
            const payload = { username: user.userName ,id:user.id,role:user.role };
            console.log(`User '${user.userName}' signed in successfully.`);
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        }
    catch(error)
    {
        if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
            throw error;
          else
          {
            console.log('Internal server error occurred during sign in:', error);
            const exception = new Exception('fail',`Internal server error`);
            throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
          }
            
    }
}

}
