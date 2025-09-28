import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.concert.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      id: 'user-1',
      email: 'test@test',
      name: 'test',
      isAdmin: false,
    },
  });

  console.log('Seed completed:', { user });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
