export type Role = "guest" | "member" | "admin";

export type Metric = {
  id: string;
  label: string;
  value: string;
  delta: number;
  trend: "up" | "down";
  helper?: string;
};

export type TrendPoint = {
  date: string;
  value: number;
};

export type Notification = {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
  read?: boolean;
};

export type FileAsset = {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  status: "ready" | "processing" | "failed";
  createdAt: string;
};

export type QuickAction = {
  id: string;
  label: string;
  description: string;
  icon: string;
  command: string;
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
  streaming?: boolean;
};

export type ChatSession = {
  id: string;
  title: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

export type AiProvider = {
  id: string;
  name: string;
  models: string[];
  streaming: boolean;
};

export type AiTool = {
  slug: string;
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
};

