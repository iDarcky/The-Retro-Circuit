import re

with open('lib/config/constants.ts', 'r') as f:
    content = f.read()

new_field = "\n            { label: 'Amazon ASIN', key: 'amazon_asin', type: 'text', required: false },"
content = content.replace(
    "{ label: 'Launch Price ($)', key: 'price_launch_usd', type: 'number', required: false },",
    "{ label: 'Launch Price ($)', key: 'price_launch_usd', type: 'number', required: false }," + new_field
)

with open('lib/config/constants.ts', 'w') as f:
    f.write(content)
