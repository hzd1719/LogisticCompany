import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { Encryptor } from '../other/encryptor';

@Module({
  imports: [UserModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, Encryptor],
})
export class AuthenticationModule {}
