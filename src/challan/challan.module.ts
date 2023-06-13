import { Module } from '@nestjs/common';
import { ChallanService } from './challan.service';
import { ChallanController } from './challan.controller';
import { Challan } from 'src/entities/challan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { User } from 'src/entities/user.entity';
import { DSC } from 'src/entities/dsc.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Company, User, DSC, Challan]), JwtModule],
  providers: [ChallanService],
  controllers: [ChallanController]
})
export class ChallanModule {}
