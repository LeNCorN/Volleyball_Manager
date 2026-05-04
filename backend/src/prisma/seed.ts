import { PrismaClient, DivisionEnum, SkillLevelEnum, PositionEnum } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Создание дивизионов
    const divisions = await Promise.all([
        prisma.division.upsert({
            where: { name: 'hard' },
            update: {},
            create: { name: 'hard', description: 'Хард-лига (профессионалы)' },
        }),
        prisma.division.upsert({
            where: { name: 'medium' },
            update: {},
            create: { name: 'medium', description: 'Медиум-лига (любители)' },
        }),
        prisma.division.upsert({
            where: { name: 'light' },
            update: {},
            create: { name: 'light', description: 'Лайт-лига (начинающие)' },
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

    // Создание администратора (пароль: admin123)
    const admin = await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash: '$2b$10$YourHashHere', // Замените на реальный bcrypt hash
        },
    });

    console.log('✅ Admin user created');

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