import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { User } from '../user/decorators/user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  findAll(@Query() query: { foodId?: string }) {
    return this.commentService.findAll(+query.foodId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Auth()
  create(@Body() dto: CreateCommentDto, @User('id') userId: string) {
    return this.commentService.create(dto, userId);
  }

  @Put(':id')
  @UseGuards()
  @Auth()
  update(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @User('id') userId: string,
  ) {
    return this.commentService.update(id, userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string, @User('id') userId: string) {
    return this.commentService.remove(id, userId);
  }
}
