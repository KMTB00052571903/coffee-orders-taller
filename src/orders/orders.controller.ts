import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrderQueryDto } from './dto/filter-orders-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const requestValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body(requestValidationPipe) createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get('search')
  search(@Query(requestValidationPipe) query: FilterOrderQueryDto) {
    return this.ordersService.findFiltered(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }

  @Patch(':id/ready')
  markAsReady(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.markAsReady(id);
  }

  @Get(':id/estimate')
  estimatePreparationTime(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.estimatePreparationTime(id);
  }

  @Get('pending')
  findRecentPending() {
    return this.ordersService.findRecentPending();
  }
}
