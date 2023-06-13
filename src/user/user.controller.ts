import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
// import {AuthGuard} from "@nestjs/passport"
// import "webrtc";

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.signup(email, password);
    return {
      message: 'User registered successfully',
      id: user.id,
      email: user.email,
    };
  }

  @Post('signin')
  //   @UseGuards(AuthGuard('jwt'))
  async signin(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const user = await this.userService.signin(email, password);
    if (user != null) {
      return {
        message: 'User logged in successfully',
        id: user.id,
        email: user.email,
      };
    } else {
      return { message: 'Invalid email or password' };
    }
  }

  @Get('listall')
  async allusers() {
    const alluser = await this.userService.getAllUsers();
    return alluser;
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    // Implement the logic to handle password recovery here
    // For example, send a password reset email to the user's email address

    // Assuming you have a `userService` method to initiate the password reset
    await this.userService.initiatePasswordReset(email);

    return {
      message:
        'Password reset initiated. Please check your email for further instructions.',
    };
  }

  @Post('deactivate')
  async deactivateUser(@Body('email') email: string): Promise<any> {
    try {
      await this.userService.deleteUser(email);
      return { message: 'User has been de-activated successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (
        error instanceof Error &&
        error.message === 'User is already deactivated'
      ) {
        throw new InternalServerErrorException('User is already deactivated');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while deactivating the user.',
        );
      }
    }
  }

  @Post('reactivate')
  async reactivateUser(@Body('email') email: string): Promise<any> {
    try {await this.userService.reactivateUser(email);
    return { message: 'User has been re-activated successfully' };
  } catch (error) {
    if (error instanceof NotFoundException) {
      throw new NotFoundException(error.message);
    } else if (
      error instanceof Error &&
      error.message === 'User is already active'
    ) {
      throw new InternalServerErrorException('User is already active');
    } else {
      throw new InternalServerErrorException(
        'An error occurred while activating the user.',
      );
    }
  }
  }
}
