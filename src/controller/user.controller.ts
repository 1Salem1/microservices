import { Controller, Get, Post, Body, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UserController {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() user: User): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    const createdUser = new this.userModel({
      username: user.username,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  @Post('login')
  async login(@Body() user: User): Promise<{ access_token: string }> {
    const existingUser = await this.userModel.findOne({
      username: user.username,
    });
    if (existingUser) {
      const isPasswordMatch = await bcrypt.compare(
        user.password,
        existingUser.password,
      );
      if (isPasswordMatch) {
        const payload = { username: existingUser.username, sub: existingUser._id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
    }
    throw new UnauthorizedException('Invalid username or password');
  }
}
