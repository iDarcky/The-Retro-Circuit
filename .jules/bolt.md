# Bolt's Performance Journal

## 2024-05-24 - Initial Setup
**Learning:** Performance monitoring requires a persistent journal to track insights.
**Action:** Created this journal to track critical performance learnings.

## 2024-05-24 - Vacuum Strategy Bottleneck
**Learning:** The "Vacuum Strategy" (`fetchAllConsoles` fetching `*` and all nested relations) is extremely wasteful for high-traffic list views like the Console Vault. It fetches heavy JSON profiles (emulation/input) for every variant of every console, resulting in massive payloads.
**Action:** Split the data fetching into `fetchVaultConsoles` (lighter, list-optimized) and kept `fetchAllConsoles` for deep-dive tools like the Finder.

## 2026-02-19 - Parallelizing Independent Fetches
**Learning:** The landing page was fetching three independent datasets sequentially (latestAdded, latestReleases, allConsoles), causing a waterfall effect that delayed rendering by the sum of all latencies.
**Action:** Use `Promise.all` to run independent async operations concurrently, reducing total latency to the duration of the slowest request.
