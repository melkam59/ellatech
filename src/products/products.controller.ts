import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from 'src/entities/product.entity';
import { Transaction } from 'src/entities/transaction.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @Put('update')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Transaction> {
    return await this.productsService.update(updateProductDto);
  }

  @Get('status/:productId')
  @HttpCode(HttpStatus.OK)
  async getStatus(@Param('productId') productId: string): Promise<Product> {
    return await this.productsService.getStatus(productId);
  }
}
