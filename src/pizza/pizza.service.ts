import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PizzaEntity } from './entity/pizza.entity';
import { Repository } from 'typeorm';
import { CreatePizzaDto } from './dto/createPizza.dto';
import { getOneFood } from '../components/forServices/getOneFood';
import { deleteFood } from '../components/forServices/deleteFood';
import { UserEntity } from '../user/entity/user.entity';
import { SearchFoodDto } from '../food/dto/search.dto';

@Injectable()
export class PizzaService {
  constructor(
    @InjectRepository(PizzaEntity)
    private readonly repository: Repository<PizzaEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll() {
    return await this.repository.find({
      order: {
        rating: 'DESC',
      },
    });
  }

  async search(dto: SearchFoodDto) {
    const qb = this.repository.createQueryBuilder('pizza');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.title) {
      qb.andWhere('pizza.title ILIKE :title');
    }

    if (dto.views) {
      qb.orderBy('views', dto.views);
    }

    if (dto.price) {
      qb.orderBy('price', dto.price);
    }

    if (dto.rating) {
      qb.orderBy('rating', dto.rating);
    }

    if (dto.favorites) {
      qb.orderBy('favorites', dto.favorites);
    }

    qb.setParameters({
      title: `%${dto.title}%`,
      views: `%${dto.views}%`,
      price: `%${dto.price}%`,
      rating: `%${dto.rating}%`,
      favorites: `%${dto.favorites}%`,
    });

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

  async findOne(id: string) {
    return getOneFood(id, 'pizza', this);
  }

  async create(dto: CreatePizzaDto) {
    // return createFood(dto.title, dto.imageUrl, dto.price, dto.category, this);
  }

  async update(id: string, dto: CreatePizzaDto) {
    // return updateFood(
    //   id,
    //   dto.title,
    //   dto.imageUrl,
    //   dto.price,
    //   dto.category,
    //   this,
    // );
  }

  async delete(id: string) {
    // await deleteFood(id, 'pizza', this.repository);
  }

  async addToFavorites(id: string, userId: string) {
    const pizza = await getOneFood(id, 'pizza', this);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const isNotFavorites =
      user.favorites.findIndex((obj) => obj.id === pizza.id) === -1;

    if (isNotFavorites) {
      user.favorites.push(pizza);
      pizza.favorites++;
      await this.userRepository.save(user);
      await this.repository.save(pizza);
    }

    return { pizza: pizza };
  }

  async removeFromFavorites(id: string, userId: string) {
    const pizza = await getOneFood(id, 'pizza', this);

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favorites'],
    });

    const pizzaIndex = user.favorites.findIndex((obj) => obj.id === pizza.id);

    if (pizzaIndex >= 0) {
      user.favorites.splice(pizzaIndex, 1);
      pizza.favorites--;
      await this.userRepository.save(user);
      await this.repository.save(pizza);
    }

    return pizza;
  }

  async updateRating(id: string, newRating: number) {
    return this.repository.update(
      { id },
      {
        rating: newRating,
      },
    );
  }
}
