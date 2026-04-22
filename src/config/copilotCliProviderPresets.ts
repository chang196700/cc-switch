/**
 * Copilot CLI 预设供应商配置模板
 */
import type { ProviderCategory } from "../types";

export interface CopilotCliProviderPreset {
  name: string;
  nameKey?: string;
  websiteUrl: string;
  /** settingsConfig: flat map of env var key -> value */
  settingsConfig: Record<string, string>;
  isOfficial?: boolean;
  category?: ProviderCategory;
  isCustomTemplate?: boolean;
  icon?: string;
  iconColor?: string;
  isPartner?: boolean;
  partnerPromotionKey?: string;
}

export const copilotCliProviderPresets: CopilotCliProviderPreset[] = [
  {
    name: "GitHub Copilot (官方)",
    nameKey: "copilotCli.preset.official",
    websiteUrl: "https://github.com/features/copilot",
    category: "official",
    isOfficial: true,
    icon: "github",
    iconColor: "#24292f",
    /** 空 settingsConfig 表示清除所有 BYOK env vars，恢复默认 OAuth 认证 */
    settingsConfig: {},
  },
  {
    name: "Anthropic (Claude)",
    nameKey: "copilotCli.preset.anthropic",
    websiteUrl: "https://console.anthropic.com",
    category: "third_party",
    icon: "anthropic",
    iconColor: "#D4A27A",
    settingsConfig: {
      COPILOT_PROVIDER_BASE_URL: "https://api.anthropic.com",
      COPILOT_PROVIDER_TYPE: "anthropic",
      COPILOT_PROVIDER_API_KEY: "",
      COPILOT_MODEL: "claude-sonnet-4-5",
    },
  },
  {
    name: "OpenAI",
    nameKey: "copilotCli.preset.openai",
    websiteUrl: "https://platform.openai.com",
    category: "official",
    icon: "openai",
    iconColor: "#000000",
    settingsConfig: {
      COPILOT_PROVIDER_BASE_URL: "https://api.openai.com",
      COPILOT_PROVIDER_TYPE: "openai",
      COPILOT_PROVIDER_API_KEY: "",
      COPILOT_MODEL: "gpt-4o",
    },
  },
  {
    name: "Azure OpenAI",
    nameKey: "copilotCli.preset.azure",
    websiteUrl: "https://azure.microsoft.com",
    category: "cloud_provider",
    icon: "azure",
    iconColor: "#0078D4",
    settingsConfig: {
      COPILOT_PROVIDER_BASE_URL: "https://<resource>.openai.azure.com/openai/deployments/<deployment>",
      COPILOT_PROVIDER_TYPE: "azure",
      COPILOT_PROVIDER_API_KEY: "",
      COPILOT_MODEL: "gpt-4o",
      COPILOT_PROVIDER_AZURE_API_VERSION: "2024-08-01-preview",
    },
  },
  {
    name: "Ollama (本地)",
    nameKey: "copilotCli.preset.ollama",
    websiteUrl: "https://ollama.com",
    category: "third_party",
    icon: "ollama",
    settingsConfig: {
      COPILOT_PROVIDER_BASE_URL: "http://localhost:11434",
      COPILOT_PROVIDER_TYPE: "openai",
      COPILOT_MODEL: "llama3.2",
    },
  },
  {
    name: "AICodeMirror",
    nameKey: "copilotCli.preset.aicodemirror",
    websiteUrl: "https://www.aicodemirror.com",
    category: "third_party",
    icon: "aicodemirror",
    settingsConfig: {
      COPILOT_PROVIDER_BASE_URL: "https://api.aicodemirror.com",
      COPILOT_PROVIDER_TYPE: "openai",
      COPILOT_PROVIDER_API_KEY: "",
      COPILOT_MODEL: "claude-sonnet-4-6",
      COPILOT_PROVIDER_MAX_PROMPT_TOKENS: "200000",
      COPILOT_PROVIDER_MAX_OUTPUT_TOKENS: "64000",
    },
  },
  {
    name: "自定义端点",
    nameKey: "copilotCli.preset.custom",
    websiteUrl: "",
    category: "custom",
    isCustomTemplate: true,
    settingsConfig: {
      COPILOT_PROVIDER_BASE_URL: "",
      COPILOT_PROVIDER_TYPE: "openai",
      COPILOT_PROVIDER_API_KEY: "",
      COPILOT_MODEL: "",
    },
  },
];
