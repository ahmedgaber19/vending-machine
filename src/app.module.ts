import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { MachineModule } from './machine/machine.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    TypeOrmModule.forRoot(
    {
    type:'sqlite',
    database:'./db.sqlite',
    entities:['dist/**/*.entity.js'],
    synchronize:true
    }
  ), UserModule, AuthModule, ProductModule, MachineModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
