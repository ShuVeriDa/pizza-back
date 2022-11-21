import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto } from './dto/auth.dto';
import { UserEntity } from '../user/entity/user.entity';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(String(user.id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async validateUser(dto: AuthDto) {
    const user = await this.repository.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException('User not found');

    const isValidPassword = await compare(dto.password, user.password); // сравнение пароля который пришел из dto с паролемя который находится в базе данных
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async register(dto: AuthDto) {
    const oldUser = await this.repository.findOneBy({ email: dto.email });

    if (oldUser)
      throw new BadRequestException(
        'User with this email is already in the system',
      );

    const salt = await genSalt(10);

    const user = await this.repository.save({
      nickName: dto.nickName,
      email: dto.email,
      password: await hash(dto.password, salt),
      isAdmin: dto.isAdmin,
    });

    const tokens = await this.issueTokenPair(String(user.id));

    try {
      return {
        user: this.returnUserFields(user),
        ...tokens,
      };
    } catch (error) {
      throw new ForbiddenException('Registration error.');
    }
  }

  async getNewTokens({ refreshToken }: RefreshTokenDto) {
    if (!refreshToken) throw new UnauthorizedException('Please sing in');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expired');

    const user = await this.repository.findOneBy({ id: result.id });

    const tokens = await this.issueTokenPair(String(user.id));

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async issueTokenPair(userId: string) {
    const data = { id: userId };

    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '15d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1d',
    });

    return { refreshToken, accessToken };
  }

  returnUserFields(user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      nickName: user.nickName,
    };
  }
}