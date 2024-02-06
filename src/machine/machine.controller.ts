import { Body, Controller, HttpCode, HttpStatus, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Roles } from 'src/user/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { MachineService } from './machine.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class MachineController {

    constructor(private readonly machineService: MachineService) {
    }
  

    @HttpCode(HttpStatus.OK)
    @Post('/deposit')
    @Roles(UserRole.BUYER)
    deposit( @Body('amount',ParseIntPipe) amount:number , @Body('payload')payload){
      return this.machineService.deposit(amount,payload);
    }


    @HttpCode(HttpStatus.OK)
    @Post('/reset')
    @Roles(UserRole.BUYER)
    reset(@Body('payload')payload){
      return this.machineService.reset(payload);
    }

    @HttpCode(HttpStatus.OK)
    @Post('/buy')
    @Roles(UserRole.BUYER)
    buy( @Body('productId',ParseIntPipe) productId:number ,
    @Body('amount',ParseIntPipe) amount:number ,
    @Body('payload')payload){
      return this.machineService.buy(productId,amount,payload);
    }
}
