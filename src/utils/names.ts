/** "john.smith92@mail.com" -> "John Smith". Used until the server tells us a real name at sign-in. */
export function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? '';
  const words = local
    .replace(/[0-9]+/g, '')
    .split(/[._+\-\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return words.join(' ') || 'there';
}
