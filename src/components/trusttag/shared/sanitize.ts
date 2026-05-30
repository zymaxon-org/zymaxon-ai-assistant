// Strip contact details from messages — phone numbers, emails, social handles, URLs with handles
const PHONE = /(?:\+?\d[\d\s().-]{6,}\d)/g;
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const HANDLE = /(?<![A-Za-z0-9_])@[A-Za-z0-9_.]{2,}/g;
const URL = /(?:https?:\/\/|www\.)[^\s]+/gi;
const SOCIAL = /\b(?:whatsapp|telegram|instagram|facebook|twitter|tiktok|snapchat|signal|wechat|line)\b/gi;

export function sanitizeMessage(text: string): { sanitized: string; flagged: boolean } {
  let flagged = false;
  let out = text;
  for (const rx of [PHONE, EMAIL, HANDLE, URL, SOCIAL]) {
    if (rx.test(out)) flagged = true;
    out = out.replace(rx, '[blocked]');
  }
  return { sanitized: out, flagged };
}
