import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Company, User]), JwtModule],
  providers: [CompanyService],
  controllers: [CompanyController]
})
export class CompanyModule {}
