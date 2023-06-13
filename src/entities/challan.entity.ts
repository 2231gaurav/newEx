import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './company.entity';
import { User } from './user.entity';

@Entity()
export class Challan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, (company) => company.id) // Specify the ManyToOne relationship with Company entity
  @JoinColumn({ name: 'companyId' })
  company: Company; // Reference the Company entity

  @Column()
  year: number;

  @Column()
  month: string;

  @Column()
  dateOfProcessing: Date;

  @ManyToOne(() => User, (user) => user.id) // Specify the ManyToOne relationship with User entity
  @JoinColumn({ name: 'createdBy' })
  createdBy: User; // Reference the User entity

  @ManyToOne(() => User, (user) => user.id) // Specify the ManyToOne relationship with User entity
  @JoinColumn({ name: 'updatedBy' })
  updatedBy: User; // Reference the User entity

  @UpdateDateColumn({type: 'timestamp'})
  updatedAt: Date

  @Column({ default: 0 })
  PFAmount: number;

  @Column({ default: 0 })
  ESIAmount: number;

  @Column({ nullable: true})
  Total: number;
  // get Total(): number {
  //   return this.PFAmount + this.ESIAmount;
  // }

  @Column({nullable: true})
  PFCode: string;

  @Column({nullable: true})
  ESICode: string;


  @Column({ default: 'No Link', nullable: true })
  ChallanLink: string;

  @Column({ default: 'No Link', nullable: true })
  ECRLink: string;

  @Column({ default: 'No Link', nullable: true })
  ESILink: string;

  @Column({ default: 'No Link', nullable: true })
  SalarySheetLink: string;

  @Column({ default: 'No Link', nullable: true })
  PS_PFLink: string;

  @Column({ default: 'No Link', nullable: true })
  PS_ESILink: string;
}
