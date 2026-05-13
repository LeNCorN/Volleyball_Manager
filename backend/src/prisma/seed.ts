import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Создание дивизионов
  const divisions = await Promise.all([
    prisma.division.upsert({
      where: { name: 'hard' },
      update: {},
      create: { name: 'hard', description: 'Хард-лига' },
    }),
    prisma.division.upsert({
      where: { name: 'light' },
      update: {},
      create: { name: 'light', description: 'Лайт-лига' },
    }),
  ]);

  console.log(`✅ Created ${divisions.length} divisions`);

  // Создание сезона
  const season = await prisma.season.upsert({
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

  // Настройки турнира по умолчанию
  const settings = await prisma.tournamentSettings.upsert({
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
      timeSlots: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      matchDurationMinutes: 90,
      breakBetweenMatches: 15,
    },
  });

  console.log('✅ Tournament settings created');

  // Создание тестового администратора (пароль: admin123)
  const hashedPassword = '$2b$10$YourHashHere'; // Замените на реальный хэш

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