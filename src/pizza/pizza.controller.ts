import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PizzaService } from './pizza.service';
import { CreatePizzaDto } from './dto/createPizza.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '../user/decorators/user.decorator';
import { SearchFoodDto } from '../food/dto/search.dto';

@Controller('pizza')
export class PizzaController {
  constructor(private readonly pizzaService: PizzaService) {}

  @Get()
  findAll() {
    return this.pizzaService.findAll();
  }

  @Get('/search')
  search(@Query() dto: SearchFoodDto) {
    return this.pizzaService.search(dto);
  }

  @Get(':id')
  @Auth('admin')
  findOne(@Param('id') id: string) {
    return this.pizzaService.findOne(id);
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  create(@Body() createPizzaDto: CreatePizzaDto) {
    return this.pizzaService.create(createPizzaDto);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  update(@Param('id') id: string, @Body() dto: CreatePizzaDto) {
    return this.pizzaService.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  delete(@Param('id') id: string) {
    return this.pizzaService.delete(id);
  }

  @Post(':id/favorites')
  @Auth()
  async addPizzaToFavorites(
    @User('id') userId: string,
    @Param('id') id: string,
  ) {
    return await this.pizzaService.addToFavorites(id, userId);
  }

  @Delete(':id/favorites')
  @Auth()
  async deletePizzaFromFavorites(
    @User('id') userId: string,
    @Param('id') id: string,
  ) {
    return await this.pizzaService.removeFromFavorites(id, userId);
  }
}
