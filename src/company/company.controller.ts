// import { Controller, Post, Body } from '@nestjs/common';
// import { CompanyService } from './company.service';

// @Controller('company')
// export class CompanyController {
//   constructor(private readonly companyService: CompanyService) {}

//   @Post('register')
//   async registerCompany(
//     @Body('companyCode') companyCode: string,
//     @Body('companyName') companyName: string,
//     @Body('companyEmail') companyEmail: string,
//     @Body('companyContact') companyContact: string,
//     @Body('companyAddress') companyAddress: string,
//   ): Promise<any> {
//     const company = await this.companyService.registerCompany(
//       companyCode,
//       companyName,
//       companyEmail,
//       companyContact,
//       companyAddress,
//     );

//     return { message: 'Company registered successfully', company };
//   }
// }

import { Controller, Post, Body, BadRequestException , Get, NotFoundException, InternalServerErrorException, Param, Patch} from '@nestjs/common';
import { CompanyService } from './company.service';
import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

class RegisterCompanyDto {
  @IsNotEmpty()
  @IsString()
  companyCode: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsEmail()
  companyEmail: string;

  @IsNotEmpty()
  @IsNumber()
  userId: number; // Add the userId field

//   @IsNotEmpty()
  @IsOptional()
  @IsString()
  companyContact?: number;

  @IsOptional()
  @IsString()
  companyAddress?: string;

  
}

class UpdateCompanyDto {
  

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsEmail()
  companyEmail?: string;

  @IsOptional()
  @IsString()
  companyContact?: string;

  @IsOptional()
  @IsString()
  companyAddress?: string;
}

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register')
  async registerCompany(@Body() registerCompanyDto: RegisterCompanyDto): Promise<any> {
    const { companyCode, companyName, companyEmail, companyContact, companyAddress, userId } = registerCompanyDto;

    if (!companyCode || !companyName || !companyEmail) {
      throw new BadRequestException('Missing required data');
    }

    const company = await this.companyService.registerCompany(
      companyCode,
      companyName,
      companyEmail,
      companyContact,
      companyAddress,
      String(userId),
      
    );

    return { message: 'Company registered successfully', company };
  }

  @Get('list')
  async getAllCompanies(): Promise<any> {
    const companies = await this.companyService.getAllCompanies();
    return { companies };
  }

  @Get(':companyCode')
  async getCompanyByCode(@Param('companyCode') companyCode: string): Promise<any> {
    const company =  await this.companyService.getCompanyByCode(companyCode);
    return {company}
  }

  @Post('deactivate')
  async deactivateCompany(@Body('companyCode') companyCode: string): Promise<any> {
    try {
      await this.companyService.deleteCompany(companyCode);
      return { message: 'Company has been de-activated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (
        error instanceof Error &&
        error.message === 'Company is already deactivated'
      ) {
        throw new InternalServerErrorException('Company is already deactivated');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while deactivating the company.',
        );
      }
    }
  }

  @Post('reactivate')
  async reactiveCompany(@Body('companyCode') companyCode: string): Promise<any> {
    try{
      await this.companyService.reactivateCompany(companyCode);
      return {message: 'Company has been re-activated succeffully'};

    }catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (
        error instanceof Error && error.message === 'Company is already activated'
      ) {
        throw new InternalServerErrorException('company is alreay activated');
      } else {
        throw new InternalServerErrorException(
          'An error occured while re-activating the company.',
        );
      }
    }
  }

  @Patch('update/:companyCode')
  async updateCompany(
    @Param('companyCode') companyCode: string,
    @Body() UpdateCompanyDto: UpdateCompanyDto,
  ): Promise<any> {
    if (!companyCode) {
      throw new BadRequestException('Missing companyCode');
    }

    await this.companyService.updateCompany(companyCode, UpdateCompanyDto);

    return { message: 'Company updated successfully' };
  }


}
