import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from './user.entity';
import { DSC } from './dsc.entity';
import { Challan } from './challan.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  companyCode: string;

  @Column()
  companyName: string;

  @Column()
  companyEmail: string;

  @Column({nullable:true})
  companyContact: string;

  @Column({nullable:true})
  companyAddress: string;

  @Column({default : true})
  isActive: boolean;

  @ManyToOne(() => User, user => user.companies) // Specify the ManyToOne relationship
  @JoinColumn({ name: 'userId' })
  createdBy: User; // Updated the type to User entity

  @OneToMany(() => DSC, dsc => dsc.company) // Specify the OneToMany relationship
  dscs: DSC[]; // Add the dscs property to store the related DSC entities

  @CreateDateColumn()
  createddAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
  
  @OneToMany(() => Challan, challan => challan.company)
  challans: Challan[]
}
