import re

with open('lib/schemas/validation.ts', 'r') as f:
    content = f.read()

new_field = "\n  amazon_asin: safeString.nullable().optional(),"
content = content.replace(
    "price_launch_usd: safeNumber,",
    "price_launch_usd: safeNumber," + new_field
)

with open('lib/schemas/validation.ts', 'w') as f:
    f.write(content)
