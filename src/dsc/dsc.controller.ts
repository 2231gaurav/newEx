import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param
} from '@nestjs/common';

import { DscService } from './dsc.service';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDscDto {
  @IsNotEmpty()
  @IsString()
  signatoryName: string;

  @IsNotEmpty()
  @IsDateString()
  signExpiryDate: Date;

  @IsNotEmpty()
  // @IsNumber()
  companyId: number; // Add the userId field
}

export class UpdateDscDto {
  signatoryName?: string;
  signExpiryDate?: Date;
}


@Controller('dsc')
export class DscController {
  constructor(private readonly dscService: DscService) {}

  @Post('register')
  async registerDSC(@Body() registerDscDto: RegisterDscDto): Promise<any> {
    const dsc = await this.dscService.registerDSC(registerDscDto);
    return { message: 'Dsc details registered successfully', dsc };
  }
  @Get('list')
  async getAllDscs(): Promise<any> {
    const dscs = await this.dscService.getAllDscs();
    return { dscs };
  }
  @Post('search')
  async getDscByCriteria(@Body() body: { signatoryName?: string; companyId?: string }): Promise<any> {
    const dscs = await this.dscService.getDscByCriteria(body);
    return { dscs };
  }
  @Patch(':id')
  async updateDsc(@Param('id') id: number, @Body() updateDscDto: UpdateDscDto): Promise<any> {
    const updatedDsc = await this.dscService.updateDsc(id, updateDscDto);
    return { message: 'DSC updated successfully', dsc: updatedDsc };
  }
}
