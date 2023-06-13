import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CsrfMiddleware } from './csrf.middleware';
// import { JwtServices } from './jwt/jwt.service';
// import { AuthService } from './auth/auth.service';
import { CompanyModule } from './company/company.module';
import { DscModule } from './dsc/dsc.module';
import { ChallanModule } from './challan/challan.module';




@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Abcde123@',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
    CompanyModule,
    DscModule,
    ChallanModule,
    
  ],
  controllers: [AppController, ],
  providers: [AppService, ],
})
export class AppModule {}

