import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateApplicationDto, CreatePlayerInApplicationDto } from '../dto/create-application.dto';
import { ReviewApplicationDto } from '../dto/review-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createApplicationDto: CreateApplicationDto) {
    const { players, ...applicationData } = createApplicationDto;

    if (players.length > 14) {
      throw new BadRequestException('Maximum 14 players per team');
    }

    const application = await this.prisma.teamApplication.create({
      data: {
        teamName: applicationData.teamName,
        division: applicationData.division,
        captainName: applicationData.captainName,
        captainPhone: applicationData.captainPhone,
        captainEmail: applicationData.captainEmail,
        emblemUrl: applicationData.emblemUrl,
        status: 'pending',
        players: {
          create: players.map((player: CreatePlayerInApplicationDto) => ({
            fullName: player.fullName,
            birthDate: new Date(player.birthDate),
            heightCm: player.heightCm,
            position: player.position,
            skillLevel: player.skillLevel,
          })),
        },
      },
      include: {
        players: true,
      },
    });

    return application;
  }

  async findAll(status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const applications = await this.prisma.teamApplication.findMany({
      where,
      include: {
        players: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return applications;
  }

  async findOne(id: string) {
    const application = await this.prisma.teamApplication.findUnique({
      where: { id },
      include: {
        players: true,
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async review(id: string, reviewData: ReviewApplicationDto, adminId: string) {
    const application = await this.findOne(id);

    if (application.status !== 'pending') {
      throw new BadRequestException(`Application already ${application.status}`);
    }

    const updatedApplication = await this.prisma.teamApplication.update({
      where: { id },
      data: {
        status: reviewData.status,
        rejectionReason: reviewData.rejectionReason,
        reviewedById: adminId,
        reviewedAt: new Date(),
      },
    });

    if (reviewData.status === 'approved') {
      const division = await this.prisma.division.findFirst({
        where: { name: application.division },
      });

      if (!division) {
        throw new BadRequestException(`Division ${application.division} not found`);
      }

      const playersFromApplication = await this.prisma.playerApplication.findMany({
        where: { applicationId: application.id },
      });

      const team = await this.prisma.team.create({
        data: {
          name: application.teamName,
          divisionId: division.id,
          captainName: application.captainName,
          emblemUrl: application.emblemUrl,
          isWaiting: true,
          applicationId: application.id,
          players: {
            create: playersFromApplication.map((player) => ({
              fullName: player.fullName,
              birthDate: player.birthDate,
              heightCm: player.heightCm,
              position: player.position,
              skillLevel: player.skillLevel,
            })),
          },
        },
      });

      return { application: updatedApplication, team };
    }

    return { application: updatedApplication };
  }
}