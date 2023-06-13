import { Module } from '@nestjs/common';
import { DscController } from './dsc.controller';
import { DscService } from './dsc.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { DSC } from 'src/entities/dsc.entity';

@Module({  
  imports: [TypeOrmModule.forFeature([Company, User, DSC]), JwtModule],
  controllers: [DscController],
  providers: [DscService]
})
export class DscModule {}
