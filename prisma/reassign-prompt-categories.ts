import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MAPPING = [
  { title: "Find recent decisions on a market", slug: "regulatory-monitoring" },
  { title: "Summarise DMA enforcement actions", slug: "regulatory-monitoring" },
  { title: "Track national authority rulings", slug: "regulatory-monitoring" },
  { title: "Summarise likely policy direction", slug: "regulatory-monitoring" },

  { title: "Write a plain language client summary", slug: "correspondence-and-client-communication" },
  { title: "Coordinate case status across offices", slug: "correspondence-and-client-communication" },

  { title: "Draft a market definition section", slug: "legal-drafting" },
  { title: "Draft a response to a Statement of Objections", slug: "legal-drafting" },
  { title: "Draft standard confidentiality clauses", slug: "legal-drafting" },
  { title: "Draft a consultation response", slug: "legal-drafting" },

  { title: "Translate a decision", slug: "translation-and-localization" },
  { title: "Adapt a memo for another office", slug: "translation-and-localization" },
  { title: "Translate a client summary", slug: "translation-and-localization" },

  { title: "Assess dominance risk", slug: "analysis-and-strategy" },
  { title: "Estimate fine exposure", slug: "analysis-and-strategy" },

  { title: "Map case stakeholders", slug: "data-extraction-and-structuring" },
  { title: "Structure a data room", slug: "data-extraction-and-structuring" },

  { title: "Check argument consistency", slug: "review-and-quality-control" },
  { title: "Verify legal citations", slug: "review-and-quality-control" },
  { title: "Check guideline compliance", slug: "review-and-quality-control" },
  { title: "Proofread a memo", slug: "review-and-quality-control" },
  { title: "Harmonise terminology", slug: "review-and-quality-control" },
  { title: "Format a document to house style", slug: "review-and-quality-control" },

  { title: "Extract precedents from a closed file", slug: "knowledge-management-and-precedent-bank" },
  { title: "Build a precedent bank entry", slug: "knowledge-management-and-precedent-bank" },

  { title: "Summarise a technical guide", slug: "training-and-onboarding" },
  { title: "Draft onboarding notes for an approved tool", slug: "training-and-onboarding" },
  { title: "Draft training notes on a tool", slug: "training-and-onboarding" },

  { title: "Draft a LinkedIn post on a development", slug: "business-development-and-pitch-support" },
  { title: "Draft a client pitch presentation outline", slug: "business-development-and-pitch-support" },
  { title: "Draft a website summary of a decision", slug: "business-development-and-pitch-support" },
  { title: "Draft advocacy talking points", slug: "business-development-and-pitch-support" },

  { title: "Draft a weekly activity report", slug: "financial-and-billing-support" },

  { title: "Draft meeting minutes", slug: "meeting-and-scheduling-support" },

  { title: "Classify a document", slug: "internal-compliance-and-governance-support" },
  { title: "Check confidentiality before using a tool", slug: "internal-compliance-and-governance-support" },
  { title: "Track a regulatory deadline", slug: "internal-compliance-and-governance-support" },
  { title: "List upcoming notification deadlines", slug: "internal-compliance-and-governance-support" },
  { title: "Draft a register entry for a new tool", slug: "internal-compliance-and-governance-support" },
  { title: "Summarise audit findings", slug: "internal-compliance-and-governance-support" },
  { title: "Draft an FAQ on the AI Use Policy", slug: "internal-compliance-and-governance-support" },
  { title: "Draft an internal announcement", slug: "internal-compliance-and-governance-support" },
  { title: "Check a vendor for provider conflict", slug: "internal-compliance-and-governance-support" },
  { title: "Draft a vendor evaluation summary", slug: "internal-compliance-and-governance-support" },
  { title: "Draft a decision log entry", slug: "internal-compliance-and-governance-support" },

  { title: "Assess exclusionary conduct", slug: "antitrust-and-abuse-of-dominance" },
  { title: "Draft a margin squeeze rebuttal", slug: "antitrust-and-abuse-of-dominance" },
  { title: "Compare recent Article 102 decisions", slug: "antitrust-and-abuse-of-dominance" },

  { title: "Draft a Form CO section", slug: "merger-control" },
  { title: "Identify remedies precedent", slug: "merger-control" },
  { title: "Draft a simplified procedure request", slug: "merger-control" },

  { title: "Draft a State aid notification summary", slug: "state-aid" },
  { title: "Assess GBER compatibility", slug: "state-aid" },
  { title: "Track a recovery deadline", slug: "state-aid" },

  { title: "Assess an AI Act transparency obligation", slug: "data-protection-and-ai-regulation" },
  { title: "Draft a DMA compliance report section", slug: "digital-markets-act-dma" },
  { title: "Summarise a DSA due diligence requirement", slug: "digital-services-act-dsa" },

  { title: "Draft grounds of appeal", slug: "litigation-and-dispute-resolution" },
  { title: "Summarise the standard of review", slug: "litigation-and-dispute-resolution" },
  { title: "Track appeal deadlines across proceedings", slug: "litigation-and-dispute-resolution" },

  { title: "Draft a leniency checklist", slug: "regulatory-investigations-and-cartels" },
  { title: "Analyse information exchange risk", slug: "regulatory-investigations-and-cartels" },
  { title: "Summarise fining guidelines application", slug: "regulatory-investigations-and-cartels" },

  { title: "Summarise a sector inquiry scope", slug: "sector-specific-regulation" },
  { title: "Draft a questionnaire response", slug: "sector-specific-regulation" },
  { title: "Summarise preliminary findings", slug: "sector-specific-regulation" },
];

async function main() {
  const slugs = [...new Set(MAPPING.map((m) => m.slug))];
  const categories = await prisma.category.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  let updated = 0;
  const problems: string[] = [];

  for (const m of MAPPING) {
    const categoryId = categoryIdBySlug.get(m.slug);
    if (!categoryId) {
      problems.push(`Unknown category slug: ${m.slug} (title: ${m.title})`);
      continue;
    }

    const result = await prisma.prompt.updateMany({
      where: { title: m.title },
      data: { categoryId },
    });

    if (result.count !== 1) {
      problems.push(`Expected 1 match for "${m.title}", got ${result.count}`);
    } else {
      updated++;
      console.log(`OK: ${m.title} -> ${m.slug}`);
    }
  }

  console.log(`\nUpdated: ${updated}/${MAPPING.length}`);
  if (problems.length) {
    console.log("\nProblems:");
    problems.forEach((p) => console.log(` - ${p}`));
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
