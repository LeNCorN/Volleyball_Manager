import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigureGroupsDto } from '../dto/configure-groups.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async configureGroups(divisionName: string, dto: ConfigureGroupsDto) {
    const division = await this.prisma.division.findFirst({
      where: { name: divisionName },
    });

    if (!division) {
      throw new BadRequestException(`Дивизион ${divisionName} не найден`);
    }

    const waitingTeams = await this.prisma.team.findMany({
      where: {
        divisionId: division.id,
        isWaiting: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (waitingTeams.length === 0) {
      throw new BadRequestException(`Нет команд в листе ожидания для дивизиона ${divisionName}`);
    }

    const teamsCount = waitingTeams.length;
    const groupsCount = dto.groupsCount;
    const teamsPerGroup = Math.ceil(teamsCount / groupsCount);

    if (teamsPerGroup > 10) {
      throw new BadRequestException('Максимум 10 команд в группе');
    }

    // Проверяем, есть ли уже сформированные группы
    const existingGroups = await this.prisma.team.findFirst({
      where: {
        divisionId: division.id,
        groupLetter: { not: null },
        isWaiting: false,
      },
    });

    if (existingGroups) {
      // Если группы уже есть и нужно переформировать, сначала очищаем
      await this.prisma.team.updateMany({
        where: { divisionId: division.id },
        data: { groupLetter: null, isWaiting: true },
      });
    }

    const groups: { letter: string; teams: typeof waitingTeams }[] = [];
    const groupLetters = ['A', 'B'];

    for (let i = 0; i < groupsCount; i++) {
      groups.push({ letter: groupLetters[i], teams: [] });
    }

    waitingTeams.forEach((team, index) => {
      const groupIndex = index % groupsCount;
      groups[groupIndex].teams.push(team);
    });

    for (const group of groups) {
      for (const team of group.teams) {
        await this.prisma.team.update({
          where: { id: team.id },
          data: {
            groupLetter: group.letter,
            isWaiting: false,
          },
        });
      }
    }

    // Обновляем флаг groupsConfigured в сезоне
    await this.prisma.season.update({
      where: { id: 1 },
      data: { groupsConfigured: true },
    });

    return {
      division: divisionName,
      groups: groups.map(g => ({
        letter: g.letter,
        teamsCount: g.teams.length,
        teams: g.teams.map(t => ({ id: t.id, name: t.name })),
      })),
    };
  }

  async getGroupsStatus() {
    const season = await this.prisma.season.findUnique({
      where: { id: 1 },
    });

    const groupsConfigured = season?.groupsConfigured || false;

    const teamsByDivision = await this.prisma.team.groupBy({
      by: ['divisionId', 'groupLetter', 'isWaiting'],
      _count: { id: true },
    });

    return {
      groupsConfigured,
      details: teamsByDivision,
    };
  }
}