import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { Exception } from 'src/util/exception';
import { Repository } from 'typeorm';

@Injectable()
export class MachineService {
    depositValues: number[];

    constructor( @InjectRepository(User)private usersRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>)
    {
      this.depositValues= [100,50,20,10,5];
    }

    async deposit(amount:number,payload){
        const userId = payload.id;
    

        try{
            if(! this.depositValues.includes(amount)){
                const exception = new Exception('fail','Bad Requested:please enter a vaild depoist value [5,10,20,50,100]');
                throw new HttpException(exception,HttpStatus.BAD_REQUEST);
            }
            const user = await this.usersRepository.findOneBy({id:userId});
            if(!user){
                const exception = new Exception('fail',`User with ID ${userId} not found.`);
                throw new HttpException(exception,HttpStatus.NOT_FOUND);
            }
            user.deposit += amount;
            await this.usersRepository.save(user);
            delete user.password;
            console.log(`User ${user.id} deposited ${amount} successfully.`);
            return user ;
        }
        catch(error){
            if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
                throw error;
            console.error('Error occurred during deposit:', error);
            const exception = new Exception('fail',`Internal server error`);
            throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

    async reset(payload){
        const userId = payload.id;
        try{
          const user = await this.usersRepository.findOneBy({id:userId});
          if(!user){
            const exception = new Exception('fail',`User with ID ${userId} not found.`);
            throw new HttpException(exception,HttpStatus.NOT_FOUND);
          }
          const {remaining} = this.calculateChange(user.deposit)
          user.deposit = remaining;
          await this.usersRepository.save(user);
          delete user.password;
          console.log(`User ${user.id} reset deposit successfully.`);
          return user ;
        }
        catch(error){
            if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
                throw error;
            console.error('Error occurred during deposit reset:', error);
            const exception = new Exception('fail',`Internal server error`);
            throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }


    async buy(productId:number,amount:number,payload){
        try{
            const product = await this.productRepository.findOneBy({id:productId});
            if(!product){
                const exception = new Exception('fail',`Product with ID ${productId} not found.`);
                throw new HttpException(exception,HttpStatus.NOT_FOUND);
            }
            if(product.amountAvailable<amount){
                const exception = new Exception('fail',`The amount:${amount} is more than the avaliabe`);
                throw new HttpException(exception,HttpStatus.BAD_REQUEST);
            }
            const price =  amount * product.cost
            const user = await this.usersRepository.findOneBy({id:payload.id});
            if(!user){
                const exception = new Exception('fail',`User with ID ${payload.id} not found.`);
                throw new HttpException(exception,HttpStatus.NOT_FOUND);
            }
            if(user.deposit<price){
                const exception = new Exception('fail',`User haven't sufficient balance`);
                throw new HttpException(exception,HttpStatus.BAD_REQUEST);
            }
            const {remaining,changed} = this.calculateChange(user.deposit-price);
            user.deposit = remaining;
            product.amountAvailable -= amount; 
            await this.productRepository.save(product);
            await this.usersRepository.save(user);
            delete product.seller;
            console.log(`User ${user.id} purchased ${amount} units of product ${product.id}.`);
            return{
            totalPrice:price,
            product,
            changed
            }
    }
    catch(error){
        if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
            throw error;
        console.error('Error occurred during purchase:', error);
        const exception = new Exception('fail',`Internal server error`);
        throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
    }
    }

    calculateChange(amount:number){
        let remainValue = amount;
        for(let coin of this.depositValues){
            const noOfCoins = Math.floor(remainValue/coin);
            remainValue -= (coin*noOfCoins);
        }
        return {'remaining':remainValue,'changed':amount-remainValue};
      }
}
