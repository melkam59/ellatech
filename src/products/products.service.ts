import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from 'src/entities/product.entity';
import { Transaction, TransactionType } from 'src/entities/transaction.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async update(updateProductDto: UpdateProductDto): Promise<Transaction> {
    return await this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: { id: updateProductDto.productId },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const previousQuantity = product.quantity;
      const newQuantity = previousQuantity + updateProductDto.quantity;

      if (newQuantity < 0) {
        throw new BadRequestException('Insufficient product quantity');
      }

      product.quantity = newQuantity;
      await manager.save(Product, product);

      const transaction = manager.create(Transaction, {
        productId: updateProductDto.productId,
        userId: updateProductDto.userId || null,
        type: updateProductDto.type || TransactionType.ADJUSTMENT,
        quantity: updateProductDto.quantity,
        previousQuantity,
        newQuantity,
      });

      return await manager.save(Transaction, transaction);
    });
  }

  async getStatus(productId: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }
}
