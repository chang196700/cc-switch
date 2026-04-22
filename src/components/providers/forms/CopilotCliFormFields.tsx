import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApiKeyInput from "./ApiKeyInput";

type ProviderType = "openai" | "azure" | "anthropic";

export interface CopilotCliEnvConfig {
  baseUrl: string;
  providerType: ProviderType;
  apiKey: string;
  model: string;
  wireModel: string;
  wireApi: string;
  azureApiVersion: string;
  maxPromptTokens: string;
  maxOutputTokens: string;
}

interface CopilotCliFormFieldsProps {
  config: CopilotCliEnvConfig;
  onChange: (config: CopilotCliEnvConfig) => void;
}

/** Parse a flat Copilot settingsConfig JSON string into CopilotCliEnvConfig */
export function parseCopilotConfig(raw: string): CopilotCliEnvConfig {
  try {
    const obj = JSON.parse(raw || "{}");
    return {
      baseUrl: obj.COPILOT_PROVIDER_BASE_URL ?? "",
      providerType: (obj.COPILOT_PROVIDER_TYPE as ProviderType) ?? "openai",
      apiKey: obj.COPILOT_PROVIDER_API_KEY ?? "",
      model: obj.COPILOT_MODEL ?? "",
      wireModel: obj.COPILOT_PROVIDER_WIRE_MODEL ?? "",
      wireApi: obj.COPILOT_PROVIDER_WIRE_API ?? "",
      azureApiVersion: obj.COPILOT_PROVIDER_AZURE_API_VERSION ?? "",
      maxPromptTokens: obj.COPILOT_PROVIDER_MAX_PROMPT_TOKENS ?? "",
      maxOutputTokens: obj.COPILOT_PROVIDER_MAX_OUTPUT_TOKENS ?? "",
    };
  } catch {
    return {
      baseUrl: "",
      providerType: "openai",
      apiKey: "",
      model: "",
      wireModel: "",
      wireApi: "",
      azureApiVersion: "",
      maxPromptTokens: "",
      maxOutputTokens: "",
    };
  }
}

/** Serialize CopilotCliEnvConfig back to settingsConfig JSON string */
export function serializeCopilotConfig(config: CopilotCliEnvConfig): string {
  const obj: Record<string, string> = {};
  if (config.baseUrl) obj.COPILOT_PROVIDER_BASE_URL = config.baseUrl;
  if (config.providerType) obj.COPILOT_PROVIDER_TYPE = config.providerType;
  if (config.apiKey) obj.COPILOT_PROVIDER_API_KEY = config.apiKey;
  if (config.model) obj.COPILOT_MODEL = config.model;
  if (config.wireModel) obj.COPILOT_PROVIDER_WIRE_MODEL = config.wireModel;
  if (config.wireApi) obj.COPILOT_PROVIDER_WIRE_API = config.wireApi;
  if (config.azureApiVersion)
    obj.COPILOT_PROVIDER_AZURE_API_VERSION = config.azureApiVersion;
  if (config.maxPromptTokens)
    obj.COPILOT_PROVIDER_MAX_PROMPT_TOKENS = config.maxPromptTokens;
  if (config.maxOutputTokens)
    obj.COPILOT_PROVIDER_MAX_OUTPUT_TOKENS = config.maxOutputTokens;
  return JSON.stringify(obj, null, 2);
}

export function CopilotCliFormFields({
  config,
  onChange,
}: CopilotCliFormFieldsProps) {
  const { t } = useTranslation();

  const update = (partial: Partial<CopilotCliEnvConfig>) => {
    onChange({ ...config, ...partial });
  };

  const isOfficialMode = !config.baseUrl;

  return (
    <div className="space-y-4">
      {/* Official mode notice */}
      {isOfficialMode && (
        <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          {t("copilotCli.officialModeNotice", {
            defaultValue:
              "当前为官方模式：未设置 COPILOT_PROVIDER_BASE_URL，Copilot CLI 将使用默认的 GitHub Copilot OAuth 认证，无需填写 BYOK 配置。",
          })}
        </div>
      )}

      {/* ccopilot usage hint */}
      {!isOfficialMode && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          {t("copilotCli.ccopilotHint", {
            defaultValue:
              "应用后请使用 ccopilot 命令代替 copilot（脚本已生成至 ~/.cc-switch/ccopilot）。将 ~/.cc-switch 加入 PATH 即可全局使用。",
          })}
        </div>
      )}

      {/* Base URL */}
      <div className="space-y-1">
        <Label htmlFor="copilot-base-url">
          {t("copilotCli.baseUrl", { defaultValue: "API 端点 (Base URL)" })}
          {!isOfficialMode && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Input
          id="copilot-base-url"
          value={config.baseUrl}
          onChange={(e) => update({ baseUrl: e.target.value })}
          placeholder="https://api.anthropic.com"
        />
        <p className="text-xs text-muted-foreground">
          {t("copilotCli.baseUrlHint", {
            defaultValue:
              "设置 COPILOT_PROVIDER_BASE_URL 以激活 BYOK 模式；留空则使用官方 GitHub OAuth",
          })}
        </p>
      </div>

      {/* Provider Type */}
      <div className="space-y-1">
        <Label htmlFor="copilot-provider-type">
          {t("copilotCli.providerType", { defaultValue: "供应商类型" })}
        </Label>
        <Select
          value={config.providerType}
          onValueChange={(v) => update({ providerType: v as ProviderType })}
        >
          <SelectTrigger id="copilot-provider-type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="azure">Azure OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* API Key */}
      <div className="space-y-1">
        <ApiKeyInput
          id="copilot-api-key"
          label={t("copilotCli.apiKey", { defaultValue: "API Key" })}
          value={config.apiKey}
          onChange={(v) => update({ apiKey: v })}
        />
      </div>

      {/* Model */}
      <div className="space-y-1">
        <Label htmlFor="copilot-model">
          {t("copilotCli.model", { defaultValue: "模型名称 (COPILOT_MODEL)" })}
        </Label>
        <Input
          id="copilot-model"
          value={config.model}
          onChange={(e) => update({ model: e.target.value })}
          placeholder="claude-sonnet-4-5"
        />
      </div>

      {/* Azure API Version (conditional) */}
      {config.providerType === "azure" && (
        <div className="space-y-1">
          <Label htmlFor="copilot-azure-version">
            {t("copilotCli.azureApiVersion", {
              defaultValue: "Azure API 版本",
            })}
          </Label>
          <Input
            id="copilot-azure-version"
            value={config.azureApiVersion}
            onChange={(e) => update({ azureApiVersion: e.target.value })}
            placeholder="2024-08-01-preview"
          />
        </div>
      )}

      {/* Advanced: Wire Model */}
      <div className="space-y-1">
        <Label htmlFor="copilot-wire-model">
          {t("copilotCli.wireModel", {
            defaultValue: "Wire Model（可选，发送给 Provider 的模型名）",
          })}
        </Label>
        <Input
          id="copilot-wire-model"
          value={config.wireModel}
          onChange={(e) => update({ wireModel: e.target.value })}
          placeholder={t("copilotCli.optional", { defaultValue: "可选" })}
        />
      </div>

      {/* Advanced: Wire API */}
      <div className="space-y-1">
        <Label htmlFor="copilot-wire-api">
          {t("copilotCli.wireApi", { defaultValue: "Wire API（可选）" })}
        </Label>
        <Select
          value={config.wireApi || "_none"}
          onValueChange={(v) => update({ wireApi: v === "_none" ? "" : v })}
        >
          <SelectTrigger id="copilot-wire-api">
            <SelectValue
              placeholder={t("copilotCli.optional", { defaultValue: "可选" })}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_none">
              {t("copilotCli.optional", { defaultValue: "可选" })}
            </SelectItem>
            <SelectItem value="completions">completions</SelectItem>
            <SelectItem value="responses">responses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Max Prompt Tokens */}
      <div className="space-y-1">
        <Label htmlFor="copilot-max-prompt-tokens">
          {t("copilotCli.maxPromptTokens", {
            defaultValue: "最大提示词 Token 数（COPILOT_PROVIDER_MAX_PROMPT_TOKENS）",
          })}
        </Label>
        <Input
          id="copilot-max-prompt-tokens"
          type="number"
          min={1}
          value={config.maxPromptTokens}
          onChange={(e) => update({ maxPromptTokens: e.target.value })}
          placeholder={t("copilotCli.optional", { defaultValue: "可选" })}
        />
        <p className="text-xs text-muted-foreground">
          {t("copilotCli.maxPromptTokensHint", {
            defaultValue:
              "模型不在内置目录时可手动指定，避免使用默认值（如 claude-sonnet-4-6 等新模型）",
          })}
        </p>
      </div>

      {/* Max Output Tokens */}
      <div className="space-y-1">
        <Label htmlFor="copilot-max-output-tokens">
          {t("copilotCli.maxOutputTokens", {
            defaultValue: "最大输出 Token 数（COPILOT_PROVIDER_MAX_OUTPUT_TOKENS）",
          })}
        </Label>
        <Input
          id="copilot-max-output-tokens"
          type="number"
          min={1}
          value={config.maxOutputTokens}
          onChange={(e) => update({ maxOutputTokens: e.target.value })}
          placeholder={t("copilotCli.optional", { defaultValue: "可选" })}
        />
      </div>
    </div>
  );
}
