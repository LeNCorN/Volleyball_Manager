import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePlayerDto, UpdatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerSkillDto } from '../dto/update-player-skill.dto';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: {
    division?: string;
    position?: string;
    skillLevel?: string;
    search?: string;
    teamId?: string;
  }) {
    const where: any = {};

    if (filters?.division) {
      where.team = { division: { name: filters.division } };
    }
    if (filters?.position) {
      where.position = filters.position;
    }
    if (filters?.skillLevel) {
      where.skillLevel = filters.skillLevel;
    }
    if (filters?.teamId) {
      where.teamId = filters.teamId;
    }
    if (filters?.search) {
      where.fullName = { contains: filters.search, mode: 'insensitive' };
    }

    const players = await this.prisma.player.findMany({
      where,
      include: {
        team: {
          include: {
            division: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });

    const currentYear = new Date().getFullYear();

    return players.map(p => ({
      id: p.id,
      fullName: p.fullName,
      birthDate: p.birthDate,
      age: currentYear - new Date(p.birthDate).getFullYear(),
      heightCm: p.heightCm,
      position: p.position,
      skillLevel: p.skillLevel,
      teamId: p.teamId,
      teamName: p.team?.name,
      division: p.team?.division?.name,
      createdAt: p.createdAt,
    }));
  }

  async findOne(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
      include: {
        team: {
          include: {
            division: true,
          },
        },
        receivedMVP: {
          include: {
            match: true,
          },
        },
      },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    const currentYear = new Date().getFullYear();

    return {
      id: player.id,
      fullName: player.fullName,
      birthDate: player.birthDate,
      age: currentYear - new Date(player.birthDate).getFullYear(),
      heightCm: player.heightCm,
      position: player.position,
      skillLevel: player.skillLevel,
      teamId: player.teamId,
      teamName: player.team?.name,
      division: player.team?.division?.name,
      mvpCount: player.receivedMVP.length,
      createdAt: player.createdAt,
    };
  }

  async create(createPlayerDto: CreatePlayerDto) {
    if (createPlayerDto.teamId) {
      const team = await this.prisma.team.findUnique({
        where: { id: createPlayerDto.teamId },
      });
      if (!team) {
        throw new NotFoundException(`Team with ID ${createPlayerDto.teamId} not found`);
      }
    }

    // Формируем данные для создания, исключая undefined поля
    const playerData: any = {
      fullName: createPlayerDto.fullName,
      birthDate: new Date(createPlayerDto.birthDate),
      heightCm: createPlayerDto.heightCm,
      position: createPlayerDto.position,
      skillLevel: createPlayerDto.skillLevel,
    };

    // Добавляем teamId только если он указан
    if (createPlayerDto.teamId) {
      playerData.teamId = createPlayerDto.teamId;
    }

    const player = await this.prisma.player.create({
      data: playerData,
      include: {
        team: true,
      },
    });

    return player;
  }

  async update(id: string, updatePlayerDto: UpdatePlayerDto) {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    const updateData: any = {};
    if (updatePlayerDto.fullName !== undefined) updateData.fullName = updatePlayerDto.fullName;
    if (updatePlayerDto.birthDate !== undefined) updateData.birthDate = new Date(updatePlayerDto.birthDate);
    if (updatePlayerDto.heightCm !== undefined) updateData.heightCm = updatePlayerDto.heightCm;
    if (updatePlayerDto.position !== undefined) updateData.position = updatePlayerDto.position;
    if (updatePlayerDto.skillLevel !== undefined) updateData.skillLevel = updatePlayerDto.skillLevel;

    const updatedPlayer = await this.prisma.player.update({
      where: { id },
      data: updateData,
      include: {
        team: true,
      },
    });

    return updatedPlayer;
  }

  async updateSkillLevel(playerId: string, updateDto: UpdatePlayerSkillDto) {
    const player = await this.prisma.player.findUnique({
      where: { id: playerId },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    const validLevels = ['light', 'light_plus', 'light_plus_plus', 'medium', 'medium_plus', 'hard', 'hard_plus'];
    if (!validLevels.includes(updateDto.skillLevel)) {
      throw new BadRequestException(`Invalid skill level. Must be one of: ${validLevels.join(', ')}`);
    }

    const updatedPlayer = await this.prisma.player.update({
      where: { id: playerId },
      data: { skillLevel: updateDto.skillLevel },
    });

    return updatedPlayer;
  }

  async remove(id: string) {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    await this.prisma.player.delete({
      where: { id },
    });

    return { message: `Player ${player.fullName} deleted successfully` };
  }

  async getPlayersByTeam(teamId: string) {
    const players = await this.prisma.player.findMany({
      where: { teamId },
      orderBy: { fullName: 'asc' },
    });

    const currentYear = new Date().getFullYear();

    return players.map(p => ({
      id: p.id,
      fullName: p.fullName,
      birthDate: p.birthDate,
      age: currentYear - new Date(p.birthDate).getFullYear(),
      heightCm: p.heightCm,
      position: p.position,
      skillLevel: p.skillLevel,
    }));
  }
}