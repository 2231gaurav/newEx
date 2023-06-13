import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User) // Add this line to inject the User repository
    private readonly userRepository: Repository<User>,
  ) {}

  async registerCompany(
    companyCode: string,
    companyName: string,
    companyEmail: string,
    userId: number,
    companyContact?: string,
    companyAddress?: string,
  ): Promise<Company> {
    const existingCompany = await this.companyRepository.findOne({
      where: { companyCode },
    });
    if (existingCompany) {
      throw new BadRequestException(
        'Company with the provided companyCode already exists',
      );
    }
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: ['email']
    });
    if (!user) {
      throw new BadRequestException(
        'User with the provided userId does not exist',
      );
    }
    const company = new Company();
    company.companyCode = companyCode;
    company.companyName = companyName;
    company.companyEmail = companyEmail;
    company.companyAddress = companyAddress;
    company.companyContact = companyContact;
    company.createdBy = user;

    this.companyRepository.save(company);
    return company;
  }
  async getAllCompanies(): Promise<Company[]> {
    // Assuming you have a data source or database to retrieve the companies from
    // You can replace this implementation with your own logic to fetch the companies

    // Example implementation:
    // Retrieve the companies from a database or data source
    // In this example, we'll return the companies stored in the "companies" array
    return await this.companyRepository.find({ relations: ['createdBy'] });
  }

  async deleteCompany(companyCode: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: {
        companyCode: companyCode,
      },
    });

    if (!company) {
      throw new Error('Company not found');
    }
    if (!company.isActive) {
      throw new Error('Company is already deactivated');
    }
    company.isActive = false;

    await this.companyRepository.save(company);
  }

  async reactivateCompany(companyCode: string): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: {
        companyCode: companyCode,
      },
    });

    if (!company) {
      throw new Error('Company not found');
    }
    if (company.isActive) {
      throw new Error('Company is already activated');
    }
    company.isActive = true;

    await this.companyRepository.save(company);
  }
  async getCompanyByCode(companyCode: string): Promise<Company> {
    // Find the company by its companyCode with the createdBy relationship
    const company = await this.companyRepository.findOne({
      where: { companyCode },
      relations: ['createdBy'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
  async updateCompany(companyCode: string, updatedData: Partial<Company>): Promise<void> {
    const company = await this.companyRepository.findOne({ where: { companyCode } });
  
    if (!company) {
      throw new NotFoundException('Company not found');
    }
  
    if (updatedData.companyName) {
      company.companyName = updatedData.companyName;
    }
  
    if (updatedData.companyEmail) {
      company.companyEmail = updatedData.companyEmail;
    }
  
    if (updatedData.companyContact) {
      company.companyContact = updatedData.companyContact;
    }
  
    if (updatedData.companyAddress) {
      company.companyAddress = updatedData.companyAddress;
    }
  
    await this.companyRepository.save(company);
  }
}
