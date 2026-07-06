import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const before = await prisma.category.count();
  const promptsWithCategoryBefore = await prisma.prompt.count({ where: { categoryId: { not: null } } });

  const result = await prisma.category.deleteMany({});

  const promptsWithCategoryAfter = await prisma.prompt.count({ where: { categoryId: { not: null } } });
  const totalPrompts = await prisma.prompt.count();

  console.log(`Categories before: ${before}, deleted: ${result.count}`);
  console.log(`Prompts with a category before: ${promptsWithCategoryBefore}, after: ${promptsWithCategoryAfter}`);
  console.log(`Total prompts still present: ${totalPrompts}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
