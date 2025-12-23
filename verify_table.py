import os
import requests
import json

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("Skipping verification: Env vars missing")
    exit(0)

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json"
}

# Try to select 1 item from console_finder_traits
endpoint = f"{url}/rest/v1/console_finder_traits?select=count"
try:
    response = requests.head(endpoint, headers=headers)
    if response.status_code == 200 or response.status_code == 206:
        print("Table 'console_finder_traits' exists and is accessible.")
    else:
        print(f"Table verification failed: Status {response.status_code}")
except Exception as e:
    print(f"Verification exception: {e}")
