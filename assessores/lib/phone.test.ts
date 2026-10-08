import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { brazilVariants, isAllowed, parseAllowedNumbers } from "./phone.ts";
import { extractMessages, isValidSignature } from "./whatsapp.ts";

test("aceita o número com e sem o nono dígito", () => {
  const allowed = parseAllowedNumbers("+55 (11) 99999-8888");
  assert.ok(isAllowed("5511999998888", allowed));
  assert.ok(isAllowed("551199998888", allowed));
  assert.ok(!isAllowed("5511999997777", allowed));
});

test("lista vazia não libera ninguém", () => {
  assert.ok(!isAllowed("5511999998888", parseAllowedNumbers("")));
  assert.ok(!isAllowed("5511999998888", parseAllowedNumbers(undefined)));
});

test("variantes de número brasileiro", () => {
  assert.deepEqual(brazilVariants("551199998888").sort(), ["551199998888", "5511999998888"].sort());
  assert.deepEqual(brazilVariants("14155550123"), ["14155550123"]);
});

test("assinatura do webhook", () => {
  const body = '{"object":"whatsapp_business_account"}';
  const sig = "sha256=" + createHmac("sha256", "segredo").update(body).digest("hex");
  assert.ok(isValidSignature(body, sig, "segredo"));
  assert.ok(!isValidSignature(body, sig, "outro"));
  assert.ok(!isValidSignature(body, null, "segredo"));
  assert.ok(!isValidSignature(body, "sha256=abc", "segredo"));
});

test("extrai mensagens do payload e ignora status", () => {
  const payload = {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          { value: { messages: [{ id: "wamid.1", from: "5511999998888", timestamp: "1", type: "text", text: { body: "oi" } }] } },
          { value: { statuses: [{ id: "wamid.0" }] } },
        ],
      },
    ],
  };
  const msgs = extractMessages(payload);
  assert.equal(msgs.length, 1);
  assert.equal(msgs[0].text?.body, "oi");
  assert.deepEqual(extractMessages({ object: "page" }), []);
});
