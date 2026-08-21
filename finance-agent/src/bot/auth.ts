import { Context, MiddlewareFn } from "telegraf";
import { env } from "../config/env";

export const ownerOnly: MiddlewareFn<Context> = (ctx, next) => {
  const fromId = ctx.from?.id?.toString();
  if (fromId !== env.TELEGRAM_OWNER_ID) {
    return; // ignora silenciosamente qualquer usuário que não seja o dono
  }
  return next();
};
