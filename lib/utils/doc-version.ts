export function getDocVersion(seed: string): string {
  const versions = ['_V1', '_V2', '_V3', '_REV_A', '_BETA'];

  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Ensure positive index
  const index = Math.abs(hash) % versions.length;
  return versions[index];
}
