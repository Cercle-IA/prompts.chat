import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TITLE = "Demo Placeholder Prompt";

const CONTENT = `[DEMO PLACEHOLDER TEXT]  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Context:
- Matter or subject: Lorem ipsum dolor sit amet
- Jurisdiction: Consectetur adipiscing elit
- Relevant facts or documents: Sed do eiusmod tempor incididunt ut labore

Instruction: Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Constraints: - Length: Lorem ipsum dolor sit amet -

Format: Consectetur adipiscing elit sed do -

Sources to rely on: Eiusmod tempor incididunt ut labore et dolore magna

Output should:
1. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.
2. Doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.
3. Veritatis et quasi architecto beatae vitae dicta sunt explicabo nemo enim.

[END OF DEMO PLACEHOLDER TEXT]`;

async function main() {
  const author = await prisma.user.findUniqueOrThrow({ where: { username: "thennen" } });

  const prompt = await prisma.prompt.create({
    data: {
      title: TITLE,
      content: CONTENT,
      authorId: author.id,
      categoryId: null,
      isPrivate: false,
      isUnlisted: false,
    },
  });

  console.log(`OK: ${prompt.id} - "${prompt.title}" by ${author.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
