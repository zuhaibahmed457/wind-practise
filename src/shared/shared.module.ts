import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TransactionManagerService } from './services/transaction-manager.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlService } from './services/url.service';
import { User } from 'src/modules/users/entities/user.entity';
import Stripe from 'stripe';
import { LoginAttempt } from 'src/modules/auth/entities/login-attempt.entity';
import { RealTimeGateway } from './gateway/real-time.gateway';
import { AccessRequest } from 'src/modules/access-request/entities/access-request.entity';
import { Certificate } from 'src/modules/certificates/entities/certificate.entity';
import { Portfolio } from 'src/modules/portfolio/entities/portfolio.entity';
import { RequestResponseTime } from './entities/request-response-time.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LoginAttempt,
      User,
      AccessRequest,
      Certificate,
      Portfolio,
      RequestResponseTime,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    TransactionManagerService,
    RealTimeGateway,
    UrlService,
    {
      provide: 'STRIPE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
          apiVersion: '2025-01-27.acacia',
        });
      },
    },
  ],
  exports: [
    JwtModule,
    TransactionManagerService,
    UrlService,
    TypeOrmModule,
    'STRIPE_CLIENT',
    RealTimeGateway,
  ],
})
export class SharedModule {}
