import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthenticationService } from './authentication.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserDto } from '../user/dtos/user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('/signup')
  @Throttle(3, 60)
  async signUp(
    @Body() body: CreateUserDto,
    @Session() session: any,
  ): Promise<User> {
    const user = await this.authService.signUp(
      body.email,
      body.password,
      body.egn,
    );

    session.user = user;

    return user;
  }

  @Post('/login')
  @Throttle(3, 60)
  async signIn(@Body() body: UserDto, @Session() session: any): Promise<User> {
    const user = await this.authService.signIn(body.email, body.password);
    session.user = user;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.user = null;
  }

  @Patch('/change-password')
  @UseGuards(AuthGuard)
  @Throttle(3, 60)
  async updateUserPassword(
    @Body() body: { oldPassword: string; newPassword: string },
    @Session() session: { user: User },
  ): Promise<User> {
    console.log(session);
    return await this.authService.updatePassword(
      session.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }

  //TODO: forgot-password - to setup new method - need an email service for that
  // @Patch('/forgotten-password/user/:id')
  // @Throttle(3, 60)
  // async newUserPassword(
  //   @Param('id') id: string,
  //   @Body() body: { oldPassword: string; newPassword: string },
  // ): Promise<User> {
  //   return await this.authService.updatePassword(
  //     parseInt(id),
  //     body.oldPassword,
  //     body.newPassword,
  //   );
  // }
}
