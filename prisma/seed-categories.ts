import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PARENTS = [
  { name: "Cross-practice support functions", slug: "cross-practice-support-functions" },
  { name: "Competition law practice areas", slug: "competition-law-practice-areas" },
];

const CHILDREN = [
  { name: "Research and monitoring", slug: "research-and-monitoring", parentSlug: "cross-practice-support-functions" },
  { name: "Legal drafting", slug: "legal-drafting", parentSlug: "cross-practice-support-functions" },
  { name: "Analysis and strategy", slug: "analysis-and-strategy", parentSlug: "cross-practice-support-functions" },
  { name: "Review and quality control", slug: "review-and-quality-control", parentSlug: "cross-practice-support-functions" },
  { name: "Proofreading and formatting", slug: "proofreading-and-formatting", parentSlug: "cross-practice-support-functions" },
  { name: "Client communication and coordination", slug: "client-communication-and-coordination", parentSlug: "cross-practice-support-functions" },
  { name: "Translation", slug: "translation", parentSlug: "cross-practice-support-functions" },
  { name: "Data management and compliance", slug: "data-management-and-compliance", parentSlug: "cross-practice-support-functions" },
  { name: "Knowledge management", slug: "knowledge-management", parentSlug: "cross-practice-support-functions" },
  { name: "Administrative support", slug: "administrative-support", parentSlug: "cross-practice-support-functions" },
  { name: "Internal operations", slug: "internal-operations", parentSlug: "cross-practice-support-functions" },
  { name: "Marketing", slug: "marketing", parentSlug: "cross-practice-support-functions" },
  { name: "Internal communication", slug: "internal-communication", parentSlug: "cross-practice-support-functions" },
  { name: "Provider conflict and vendor governance", slug: "provider-conflict-and-vendor-governance", parentSlug: "cross-practice-support-functions" },

  { name: "Merger control", slug: "merger-control", parentSlug: "competition-law-practice-areas" },
  { name: "Antitrust and cartels", slug: "antitrust-and-cartels", parentSlug: "competition-law-practice-areas" },
  { name: "Abuse of dominance", slug: "abuse-of-dominance", parentSlug: "competition-law-practice-areas" },
  { name: "State aid", slug: "state-aid", parentSlug: "competition-law-practice-areas" },
  { name: "Digital regulation (DMA, DSA, AI Act)", slug: "digital-regulation-dma-dsa-ai-act", parentSlug: "competition-law-practice-areas" },
  { name: "Litigation and appeals", slug: "litigation-and-appeals", parentSlug: "competition-law-practice-areas" },
  { name: "Sector inquiries and market investigations", slug: "sector-inquiries-and-market-investigations", parentSlug: "competition-law-practice-areas" },
  { name: "Regulatory strategy and advocacy", slug: "regulatory-strategy-and-advocacy", parentSlug: "competition-law-practice-areas" },
];

async function main() {
  const parentIds = new Map<string, string>();

  for (const [index, p] of PARENTS.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: p.slug },
      update: {},
      create: { name: p.name, slug: p.slug, order: index },
    });
    parentIds.set(p.slug, category.id);
    console.log(`Parent OK: ${category.name} (${category.id})`);
  }

  for (const [index, c] of CHILDREN.entries()) {
    const parentId = parentIds.get(c.parentSlug);
    if (!parentId) throw new Error(`Missing parent for slug ${c.parentSlug}`);

    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { parentId },
      create: { name: c.name, slug: c.slug, parentId, order: index },
    });
    console.log(`Child OK: ${category.name} -> parent ${c.parentSlug}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
