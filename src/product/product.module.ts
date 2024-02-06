import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Product]),
    UserModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports:[TypeOrmModule]
})
export class ProductModule {}
