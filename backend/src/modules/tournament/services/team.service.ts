import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { RedisService } from '../../../redis/redis.service';
import { CreateTeamDto, UpdateTeamDto } from '../dto/create-team.dto';

@Injectable()
export class TeamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(division?: string) {
    const where: any = {};
    if (division) {
      where.division = { name: division };
    }

    const teams = await this.prisma.team.findMany({
      where,
      include: {
        division: true,
        players: true,
      },
      orderBy: { name: 'asc' },
    });

    return teams;
  }

  async findOne(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        division: true,
        players: {
          orderBy: { fullName: 'asc' },
        },
        homeMatches: {
          include: {
            awayTeam: true,
          },
          orderBy: { matchDate: 'asc' },
        },
        awayMatches: {
          include: {
            homeTeam: true,
          },
          orderBy: { matchDate: 'asc' },
        },
      },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    const players = team.players;
    const avgHeight = players.length > 0
      ? Math.round(players.reduce((sum, p) => sum + p.heightCm, 0) / players.length)
      : 0;

    const currentYear = new Date().getFullYear();
    const avgAge = players.length > 0
      ? Math.round(players.reduce((sum, p) => {
        const age = currentYear - new Date(p.birthDate).getFullYear();
        return sum + age;
      }, 0) / players.length)
      : 0;

    const schedule = [
      ...team.homeMatches.map(m => ({
        id: m.id,
        opponent: m.awayTeam.name,
        date: m.matchDate,
        time: m.matchTime,
        court: m.courtNumber,
        isHome: true,
        result: null,
        status: m.status,
      })),
      ...team.awayMatches.map(m => ({
        id: m.id,
        opponent: m.homeTeam.name,
        date: m.matchDate,
        time: m.matchTime,
        court: m.courtNumber,
        isHome: false,
        result: null,
        status: m.status,
      })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      ...team,
      avgHeight,
      avgAge,
      schedule,
    };
  }

  async getWaitingList() {
    const teams = await this.prisma.team.findMany({
      where: { isWaiting: true },
      include: {
        division: true,
        players: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return teams;
  }

  async create(createTeamDto: CreateTeamDto) {
    const division = await this.prisma.division.findFirst({
      where: { name: createTeamDto.division },
    });

    if (!division) {
      throw new BadRequestException(`Division ${createTeamDto.division} not found`);
    }

    const team = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        divisionId: division.id,
        captainName: createTeamDto.captainName,
        emblemUrl: createTeamDto.emblemUrl,
        isWaiting: true,
      },
      include: {
        division: true,
      },
    });

    await this.redis.del('teams:all');
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    const updateData: any = {};
    if (updateTeamDto.name !== undefined) updateData.name = updateTeamDto.name;
    if (updateTeamDto.captainName !== undefined) updateData.captainName = updateTeamDto.captainName;
    if (updateTeamDto.emblemUrl !== undefined) updateData.emblemUrl = updateTeamDto.emblemUrl;
    if (updateTeamDto.groupLetter !== undefined) updateData.groupLetter = updateTeamDto.groupLetter;
    if (updateTeamDto.isWaiting !== undefined) updateData.isWaiting = updateTeamDto.isWaiting;

    if (updateTeamDto.division) {
      const division = await this.prisma.division.findFirst({
        where: { name: updateTeamDto.division },
      });
      if (!division) {
        throw new BadRequestException(`Division ${updateTeamDto.division} not found`);
      }
      updateData.divisionId = division.id;
    }

    const updatedTeam = await this.prisma.team.update({
      where: { id },
      data: updateData,
      include: { division: true },
    });

    await this.redis.del('teams:all');
    await this.redis.del(`team:${id}`);
    return updatedTeam;
  }

  async remove(id: string) {
    const team = await this.prisma.team.findUnique({ where: { id } });
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    await this.prisma.team.delete({ where: { id } });
    await this.redis.del('teams:all');
    await this.redis.del(`team:${id}`);
    return { message: `Team ${team.name} deleted successfully` };
  }
}