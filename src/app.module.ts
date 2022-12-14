import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { PizzaModule } from './pizza/pizza.module';
import { PizzaEntity } from './pizza/entity/pizza.entity';
import { DrinkModule } from './drink/drink.module';
import { DrinkEntity } from './drink/entity/drink.entity';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/entity/user.entity';
import { FileModule } from './file/file.module';
import { CommentModule } from './comment/comment.module';
import { CommentEntity } from './comment/entity/comment.entity';
import { RatingModule } from './rating/rating.module';
import { RatingEntity } from './rating/entity/rating.entity';
import { FoodService } from './food/food.service';
import { FoodModule } from './food/food.module';
import { FoodEntity } from './food/entity/food.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '5940530bbbb',
      database: 'pizza',
      entities: [
        PizzaEntity,
        DrinkEntity,
        UserEntity,
        CommentEntity,
        RatingEntity,
        FoodEntity,
      ],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    FileModule,
    CommentModule,
    RatingModule,
    FoodModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
