import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class DSC {
  map(arg0: (dsc: { id: any; signatoryName: any; signExpiryDate: any; company: { companyName: any; }; }) => { id: any; signatoryName: any; expiryDate: any; company: any; }): DSC | PromiseLike<DSC> {
    throw new Error('Method not implemented.');
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  signatoryName: string;

  @Column()
  signExpiryDate: Date;

  @ManyToOne(() => Company, company => company.dscs) // Specify the ManyToOne relationship
  @JoinColumn({ name: 'companyId' })
  company: Company; // Reference the Company entity

  // Add any additional fields and decorators as needed

}
