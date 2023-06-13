import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';


@Injectable()
export class UserService {
  constructor(private jwt: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signup(email: string, password: string): Promise<User> {
    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    this.userRepository.save(user)
    return user
     
  }

  async signin(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ 
        where: {
            email: email
        }
     });
    console.log(user)
    if (user == null) {
        return null
    }
    const isMatch = await bcrypt.compare(password, user.password); 
    if (isMatch) {
      return user;
    }

    return null;
  }

  async getAllUsers():Promise<User[]> {
    return await this.userRepository.find();
  }

  async initiatePasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user == null) {
      throw new Error('User not found');
    }

    // Generate a password reset token
    const passwordResetToken = this.generatePasswordResetToken();

    // Set the token and expiration date in the user entity
    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenExpiry = this.generatePasswordResetTokenExpiry();

    // Save the user entity with the updated password reset token
    await this.userRepository.save(user);

    // Send the password reset email to the user's email address
    this.sendPasswordResetEmail(user.email, passwordResetToken);
  }

  // Other methods...

  // Helper methods for password reset token and expiry generation
  private generatePasswordResetToken(): string {
    // Generate a random token
    // You can use a library like `crypto` to generate a secure random token
    // Example: return crypto.randomBytes(20).toString('hex');
    const token = crypto.randomBytes(20).toString('hex');
    return token;
  }

  private generatePasswordResetTokenExpiry(): Date {
    // Calculate the expiration date for the password reset token
    // For example, set it to 1 hour from the current time
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    return expiryDate;
  }

  private sendPasswordResetEmail(email: string, token: string): void {
    // Implement your email sending logic here
    // You can use a third-party library or an email service like SendGrid, Nodemailer, etc.
    // Construct the email content with the reset password link containing the token
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., 'Gmail', 'SendGrid'
      auth: {
        user: 'rising.agro.2020@gmail.com',
        pass: 'mzzognzvlyeyowlu',
      },
    });
    // Construct the email content
    const mailOptions = {
      from: 'rising.agro.2020@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://example.com/reset-password?token=${token}`,
      html: `Click the following link to reset your password: <a href="http://example.com/reset-password?token=${token}">Reset Password</a>`,
    };
    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending password reset email:', error);
      } else {
        console.log('Password reset email sent:', info.response);
      }
    });
  }

  async deleteUser(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ 
      where: {
        email: email
      }
     });

    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new Error('User is already deactivated');
    }
    user.isActive = false;

    await this.userRepository.save(user);
  }

  async reactivateUser(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ 
      where: {
        email: email,
        
      }
     });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isActive) {
      throw new Error('User is already active');
    }

    user.isActive = true;

    await this.userRepository.save(user);
    
  }

}




