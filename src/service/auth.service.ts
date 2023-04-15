import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/interfaces/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: User) {
    const authenticatedUser = await this.validateUser(user.username, user.password);
    if (!authenticatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: authenticatedUser.username, sub: authenticatedUser._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
