import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { ProfileDetails } from '../profile-details/entities/profile-details.entity';
import { CertificatesModule } from '../certificates/certificates.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileDetails]), SharedModule, CertificatesModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
