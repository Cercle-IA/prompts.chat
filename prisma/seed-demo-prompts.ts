import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USERNAMES = [
  "margrethe_testager",
  "joaquin_al_mergia",
  "neelie_kroes_ex_officio",
  "mario_monti_poly",
  "karel_van_cartelproof",
  "koen_len_arts",
  "nils_wahl_of_law",
  "marc_van_der_wood",
  "peter_suther_lenience",
  "pascal_lamy_cus",
];

const PROMPTS = [
  { categorySlug: "research-and-monitoring", title: "Find recent decisions on a market", content: "List Commission and national authority decisions issued in the last 12 months concerning [market/sector]. For each, give the date, the authority, the parties, and a two sentence summary of the outcome." },
  { categorySlug: "research-and-monitoring", title: "Summarise DMA enforcement actions", content: "Summarise DMA enforcement actions taken against gatekeepers since [date]. Group by gatekeeper and by obligation under Articles 5, 6 and 7." },
  { categorySlug: "research-and-monitoring", title: "Track national authority rulings", content: "Summarise rulings from [national authority] on [practice] since [date], noting any divergence from Commission practice on the same issue." },

  { categorySlug: "legal-drafting", title: "Draft a market definition section", content: "Draft the relevant market definition section of a Form CO for [transaction], covering the product market and geographic market, based on the attached facts. Flag any point where the facts are insufficient to reach a conclusion." },
  { categorySlug: "legal-drafting", title: "Draft a response to a Statement of Objections", content: "Draft a response to the attached Statement of Objections, addressing each objection in turn and referencing the supporting evidence provided." },
  { categorySlug: "legal-drafting", title: "Draft standard confidentiality clauses", content: "Draft a confidentiality clause for a [type of agreement] between [party type] entities, covering permitted disclosures, duration, and return or destruction of information on termination." },

  { categorySlug: "analysis-and-strategy", title: "Assess dominance risk", content: "Based on the attached market data, assess whether [company] is likely to be found dominant in [market], referencing relevant Commission and Court precedent on market share thresholds and barriers to entry." },
  { categorySlug: "analysis-and-strategy", title: "Estimate fine exposure", content: "Estimate the range of a possible fine under Article 23 of Regulation 1/2003 for [conduct], using the 2006 fining guidelines and the turnover figures provided. Show the calculation steps." },
  { categorySlug: "analysis-and-strategy", title: "Map case stakeholders", content: "From the attached case file, list all parties, their counsel, and their position on each contested issue in a table." },

  { categorySlug: "review-and-quality-control", title: "Check argument consistency", content: "Review the attached memo and flag any point where the conclusion is not supported by the reasoning in the preceding paragraphs." },
  { categorySlug: "review-and-quality-control", title: "Verify legal citations", content: "Check every case and article citation in the attached document against the text quoted and flag any mismatch or citation that cannot be verified." },
  { categorySlug: "review-and-quality-control", title: "Check guideline compliance", content: "Compare the attached submission against the Commission's guidelines on [topic] and list any section that does not follow the recommended structure or content." },

  { categorySlug: "proofreading-and-formatting", title: "Proofread a memo", content: "Proofread the attached memo for grammar, spelling and punctuation in [language]. Do not change the legal content or structure." },
  { categorySlug: "proofreading-and-formatting", title: "Harmonise terminology", content: "Compare the terminology used in the Brussels draft and the [other office] draft of the same document and list any inconsistent term, with a suggested single term to use throughout." },
  { categorySlug: "proofreading-and-formatting", title: "Format a document to house style", content: "Reformat the attached document to sentence case headings, no em dashes, and consistent numbering, without changing the wording." },

  { categorySlug: "client-communication-and-coordination", title: "Write a plain language client summary", content: "Summarise the attached decision or memo in plain language for a client with no legal background, in no more than 300 words." },
  { categorySlug: "client-communication-and-coordination", title: "Draft meeting minutes", content: "Turn the attached notes into structured meeting minutes with attendees, decisions taken, and action items with owners and dates." },
  { categorySlug: "client-communication-and-coordination", title: "Coordinate case status across offices", content: "Draft a short status update on [case] for the teams in [offices], covering progress since the last update, open questions, and the next deadline." },

  { categorySlug: "translation", title: "Translate a decision", content: "Translate the attached decision from [source language] to [target language], keeping legal terms consistent with standard usage in the target jurisdiction." },
  { categorySlug: "translation", title: "Adapt a memo for another office", content: "Translate and adapt the attached memo for the [office] team in [language], adjusting references to local procedure where relevant." },
  { categorySlug: "translation", title: "Translate a client summary", content: "Translate the attached client summary from [source language] to [target language] while keeping the tone suitable for a non-legal reader." },

  { categorySlug: "data-management-and-compliance", title: "Classify a document", content: "Read the attached document and suggest a data classification from C1 to C5 based on the AI Use Policy definitions, with a one sentence justification." },
  { categorySlug: "data-management-and-compliance", title: "Check confidentiality before using a tool", content: "Given the classification of this document and the list of approved tools, confirm whether it can be processed by [tool] under the current AI Use Policy." },
  { categorySlug: "data-management-and-compliance", title: "Structure a data room", content: "Propose a folder structure for a due diligence data room for [transaction type], with top level categories and a short description of what belongs in each." },

  { categorySlug: "knowledge-management", title: "Extract precedents from a closed file", content: "Read the attached closed file and extract the key legal arguments and outcomes that could be reused as precedent for similar matters, without including client identifying details." },
  { categorySlug: "knowledge-management", title: "Summarise a technical guide", content: "Summarise the attached guide in no more than one page, organised by topic, for internal training purposes." },
  { categorySlug: "knowledge-management", title: "Build a precedent bank entry", content: "Draft a one page precedent bank entry for [case], covering the issue, the outcome, and why it is relevant to future matters of this type." },

  { categorySlug: "administrative-support", title: "Draft a weekly activity report", content: "Turn the attached list of tasks and hours into a short weekly activity report, grouped by matter." },
  { categorySlug: "administrative-support", title: "Track a regulatory deadline", content: "From the attached facts, calculate the applicable deadline for [obligation, e.g. Article 50 AI Act transparency obligation] for [client], and list the steps needed before that date." },
  { categorySlug: "administrative-support", title: "List upcoming notification deadlines", content: "From the attached case list, extract all upcoming notification or filing deadlines in the next 60 days, sorted by date." },

  { categorySlug: "internal-operations", title: "Draft a register entry for a new tool", content: "Draft an entry for the AI systems register for [tool name], covering provider, intended use, data classification allowed, and approval status, based on the attached vendor information." },
  { categorySlug: "internal-operations", title: "Draft onboarding notes for an approved tool", content: "Draft a one page onboarding note for [tool] covering what it can be used for, what data it must not be given, and who to contact with questions." },
  { categorySlug: "internal-operations", title: "Summarise audit findings", content: "Summarise the attached internal AI audit findings into a short list of gaps and a suggested owner for each." },

  { categorySlug: "marketing", title: "Draft a LinkedIn post on a development", content: "Draft a LinkedIn post of no more than 150 words on [regulatory development], written for a professional audience, with no unsupported claims and no promotional language." },
  { categorySlug: "marketing", title: "Draft a client pitch presentation outline", content: "Draft a slide by slide outline for a pitch presentation on [topic] for [client type], covering the issue, the firm's experience, and the proposed approach." },
  { categorySlug: "marketing", title: "Draft a website summary of a decision", content: "Draft a short, factual website summary of [decision], suitable for a general professional audience, citing the source." },

  { categorySlug: "internal-communication", title: "Draft an FAQ on the AI Use Policy", content: "Draft five frequently asked questions and answers on the AI Use Policy, covering data classification, approved tools, and what to do if a client asks about AI use on their matter." },
  { categorySlug: "internal-communication", title: "Draft training notes on a tool", content: "Draft short training notes for [tool], covering three example prompts and three things not to do with it." },
  { categorySlug: "internal-communication", title: "Draft an internal announcement", content: "Draft a short internal announcement about [change, e.g. a new approved tool or policy update], stating what is changing, from when, and who to contact with questions." },

  { categorySlug: "merger-control", title: "Draft a Form CO section", content: "Draft the [section name] section of a Form CO for [transaction], based on the attached facts and structured to follow the Commission's implementing regulation." },
  { categorySlug: "merger-control", title: "Identify remedies precedent", content: "List Commission decisions in [sector] that involved structural or behavioural remedies in the last five years, with a short description of each remedy." },
  { categorySlug: "merger-control", title: "Draft a simplified procedure request", content: "Draft the justification section for a simplified procedure request for [transaction], based on the market share and overlap data provided." },

  { categorySlug: "antitrust-and-cartels", title: "Draft a leniency checklist", content: "Draft a checklist of the information and evidence typically required for a leniency application under the Commission's Leniency Notice, based on the facts provided." },
  { categorySlug: "antitrust-and-cartels", title: "Analyse information exchange risk", content: "Assess whether the information exchange described in the attached facts raises a risk under Article 101, referencing relevant case law on the exchange of pricing or capacity information between competitors." },
  { categorySlug: "antitrust-and-cartels", title: "Summarise fining guidelines application", content: "Apply the 2006 fining guidelines to the facts of [conduct] and explain each step of the calculation in plain language for the client." },

  { categorySlug: "abuse-of-dominance", title: "Assess exclusionary conduct", content: "Assess whether [conduct] could be found exclusionary under Article 102, using the [theory of harm, e.g. margin squeeze, refusal to supply] and the relevant Court case law." },
  { categorySlug: "abuse-of-dominance", title: "Draft a margin squeeze rebuttal", content: "Draft a rebuttal to the margin squeeze allegation described in the attached complaint, addressing the cost and price data provided." },
  { categorySlug: "abuse-of-dominance", title: "Compare recent Article 102 decisions", content: "Compare the recent Commission and national decisions on [practice] under Article 102 and summarise any difference in approach." },

  { categorySlug: "state-aid", title: "Draft a State aid notification summary", content: "Summarise the key elements of the attached State aid notification for [measure], covering the beneficiary, the aid amount, and the legal basis relied on." },
  { categorySlug: "state-aid", title: "Assess GBER compatibility", content: "Assess whether [measure] meets the conditions of the relevant category under the General Block Exemption Regulation, based on the facts provided." },
  { categorySlug: "state-aid", title: "Track a recovery deadline", content: "From the attached decision, calculate the recovery deadline and list the steps the client needs to take before that date." },

  { categorySlug: "digital-regulation-dma-dsa-ai-act", title: "Draft a DMA compliance report section", content: "Draft the section of a DMA compliance report covering [gatekeeper obligation, e.g. Article 6(5)], based on the facts and evidence provided." },
  { categorySlug: "digital-regulation-dma-dsa-ai-act", title: "Assess an AI Act transparency obligation", content: "Assess whether [AI system] falls under the Article 50 transparency obligation of the AI Act and, if so, list the steps needed to comply before the August 2026 application date." },
  { categorySlug: "digital-regulation-dma-dsa-ai-act", title: "Summarise a DSA due diligence requirement", content: "Summarise the due diligence obligation under [DSA article] applicable to [service type] and list the evidence typically needed to demonstrate compliance." },

  { categorySlug: "litigation-and-appeals", title: "Draft grounds of appeal", content: "Draft the grounds of appeal on [procedural issue] against [decision], referencing the relevant provisions of the Statute of the Court of Justice and prior case law on the same issue." },
  { categorySlug: "litigation-and-appeals", title: "Summarise the standard of review", content: "Summarise the standard of review applied by the General Court in [case], and how it compares to the standard applied in [comparable case]." },
  { categorySlug: "litigation-and-appeals", title: "Track appeal deadlines across proceedings", content: "From the attached case list, list all appeal deadlines across the parallel proceedings, sorted by date, with the relevant court for each." },

  { categorySlug: "sector-inquiries-and-market-investigations", title: "Summarise a sector inquiry scope", content: "Summarise the scope and timeline of the Commission's sector inquiry into [industry], based on the published decision to open the inquiry." },
  { categorySlug: "sector-inquiries-and-market-investigations", title: "Draft a questionnaire response", content: "Draft a response to question [number] of the market investigation questionnaire, based on the data and facts provided by the client." },
  { categorySlug: "sector-inquiries-and-market-investigations", title: "Summarise preliminary findings", content: "Summarise the preliminary findings published in [sector inquiry report] in no more than one page, organised by theme." },

  { categorySlug: "regulatory-strategy-and-advocacy", title: "Draft a consultation response", content: "Draft a response to the Commission's public consultation on [draft guideline], covering the points listed in the attached client instructions." },
  { categorySlug: "regulatory-strategy-and-advocacy", title: "Summarise likely policy direction", content: "Summarise the likely direction of Commission policy on [topic] based on recent speeches, consultations, and draft texts published in the last 12 months." },
  { categorySlug: "regulatory-strategy-and-advocacy", title: "Draft advocacy talking points", content: "Draft three talking points for a meeting with [institution] on [topic], each supported by a specific fact or precedent." },

  { categorySlug: "provider-conflict-and-vendor-governance", title: "Check a vendor for provider conflict", content: "Based on the attached vendor information, check whether [vendor] or its parent company is a current litigation opponent of the firm or a company the firm has declined to represent." },
  { categorySlug: "provider-conflict-and-vendor-governance", title: "Draft a vendor evaluation summary", content: "Summarise the attached evaluation of [tool] against the firm's criteria for data handling, provider conflict, and cost, and give a recommendation." },
  { categorySlug: "provider-conflict-and-vendor-governance", title: "Draft a decision log entry", content: "Draft a decision log entry recording the choice of [tool] over [alternative], the reasons given, and who approved the decision." },
];

async function main() {
  const users = await prisma.user.findMany({
    where: { username: { in: DEMO_USERNAMES } },
    select: { id: true, username: true },
  });
  if (users.length !== DEMO_USERNAMES.length) {
    throw new Error(`Expected ${DEMO_USERNAMES.length} demo users, found ${users.length}`);
  }

  const categorySlugs = [...new Set(PROMPTS.map((p) => p.categorySlug))];
  const categories = await prisma.category.findMany({
    where: { slug: { in: categorySlugs } },
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

  let created = 0;
  let skipped = 0;

  for (const p of PROMPTS) {
    const categoryId = categoryIdBySlug.get(p.categorySlug);
    if (!categoryId) throw new Error(`Unknown category slug: ${p.categorySlug}`);

    const existing = await prisma.prompt.findFirst({
      where: { title: p.title, categoryId },
      select: { id: true },
    });
    if (existing) {
      console.log(`SKIP (exists): ${p.title}`);
      skipped++;
      continue;
    }

    const author = users[Math.floor(Math.random() * users.length)];

    const prompt = await prisma.prompt.create({
      data: {
        title: p.title,
        content: p.content,
        authorId: author.id,
        categoryId,
        isPrivate: false,
      },
    });
    console.log(`OK: ${prompt.title} -> ${author.username} [${p.categorySlug}]`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, skipped: ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
