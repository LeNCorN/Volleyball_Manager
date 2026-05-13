import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создание дивизионов
  await prisma.division.upsert({
    where: { name: 'hard' },
    update: {},
    create: { name: 'hard', description: 'Хард-лига' },
  });

  await prisma.division.upsert({
    where: { name: 'light' },
    update: {},
    create: { name: 'light', description: 'Лайт-лига' },
  });

  console.log('✅ Divisions created');

  // Создание сезона
  await prisma.season.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      startDate: new Date('2026-02-05'),
      endDate: new Date('2026-05-20'),
      weeksCount: 10,
      isActive: true,
    },
  });

  console.log('✅ Season created');

  // Настройки турнира по умолчанию (без timeSlots)
  await prisma.tournamentSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Чемпионат по волейболу',
      startDate: new Date(),
      endDate: new Date(),
      playDays: ['saturday', 'sunday'],
      courtsCount: 3,
      courtsNames: ['Площадка 1', 'Площадка 2', 'Площадка 3'],
      matchDurationMinutes: 90,
      dayStartTime: '10:00',
      dayEndTime: '22:00',
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