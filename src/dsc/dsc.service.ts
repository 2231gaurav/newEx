import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { DSC } from 'src/entities/dsc.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDscDto, UpdateDscDto } from './dsc.controller';

@Injectable()
export class DscService {
  constructor(
    @InjectRepository(DSC)
    private readonly DscRepository: Repository<DSC>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}
  async registerDSC(registerDscDto: RegisterDscDto): Promise<{
    id: number;
    signatoryName: string;
    signExpiryDate: Date;
    companyName: string;
  }> {
    const company = await this.companyRepository.findOne({
      where: {
        id: registerDscDto.companyId,
      },
    });
    if (!company) {
      throw new BadRequestException(
        'Company with the provided companyId does not exist',
      );
    }

    console.log(company);
    const dsc = this.DscRepository.create({ ...registerDscDto, company });
    const savedDsc = await this.DscRepository.save(dsc);

    // return savedDsc;
    return {
      id: savedDsc.id,
      signatoryName: savedDsc.signatoryName,
      signExpiryDate: savedDsc.signExpiryDate,
      companyName: savedDsc.company.companyName,
    };
  }

  async getAllDscs(): Promise<{ company: string }[]> {
    const dscs = await this.DscRepository.find({ relations: ['company'] });
    return dscs.map((dsc) => ({
      id: dsc.id,
      signatoryName: dsc.signatoryName,
      expiryDate: dsc.signExpiryDate,
      company: dsc.company.companyName,
    }));
  }

  async getDscByCriteria(criteria: {
    signatoryName?: string;
    companyId?: string;
  }): Promise<any[]> {
    const { signatoryName, companyId } = criteria;

    const query = this.DscRepository.createQueryBuilder(
      'dsc',
    ).leftJoinAndSelect('dsc.company', 'company');

    if (signatoryName) {
      query.andWhere('dsc.signatoryName = :signatoryName', { signatoryName });
    }

    if (companyId) {
      query.andWhere('company.id = :companyId', { companyId });
    }

    const dscs = await query
      .select([
        'dsc.id',
        'dsc.signatoryName',
        'dsc.signExpiryDate',
        'company.companyName',
      ])
      .getRawMany();
    return dscs;
  }

  async updateDsc(id: number, updateDscDto: UpdateDscDto): Promise<DSC> {
    const dsc = await this.DscRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!dsc) {
      throw new NotFoundException('DSC not found');
    }
    if (!updateDscDto || (Object.keys(updateDscDto).length === 0)) {
      throw new BadRequestException('At least one parameter is required for updating DSC');
    }
    if (
      
      (updateDscDto.signatoryName && updateDscDto.signatoryName === dsc.signatoryName)
    ) {
      throw new BadRequestException('The provided signatoryName is the same as the current value');
    }
    else (updateDscDto.signatoryName && updateDscDto.signatoryName !== dsc.signatoryName); {
      dsc.signatoryName = updateDscDto.signatoryName;
    }
    if (updateDscDto.signExpiryDate) {
      const providedExpiryDate = new Date(updateDscDto.signExpiryDate);
      const currentExpiryDate = dsc.signExpiryDate;
      
      if (providedExpiryDate.toISOString() !== currentExpiryDate.toISOString()) {
        dsc.signExpiryDate = providedExpiryDate;
      }
      else {
        throw new BadRequestException('The provided signExpiryDate is the same as the current value');
      }
    }
    
    
    return this.DscRepository.save(dsc);
  }
}
