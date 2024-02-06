import { Module } from '@nestjs/common';
import { MachineController } from './machine.controller';
import { MachineService } from './machine.service';
import { UserModule } from 'src/user/user.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports:[UserModule,ProductModule],
  controllers: [MachineController],
  providers: [MachineService],

})
export class MachineModule {}
