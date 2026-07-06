import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TAGS: Array<{ name: string; slug: string; color: string }> = [
  // Jurisdictions
  { name: "EU", slug: "eu", color: "#1E3A8A" },
  { name: "UK", slug: "uk", color: "#1D4ED8" },
  { name: "Belgium", slug: "belgium", color: "#2563EB" },
  { name: "France", slug: "france", color: "#3B82F6" },
  { name: "Germany", slug: "germany", color: "#60A5FA" },
  { name: "Netherlands", slug: "netherlands", color: "#93C5FD" },
  { name: "Finland", slug: "finland", color: "#BFDBFE" },

  // Workflow status
  { name: "Demo", slug: "demo", color: "#A855F7" },
  { name: "Draft", slug: "draft", color: "#9CA3AF" },
  { name: "Tested", slug: "tested", color: "#F59E0B" },
  { name: "Approved", slug: "approved", color: "#22C55E" },
  { name: "Deprecated", slug: "deprecated", color: "#EF4444" },

  // Practice areas
  { name: "Merger control", slug: "merger-control", color: "#0D9488" },
  { name: "Antitrust", slug: "antitrust", color: "#0891B2" },
  { name: "Abuse of dominance", slug: "abuse-of-dominance", color: "#0E7490" },
  { name: "DMA / DSA", slug: "dma-dsa", color: "#155E75" },
  { name: "State aid", slug: "state-aid", color: "#164E63" },
  { name: "Litigation", slug: "litigation", color: "#7C3AED" },

  // Confidentiality classification
  { name: "C1 - Public", slug: "c1-public", color: "#BBF7D0" },
  { name: "C2 - Internal", slug: "c2-internal", color: "#FDE68A" },
  { name: "C3 - Client confidential", slug: "c3-client-confidential", color: "#FDBA74" },
  { name: "C4 - Privileged", slug: "c4-privileged", color: "#FCA5A5" },
  { name: "C5 - Restricted", slug: "c5-restricted", color: "#B91C1C" },

  // Conflict / access status
  { name: "Conflict cleared", slug: "conflict-cleared", color: "#16A34A" },
  { name: "Conflict check pending", slug: "conflict-check-pending", color: "#EAB308" },
  { name: "Client-safe", slug: "client-safe", color: "#059669" },
  { name: "Internal-only", slug: "internal-only", color: "#78716C" },
];

async function main() {
  console.log(`🏷️  Upserting ${TAGS.length} tags...`);

  const tagIds: string[] = [];
  for (const tag of TAGS) {
    const created = await prisma.tag.upsert({
      where: { name: tag.name },
      update: { slug: tag.slug, color: tag.color },
      create: tag,
    });
    tagIds.push(created.id);
    console.log(`   ✓ ${tag.name}`);
  }

  const demoTag = await prisma.tag.findUniqueOrThrow({ where: { name: "Demo" } });

  const prompts = await prisma.prompt.findMany({ select: { id: true } });
  console.log(`\n🔗 Associating "Demo" tag with ${prompts.length} prompts...`);

  const result = await prisma.promptTag.createMany({
    data: prompts.map((p) => ({ promptId: p.id, tagId: demoTag.id })),
    skipDuplicates: true,
  });

  console.log(`✅ Created ${tagIds.length} tags and linked "Demo" to ${result.count} prompts (${prompts.length - result.count} already tagged).`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to add tags:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
