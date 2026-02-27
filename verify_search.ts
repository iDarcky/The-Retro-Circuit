import { searchDatabase } from './app/actions/search';
import { fetchConsoleList } from './app/actions/consoles';

async function verify() {
  console.log("--- Testing Global Search (RPC) ---");
  // Test 1: Manufacturer only
  const res1 = await searchDatabase("Nintendo");
  console.log("Query 'Nintendo':", res1.length, "results");
  if (res1.length > 0) console.log("Sample:", res1[0]);

  // Test 2: Console only
  const res2 = await searchDatabase("Game Boy");
  console.log("Query 'Game Boy':", res2.length, "results");
  if (res2.length > 0) console.log("Sample:", res2[0]);

  // Test 3: Manufacturer + Console (The Goal)
  const res3 = await searchDatabase("Nintendo Game Boy");
  console.log("Query 'Nintendo Game Boy':", res3.length, "results");
  if (res3.length > 0) console.log("Sample:", res3[0]);

  console.log("\n--- Testing Arena List (fetchConsoleList) ---");
  const list = await fetchConsoleList();
  console.log("Total Consoles:", list.length);
  const sample = list.find(c => c.name.includes("Nintendo"));
  console.log("Sample with Nintendo:", sample);
}

verify().catch(console.error);
