import { ParsedTransactionResult } from "../llm/schemas";

export interface PendingTransaction {
  parsed: ParsedTransactionResult;
  rawMessage: string;
}

const pendingByChat = new Map<number, PendingTransaction>();

export function setPending(chatId: number, pending: PendingTransaction) {
  pendingByChat.set(chatId, pending);
}

export function getPending(chatId: number): PendingTransaction | undefined {
  return pendingByChat.get(chatId);
}

export function clearPending(chatId: number) {
  pendingByChat.delete(chatId);
}
