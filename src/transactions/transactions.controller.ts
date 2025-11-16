import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from 'src/entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Transaction[]> {
    return await this.transactionsService.findAll();
  }
}
