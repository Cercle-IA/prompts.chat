// Types and constants for "Works Best With" feature

// MCP Server configuration for a prompt
export interface PromptMCPConfig {
  command: string;
  tools?: string[];
}

// Well-known AI models (slug -> display info)
export const AI_MODELS = {
  // OpenAI
  "gpt-5-5": { name: "GPT-5.5", provider: "OpenAI" },
  "gpt-5-4": { name: "GPT-5.4", provider: "OpenAI" },
  "gpt-5-4-mini": { name: "GPT-5.4 mini", provider: "OpenAI" },
  "o3": { name: "o3", provider: "OpenAI" },

  // Anthropic
  "fable-5": { name: "Fable 5", provider: "Anthropic" },
  "claude-opus-4-8": { name: "Opus 4.8", provider: "Anthropic" },
  "claude-sonnet-5": { name: "Sonnet 5", provider: "Anthropic" },
  "claude-haiku-4-5": { name: "Haiku 4.5", provider: "Anthropic" },
  "claude-3-5-sonnet": { name: "Claude 3.5 Sonnet", provider: "Anthropic", legacy: true },

  // Google
  "gemini-3-5-flash": { name: "Gemini 3.5 Flash", provider: "Google" },
  "gemini-3-1-pro": { name: "Gemini 3.1 Pro", provider: "Google" },
  "gemini-3-flash": { name: "Gemini 3 Flash", provider: "Google" },
  "gemini-2-5-flash": { name: "Gemini 2.5 Flash", provider: "Google" },

  // xAI
  "grok-4-1": { name: "Grok 4.1", provider: "xAI" },
  "grok-3": { name: "Grok 3", provider: "xAI" },

  // Image Generation
  "nano-banana-2": { name: "Nano Banana 2", provider: "Google" },
  "nano-banana-pro": { name: "Nano Banana Pro", provider: "Google" },
  "gpt-image-1-5": { name: "GPT Image 1.5", provider: "OpenAI" },
  "midjourney-v7": { name: "Midjourney v7", provider: "Midjourney" },
  "stable-diffusion-3-5": { name: "Stable Diffusion 3.5", provider: "Stability AI" },
  "flux-2": { name: "FLUX.2", provider: "Black Forest Labs" },
  "ideogram-v4": { name: "Ideogram v4", provider: "Ideogram" },

  // Video Generation
  "veo-3-1": { name: "Veo 3.1", provider: "Google" },
  "kling-3": { name: "Kling 3.0", provider: "Kuaishou" },
  "runway-gen-4-5": { name: "Runway Gen-4.5", provider: "Runway" },
} as const;

export type AIModelSlug = keyof typeof AI_MODELS;

export function getModelInfo(slug: string): { name: string; provider: string } | null {
  return AI_MODELS[slug as AIModelSlug] ?? null;
}

export function isValidModelSlug(slug: string): slug is AIModelSlug {
  return slug in AI_MODELS;
}

// Get models grouped by provider
export function getModelsByProvider(): Record<string, { slug: string; name: string }[]> {
  const grouped: Record<string, { slug: string; name: string }[]> = {};

  for (const [slug, info] of Object.entries(AI_MODELS)) {
    if ("legacy" in info && info.legacy) continue;

    if (!grouped[info.provider]) {
      grouped[info.provider] = [];
    }
    grouped[info.provider].push({ slug, name: info.name });
  }

  return grouped;
}

// Validate bestWithModels (max 3, valid slugs)
export function validateBestWithModels(models: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (models.length > 3) {
    errors.push("Maximum 3 models allowed");
  }

  for (const slug of models) {
    if (!isValidModelSlug(slug)) {
      errors.push(`Unknown model: ${slug}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// Validate bestWithMCP
export function validateBestWithMCP(mcp: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (mcp === null || mcp === undefined) {
    return { valid: true, errors: [] };
  }

  if (typeof mcp !== "object") {
    errors.push("MCP config must be an object");
    return { valid: false, errors };
  }

  const config = mcp as Record<string, unknown>;

  if (!("command" in config) || typeof config.command !== "string") {
    errors.push("MCP config.command is required and must be a string");
  }

  if ("tools" in config && config.tools !== undefined) {
    if (!Array.isArray(config.tools)) {
      errors.push("MCP config.tools must be an array");
    } else if (!config.tools.every((t: unknown) => typeof t === "string")) {
      errors.push("MCP config.tools must be an array of strings");
    }
  }

  return { valid: errors.length === 0, errors };
}
