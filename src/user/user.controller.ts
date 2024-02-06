import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  
  @Get(':id')
  findOne(@Param('id',new ParseIntPipe()) id: string, @Body('payload') payload) {
    return this.userService.findOne(+id,payload);
  }

  @Patch(':id')
  update(@Param('id',new ParseIntPipe()) id: string, @Body() updateUserDto: UpdateUserDto, @Body('payload') payload) {
    return this.userService.update(+id, updateUserDto,payload);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id',new ParseIntPipe()) id: string, @Body('payload') payload) {
    return this.userService.remove(+id,payload);
  }

}
