import { time } from 'console';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Company } from './company.entity';
import { Challan } from './challan.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  email: string;

  @Column({})
  password: string;
   
  @CreateDateColumn()
  createddAt:Date

  @OneToMany(() => Company, company => company.createdBy) // Specify the OneToMany relationship
  companies: Company[]; // Add the companies property to store the related Company entities

  @Column({ nullable: true }) // Add this column decorator
  passwordResetToken: string; // Add the passwordResetToken property
//   @Column({type:'datetime'})
//   updatedAt:Date

  @Column({ nullable: true }) // Add this column decorator
  passwordResetTokenExpiry: Date; // Add the passwordResetTokenExpiry property

  @Column({ default: true }) // Add this column decorator
  isActive: boolean; // Add the isActive property

  @OneToMany(() => Challan, challan => challan.createdBy)
  challans: Challan[]
}
