import {  HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from './entities/product.entity';
import {
  paginate,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Exception } from 'src/util/exception';


@Injectable()
export class ProductService {

  constructor(@InjectRepository(User)
  private usersRepository: Repository<User>,
  @InjectRepository(Product)
  private productRepository: Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto,payload) {
    try{

    
    if( createProductDto.seller !== payload.id ){
      const exception = new Exception('fail','Forbidden:You are not authorized.');
      throw new HttpException(exception,HttpStatus.FORBIDDEN);
    }
  
    
    const product = new Product();
    const user = await this.usersRepository.findOneBy({id:createProductDto.seller});
    if(!user){
      const exception = new Exception('fail','Bad Requested:Seller id is not valid');
      throw new HttpException(exception,HttpStatus.BAD_REQUEST);
    }
    product.amountAvailable = createProductDto.amountAvailable;
    product.cost = createProductDto.cost;
    product.productName = createProductDto.productName;
    product.seller = user;
    await this.productRepository.save(product);
    delete product.seller;
    console.log(`Product created successfully by user ${payload.id}.`);
    return  product;
  }
  catch(error){
    if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
      throw error;
    console.log('Error occurred during product creation:', error);
    const exception = new Exception('fail',`Internal server error`);
    throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
  }
 
  }

  async findAll(options: IPaginationOptions) {
    try{
      const paginatedResult =  await  paginate<Product>(this.productRepository, options);
      const modifiedItems = paginatedResult.items.map((item) => {
        const { seller, ...rest } = item;
        return rest;
      });
      return modifiedItems
    }
    catch(error)
    {
      console.error('Error occurred during product retrieval:', error);
      const exception = new Exception('fail',`Internal server error`);
      throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async findOne(id: number):Promise<Product> {
    try{

      this.checkIdValidty(id)
      const product = await this.productRepository.findOneBy({id:id});
      delete product.seller
      console.log(`Product ${id} retrieved successfully.`);
      return product ;
    }
    catch(error){
      if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
        throw error;
      console.error('Error occurred during product retrieval:', error);
      const exception = new Exception('fail',`Internal server error`);
      throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto,payload):Promise<Product> {
    try{
      this.checkIdValidty(id)
      const sigedUserId = payload.id;
      const product:Product = await this.getProduct(id,sigedUserId);
    if(updateProductDto.cost){
      product.cost = updateProductDto.cost;
    }
    if(updateProductDto.amountAvailable){
      product.amountAvailable = updateProductDto.amountAvailable;
    }
    await this.productRepository.save(product);
    delete product.seller
    console.log(`Product ${id} updated successfully.`);
    return product ;
  }
  catch(error)
  {
    if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
      throw error;
    console.error('Error occurred during product update:', error);
    const exception = new Exception('fail',`Internal server error`);
    throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);

  }
    

  }

  async remove(id: number,payload):Promise<void> {
    try{

      this.checkIdValidty(id)
      const sigedUserId = payload.id;
      const product:Product = await this.getProduct(id,sigedUserId);
      await this.productRepository.delete(product);
      console.log(`Product ${id} deleted successfully.`);
      return;
    }
    catch(error){
      if (error instanceof HttpException && error.getStatus() !== HttpStatus.INTERNAL_SERVER_ERROR) 
        throw error;
      console.error('Error occurred during product deletion:', error);
      const exception = new Exception('fail',`Internal server error`);
      throw new HttpException(exception,HttpStatus.INTERNAL_SERVER_ERROR);

    }
  }

  checkIdValidty(id:number):void{
    if(isNaN(id) || id<0 ){
      const exception = new Exception('fail','Bad Requested:please enter vaild id');
      throw new HttpException(exception,HttpStatus.BAD_REQUEST);
    }
  }

  async getProduct(id:number,sigedUserId:number):Promise<Product>{
      const product = await this.productRepository.findOneBy({id:id});
      if(!product){
        const exception = new Exception('fail',`Product with ID ${id} not found.`);
        throw new HttpException(exception,HttpStatus.NOT_FOUND);
      }
      console.log()
      if(product.seller.id !== sigedUserId){
        const exception = new Exception('fail','Forbidden:You are not authorized to access this resource.');
        throw new HttpException(exception,HttpStatus.FORBIDDEN);
      }
      return product      

  }
  
}
