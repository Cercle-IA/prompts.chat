import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PARENTS = [
  { name: "RES - Research", slug: "res-research" },
  { name: "DFT - Drafting", slug: "dft-drafting" },
  { name: "DDR - Diligence, discovery & review", slug: "ddr-diligence-discovery-review" },
  { name: "KNM - Knowledge management", slug: "knm-knowledge-management" },
  { name: "CBD - Client and business development", slug: "cbd-client-and-business-development" },
  { name: "OPS - Operations", slug: "ops-operations" },
  { name: "REG - Regulatory/compliance", slug: "reg-regulatory-compliance" },
  { name: "Competition enforcement", slug: "competition-enforcement" },
  { name: "Digital regulation", slug: "digital-regulation" },
  { name: "Dispute and sector work", slug: "dispute-and-sector-work" },
];

const CHILDREN = [
  { name: "Legal research", slug: "legal-research", parentSlug: "res-research" },
  { name: "Regulatory monitoring", slug: "regulatory-monitoring", parentSlug: "res-research" },
  { name: "Market intelligence", slug: "market-intelligence", parentSlug: "res-research" },

  { name: "Legal drafting", slug: "legal-drafting", parentSlug: "dft-drafting" },
  { name: "Correspondence and client communication", slug: "correspondence-and-client-communication", parentSlug: "dft-drafting" },
  { name: "Translation and localization", slug: "translation-and-localization", parentSlug: "dft-drafting" },

  { name: "Review and quality control", slug: "review-and-quality-control", parentSlug: "ddr-diligence-discovery-review" },
  { name: "Analysis and strategy", slug: "analysis-and-strategy", parentSlug: "ddr-diligence-discovery-review" },
  { name: "Data extraction and structuring", slug: "data-extraction-and-structuring", parentSlug: "ddr-diligence-discovery-review" },

  { name: "Knowledge management and precedent bank", slug: "knowledge-management-and-precedent-bank", parentSlug: "knm-knowledge-management" },
  { name: "Training and onboarding", slug: "training-and-onboarding", parentSlug: "knm-knowledge-management" },

  { name: "Business development and pitch support", slug: "business-development-and-pitch-support", parentSlug: "cbd-client-and-business-development" },

  { name: "Meeting and scheduling support", slug: "meeting-and-scheduling-support", parentSlug: "ops-operations" },
  { name: "Financial and billing support", slug: "financial-and-billing-support", parentSlug: "ops-operations" },

  { name: "Internal compliance and governance support", slug: "internal-compliance-and-governance-support", parentSlug: "reg-regulatory-compliance" },

  { name: "Antitrust and abuse of dominance", slug: "antitrust-and-abuse-of-dominance", parentSlug: "competition-enforcement" },
  { name: "Merger control", slug: "merger-control", parentSlug: "competition-enforcement" },
  { name: "State aid", slug: "state-aid", parentSlug: "competition-enforcement" },

  { name: "Digital Markets Act (DMA)", slug: "digital-markets-act-dma", parentSlug: "digital-regulation" },
  { name: "Digital Services Act (DSA)", slug: "digital-services-act-dsa", parentSlug: "digital-regulation" },
  { name: "Data protection and AI regulation", slug: "data-protection-and-ai-regulation", parentSlug: "digital-regulation" },

  { name: "Regulatory investigations and cartels", slug: "regulatory-investigations-and-cartels", parentSlug: "dispute-and-sector-work" },
  { name: "Litigation and dispute resolution", slug: "litigation-and-dispute-resolution", parentSlug: "dispute-and-sector-work" },
  { name: "Sector-specific regulation", slug: "sector-specific-regulation", parentSlug: "dispute-and-sector-work" },
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
