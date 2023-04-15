import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { User } from './models/user';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: User }]),
    MongooseModule.forRoot("mongodb+srv://salem:BjiWZPFy4hCBNfju@cluster0.yyhfd.mongodb.net/?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),

    
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1h' },
    })
    
  ],
  controllers: [UserController],
})
export class AppModule {}
