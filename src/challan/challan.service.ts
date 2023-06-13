import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Challan } from 'src/entities/challan.entity';
import { Any, Repository } from 'typeorm';
import { CreateChallanDto, UpdateChallanDto } from './challan.controller';
import { User } from 'src/entities/user.entity';
import { Company } from 'src/entities/company.entity';
import { parse } from 'date-fns';
import { Url } from 'url';
import { url } from 'inspector';
@Injectable()
export class ChallanService {
  constructor(
    @InjectRepository(Challan)
    private readonly challanRepository: Repository<Challan>,
    @InjectRepository(User) // Add this line to inject the User repository
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async createChallan(createChallanDto: CreateChallanDto): Promise<{
    id: number;
    Year: number;
    Month: string;
    Date: Date;
    CompanyName: string;
    CreatedBy: string;
    PF: number;
    ESI: number;
    Total: number;
    ChallanLink: string;
    ECRLink: string;
    ESILink: string;
    PaySlipsLink: [string, string];
  }> {
    const { companyId, userId, PFAmount, ESIAmount, ...challanData } =
      createChallanDto;

    // Convert rawDate to expected format

    const company = await this.companyRepository.findOne({
      where: {
        id: companyId,
      },
      //   select: ['companyName'],
    });
    if (!company) {
      // Handle error when company is not found
      throw new Error('Company not found');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      //   select: ['email'],
    });
    if (!user) {
      throw new BadRequestException(
        'User with the provided userId does not exist',
      );
    }

    // Check if challan already exists for the company, month, and year
    const existingChallan = await this.challanRepository.findOne({
      where: {
        company: { id: companyId },
        month: challanData.month,
        year: challanData.year,
      },
    });
    console.log(existingChallan);
    if (existingChallan) {
      throw new Error(
        `Challan already exists for company: ${company.companyName}, month: ${challanData.month}, and year: ${challanData.year}, please use update link for any updates in Challan`,
      );
    }

    const challan = new Challan();
    const total = challan.PFAmount + challan.ESIAmount;
    challan.company = company;
    challan.createdBy = user;
    challan.Total = PFAmount + ESIAmount;
    challan.PFAmount = PFAmount;
    challan.ESIAmount = ESIAmount;

    Object.assign(challan, challanData);

    const createdChallan = this.challanRepository.create(challan);
    const savedChallan = await this.challanRepository.save(createdChallan); // Save the instance
    return {
      id: savedChallan.id,
      Year: savedChallan.year,
      Month: savedChallan.month,
      CompanyName: savedChallan.company.companyName,
      CreatedBy: savedChallan.createdBy.email,
      Date: savedChallan.dateOfProcessing,
      PF: savedChallan.PFAmount,
      ESI: savedChallan.ESIAmount,
      Total: savedChallan.Total,
      ECRLink: savedChallan.ECRLink,
      ChallanLink: savedChallan.ECRLink,
      ESILink: savedChallan.ESILink,
      PaySlipsLink: [savedChallan.PS_ESILink, savedChallan.PS_PFLink],
    };
  }

  async updateChallan(updateChallanDto: UpdateChallanDto): Promise<any> {
    const { id, companyId, userId, month, year, ...updates } = updateChallanDto;
    const company = await this.companyRepository.findOne({
      where: {
        id: companyId,
      },
      //   select: ['companyName'],
    });
    if (!company) {
      // Handle error when company is not found
      throw new Error('Company not found');
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      //   select: ['email'],
    });
    if (!user) {
      throw new BadRequestException(
        'User with the provided userId does not exist',
      );
    }

    const challan = await this.challanRepository.findOne({
      where: {
        id: id,
        company: { id: companyId },

        month: month,
        year: year,
      },
    });

    if (!challan) {
      throw new NotFoundException('Challan not found');
    }

    challan.updatedBy = user;
    challan.company = company;
    challan.updatedAt = new Date();
    Object.assign(challan, updates);

    const updatedChallan = await this.challanRepository.save(challan);

    return {
      id: updatedChallan.id,
      Year: updatedChallan.year,
      Month: updatedChallan.month,
      Company: updatedChallan.company.companyName,
      updatedBy: updatedChallan.updatedBy.email,
      PFAmount: updatedChallan.PFAmount,
      ESIAmount: updatedChallan.ESIAmount,
      Total: updatedChallan.Total,
      updatedAt: updatedChallan.updatedAt,
      ECR: updatedChallan.ECRLink,
      Challan: updatedChallan.ChallanLink,
      ESI: updatedChallan.ESILink,
      SalSheet: updatedChallan.SalarySheetLink,
      PaidSlips: [updatedChallan.PS_PFLink, updatedChallan.PS_ESILink],

      // Add other properties as needed
    };
  }

  async getAllChallans(): Promise<Challan[]> {
    return this.challanRepository.find({
      relations: ['company', 'createdBy', 'updatedBy'],
    });
  }

  async getChallansByFilters(filterParams: any): Promise<Challan[]> {
    
    
    if (filterParams) {
      const queryBuilder = this.challanRepository
        .createQueryBuilder('challan')
        .leftJoinAndSelect('challan.company', 'company')
        .leftJoinAndSelect('challan.createdBy', 'createdBy')
        .leftJoinAndSelect('challan.updatedBy', 'updatedBy');

      if (filterParams.companyId) {
        queryBuilder.where('challan.company.id = :companyId', {
          companyId: filterParams.companyId,
        });
      }
      if (filterParams.month) {
        queryBuilder.andWhere('challan.month = :month', {
          month: filterParams.month,
        });
      }
      if (filterParams.year) {
        queryBuilder.andWhere('challan.year = :year', {
          year: filterParams.year,
        });
      }
      if (filterParams.createdBy) {
        queryBuilder.andWhere('challan.createdBy.id = :createdBy', {
          createdBy: filterParams.createdBy,
        });
      }
      return queryBuilder.getMany();
    }
    

    // Add other filters if needed (e.g., month, year, createdBy, etc.)

    
  }

  async deleteChallan(challanId: number): Promise<string> {
    const challan = await this.challanRepository.findOne({where: {id: challanId}});
    if (!challan) {
      // Handle error when challan is not found
      throw new Error('Challan not found');
    }

    await this.challanRepository.remove(challan);
    return 'Challan deleted successfully';
  }
  
}
