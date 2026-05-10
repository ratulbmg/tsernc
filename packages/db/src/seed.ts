import { prisma } from "./index";

async function main() {
  // Create default users
  const defaultUsers = [
    {
      uniqueId: "admin01",
      name: "Test",
      email: "test@email.com",
      password: "password",
    },
  ];

  console.log("Start seeding users...");
  // Seed users
  for (const userData of defaultUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`Created user: ${user.name}`);
  }

  console.log("Users seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
