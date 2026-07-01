import { defineConfig } from "@/lib/config";

// Set to true to use clone branding (hide prompts.chat repo branding)
const useCloneBranding = true;

export default defineConfig({
  // Branding - customize for white-label
  branding: {
    name: "Geradin Partners Prompts",
    logo: "/favicon.svg",
    logoDark: "/logo-dark.svg",
    favicon: "/favicon.svg",
    description: "Collect, organize, and share AI prompts",

  },

  // Theme - design system configuration
  theme: {
    // Border radius: "none" | "sm" | "md" | "lg"
    radius: "sm",
    // UI style: "flat" | "default" | "brutal"
    variant: "default",
    // Spacing density: "compact" | "default" | "comfortable"
    density: "default",
    // Colors (hex or oklch)
    colors: {
      primary: "#6366f1", // Indigo
    },
  },

  // Authentication plugins
  auth: {
    // Available: "credentials" | "google" | "azure" | "github" | "apple" | "oidc" | "oauth" | custom
    // Use `providers` array to enable multiple auth providers
    providers: ["credentials"],
    // Allow public registration (only applies to credentials provider)
    allowRegistration: true,
  },

  // Internationalization
  i18n: {
    locales: ["en", "fr", "de", "nl"],
    defaultLocale: "en",
  },

  // Features
  features: {
    // Allow users to create private prompts
    privatePrompts: true,
    // Enable change request system for versioning
    changeRequests: true,
    // Enable categories
    categories: true,
    // Enable tags
    tags: true,
    // Enable AI-powered semantic search (requires OPENAI_API_KEY)
    aiSearch: false,
    // Enable AI-powered generation features (requires OPENAI_API_KEY)
    aiGeneration: false,
    // Enable MCP (Model Context Protocol) features including API key generation
    mcp: false,
    // Enable comments on prompts
    comments: true,
  },

  // Homepage customization
  homepage: {
    // Set to true to hide prompts.chat repo branding and use your own branding
    useCloneBranding,
    achievements: {
      enabled: !useCloneBranding,
    },
    sponsors: {
      enabled: !useCloneBranding,
      items: [
      ],
    },
  },
});
