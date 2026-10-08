// Números de WhatsApp chegam só com dígitos (ex.: "5511999998888").
// Celulares brasileiros às vezes vêm sem o nono dígito ("551199998888"),
// então comparamos as duas formas.

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function brazilVariants(number: string): string[] {
  const n = digitsOnly(number);
  const variants = new Set([n]);
  if (n.startsWith("55")) {
    const ddd = n.slice(2, 4);
    const local = n.slice(4);
    if (local.length === 9 && local.startsWith("9")) variants.add(`55${ddd}${local.slice(1)}`);
    if (local.length === 8) variants.add(`55${ddd}9${local}`);
  }
  return [...variants];
}

export function parseAllowedNumbers(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map(digitsOnly)
    .filter((n) => n.length > 0);
}

export function isAllowed(from: string, allowed: string[]): boolean {
  const fromVariants = brazilVariants(from);
  return allowed.some((a) => brazilVariants(a).some((v) => fromVariants.includes(v)));
}
