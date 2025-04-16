import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import {
  AccessRequest,
  RequestStatus,
  RequestType,
} from 'src/modules/access-request/entities/access-request.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Certificate } from 'src/modules/certificates/entities/certificate.entity';
import { Portfolio } from 'src/modules/portfolio/entities/portfolio.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class AccessRequestGuard implements CanActivate {
  constructor(
    @InjectRepository(AccessRequest)
    private accessRequestRepo: Repository<AccessRequest>,
    @InjectRepository(Portfolio)
    private readonly portfolioRepo: Repository<Portfolio>,
    @InjectRepository(Certificate)
    private readonly certificateRepo: Repository<Certificate>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest<Request>();
    const currentUser: User = request?.user || null;
    let profileDetailsId: string = request.query.profile_details_id || null;
    const email: string = request.query.email || null;

    const requestType = [RequestType.PORTFOLIO, RequestType.CERTIFICATE];

    if (requestType.includes(RequestType.PORTFOLIO)) {
      let searchCondition;

      if (isUUID(request?.params?.id)) {
        searchCondition = { id: request.params.id };
      } else if (profileDetailsId) {
        searchCondition = { profile_details: { id: profileDetailsId } };
      } else {
        searchCondition = {
          profile_details: { user: { id: currentUser?.id } },
        };
      }

      const portfolio = await this.portfolioRepo.findOne({
        where: searchCondition,
        relations: { profile_details: true },
      });

      profileDetailsId = portfolio?.profile_details?.id;
      if (
        portfolio?.profile_details?.id === currentUser?.profile_detail?.id &&
        currentUser?.profile_detail?.id != undefined
      )
        return true;
    }

    if (requestType.includes(RequestType.CERTIFICATE)) {
      let searchCondition;

      if (isUUID(request?.params?.id)) {
        searchCondition = { id: request?.params?.id };
      } else if (profileDetailsId) {
        searchCondition = { profile_details: { id: profileDetailsId } };
      } else {
        searchCondition = { created_by: { id: currentUser?.id } };
      }

      const certificate = await this.certificateRepo.findOne({
        where: searchCondition,
        relations: { created_by: true, profile_details: true },
      });

      if (!certificate) return true;

      profileDetailsId = certificate?.profile_details?.id;
      if (
        certificate?.created_by?.id === currentUser?.id &&
        currentUser?.id != undefined
      )
        return true;
    }

    const accessRequest = await this.accessRequestRepo.findOne({
      where: {
        requested_from: email,
        requested_by: {
          id: profileDetailsId,
        },
      },
      order: {
        created_at: 'DESC',
      },
      relations: {
        requested_by: true,
      },
    });

    if (
      !accessRequest ||
      accessRequest?.requested_by?.id !== profileDetailsId
    ) {
      throw new ForbiddenException(
        `You don't have permission to access this ${requestType}`,
      );
    }

    if (accessRequest.status !== RequestStatus.APPROVED) {
      throw new ForbiddenException(
        accessRequest.status === RequestStatus.DENIED
          ? 'Access request denied.'
          : 'Access request pending.',
      );
    }

    return true;
  }
}
