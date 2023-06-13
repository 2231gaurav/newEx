import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common';

import { IsNotEmpty, IsNumber, IsDateString, IsUrl, IsOptional } from 'class-validator';
import { ChallanService } from './challan.service';
import { Challan } from 'src/entities/challan.entity';

export class CreateChallanDto {
  @IsNotEmpty()
  companyId: number;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  month: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfProcessing: Date;

  @IsNotEmpty()
  @IsNumber()
  PFAmount: number;

  @IsNotEmpty()
  @IsNumber()
  ESIAmount: number;

  @IsNumber()
  Total?: Number

  @IsUrl()
  @IsOptional()
  ChallanLink?: string;

  @IsUrl()
  @IsOptional()
  ECRLink?: string;

  @IsUrl()
  @IsOptional()
  SalarySheetLink?: string;

  @IsUrl()
  @IsOptional()
  PS_PFLink?: string;

  @IsUrl()
  @IsOptional()
  PS_ESILink?: string;

  
}

export class UpdateChallanDto {
  id: number;
  companyId: number;
  userId: number;
  month: string;
  year: number;
  // Define the properties you want to update in the Challan entity
  PF?: number;
  ESI?: number;
  // Add other properties as needed
  ChallanLink?: string;
  ECRLink?: string;
  SalarySheetLink?: string;
  PS_PFLink?: string;
  PS_ESILink?:string;

}


@Controller('challan')
export class ChallanController {
    constructor(private readonly challanService: ChallanService) {}

  @Post('enter')
  async createChallan(@Body() createChallanDto: CreateChallanDto): Promise<any> {
    try {
      const createdChallan = await this.challanService.createChallan(createChallanDto);
      return { success: true, data: createdChallan };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  @Post('update')
  async updateChallan(
    @Body() updateChallanDto: UpdateChallanDto,
  ): Promise<any> {
    return this.challanService.updateChallan(updateChallanDto);
  }

  @Get('all')
  async getAllChallans(): Promise<Challan[]> {
    return this.challanService.getAllChallans();
  }

  @Post('filters')
  async getChallansByFilters(@Body() filterParams: any): Promise<Challan[]> {
    return this.challanService.getChallansByFilters(filterParams);
  }

  @Delete(':id')
  async deleteChallan(@Param('id') id: string): Promise<string> {
    const challanId = parseInt(id, 10);
    try {

      const message = await this.challanService.deleteChallan(challanId);
      return message;
    } catch (error) {
      return 'Challan not found'
    }

    
  }
}

