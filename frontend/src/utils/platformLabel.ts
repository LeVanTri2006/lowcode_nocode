export const platformLabel = (value: string | null | undefined) => {
  if (!value) return '—';
  const normalized = value.toLowerCase();
  if (normalized === 'youtube') return 'YouTube';
  if (normalized === 'tiktok') return 'TikTok';
  return value;
};
