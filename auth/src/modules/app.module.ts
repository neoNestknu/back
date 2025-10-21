import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import {HealthModule} from "./health/health.module";

@Module({
  imports: [AuthModule, UserModule, DatabaseModule, HealthModule],
})
export class AppModule {}
