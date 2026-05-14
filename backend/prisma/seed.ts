import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создание дивизионов
  const hardDivision = await prisma.division.upsert({
    where: { name: 'hard' },
    update: {},
    create: { name: 'hard', description: 'Хард-лига (профессионалы)' },
  });
  console.log('✅ Hard division created');

  const lightDivision = await prisma.division.upsert({
    where: { name: 'light' },
    update: {},
    create: { name: 'light', description: 'Лайт-лига (начинающие)' },
  });
  console.log('✅ Light division created');

  // Создание сезона
  const season = await prisma.season.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Сезон 2026',
      startDate: new Date('2026-02-05'),
      endDate: new Date('2026-05-20'),
      weeksCount: 10,
      isActive: true,
      scheduleGenerated: false,
      groupsConfigured: false,
    },
  });
  console.log('✅ Season created');

  // Настройки турнира по умолчанию
  const tournamentSettings = await prisma.tournamentSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Чемпионат по волейболу',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-11-30'),
      playDays: ['saturday', 'sunday'],
      courtsCount: 3,
      courtsNames: ['Площадка 1', 'Площадка 2', 'Площадка 3'],
      matchDurationMinutes: 90,
      dayStartTime: '10:00',
      dayEndTime: '22:00',
      scheduleGenerated: false,
      groupsConfigured: false,
    },
  });
  console.log('✅ Tournament settings created');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });