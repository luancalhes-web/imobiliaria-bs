import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env";
import { proxyAgent } from "../config/proxyAgent";

export const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, httpAgent: proxyAgent });

export const MODEL = env.ANTHROPIC_MODEL;
