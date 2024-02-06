import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe, DefaultValuePipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/user/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(UserRole.SELLER)
  @UseGuards(AuthGuard)
  create(@Body() createProductDto: CreateProductDto,@Body('payload') payload) {
    return this.productService.create(createProductDto,payload);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    return this.productService.findAll({page,limit});
  }

  @Get(':id')
  findOne(@Param('id',new ParseIntPipe()) id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.SELLER)
  @UseGuards(AuthGuard)
  update(@Param('id',new ParseIntPipe()) id: string, @Body() updateProductDto: UpdateProductDto,@Body('payload') payload) {
    return this.productService.update(+id,updateProductDto,payload);
  }

  // @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Roles(UserRole.SELLER)
  @UseGuards(AuthGuard)
  remove(@Param('id',new ParseIntPipe()) id: string,@Body('payload') payload) {
    return this.productService.remove(+id,payload);
  }


}
