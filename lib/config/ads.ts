export const adConfig = {
  enabled: true,
  usePlaceholders: true, // Set to false to enable real ads
  slots: {
    sidebar: 'ca-pub-XXXXXXXXXXXXXXXX', // Replace with real slot ID
    grid: 'ca-pub-XXXXXXXXXXXXXXXX',
    banner: 'ca-pub-XXXXXXXXXXXXXXXX',
    mobileContent: 'ca-pub-XXXXXXXXXXXXXXXX',
  },
  // Auto-ads are explicitly disabled/blocked by not including the auto-ad script.
  // When moving to production, ensure only manual unit scripts are added.
};
