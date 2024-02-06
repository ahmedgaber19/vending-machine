import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';
import { Exception } from 'src/util/exception';



@Injectable()
export class UserService {

  depositValues:number[] ;

  constructor( @InjectRepository(User)
  private usersRepository: Repository<User>,){
    this.depositValues= [100,50,20,10,5];
  }


  async findOne(id: number,payload) {
    try{

      const signedUserId = payload.id;
      this.checkIdValidity(id,signedUserId)
      const user:User = await this.getUser(id);
      delete user.password;
      console.log(`User ${signedUserId} retrieved successfully.`);
      return user ;
    }
    catch(error){
      if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
        throw error;
      console.error('Error occurred during user retrieval:', error);
      const exception = new Exception('fail',`Internal server error`);
      throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
  }

  async update(id: number, updateUserDto: UpdateUserDto,payload) {
    try{

      const signedUserId = payload.id;
      this.checkIdValidity(id,signedUserId)
      const user:User = await this.getUser(id);
      if(updateUserDto.password){
        user.password =  await argon.hash(updateUserDto.password);
        await this.usersRepository.save(user);
      }
      delete user.password;
      console.log(`User ${signedUserId} updated successfully.`);
      return user;
    }
    catch(error){
      if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
        throw error;

      console.error('Error occurred during user update:', error);
      const exception = new Exception('fail',`Internal server error`);
      throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number,payload) {
    try{

      const signedUserId = payload.id;
      this.checkIdValidity(id,signedUserId)
      const user:User = await this.getUser(id);
      await this.usersRepository.delete(user);
      console.log(`User ${signedUserId} deleted successfully.`);
      return {};
    }
    catch(error){
      if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
        throw error;

      console.error('Error occurred during user deletion:', error);
      const exception = new Exception('fail',`Internal server error`);
      throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  checkIdValidity(id:number,signedUserId:number):void{
    if(isNaN(id) || id<0 ){
      const exception = new Exception('fail','Bad Requested:please enter vaild id');
      throw new HttpException(exception,HttpStatus.BAD_REQUEST);
    }
    if(id !== signedUserId){
      const exception = new Exception('fail','Forbidden:You are not authorized to access this resource.');
      throw new HttpException(exception,HttpStatus.FORBIDDEN);
    }
  }
  async getUser(id:number):Promise<User>{
    
      const user = await this.usersRepository.findOneBy({id:id});
      if(!user){
        const exception = new Exception('fail',`User with ID ${id} not found.`);
        throw new HttpException(exception,HttpStatus.NOT_FOUND);
      }
      return user
  
  }

}
