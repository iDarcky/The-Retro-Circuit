import os

replacements = {
    'text-retro-neon': 'text-secondary',
    'bg-retro-neon': 'bg-secondary',
    'border-retro-neon': 'border-secondary',

    'text-retro-pink': 'text-accent',
    'bg-retro-pink': 'bg-accent',
    'border-retro-pink': 'border-accent',

    'text-retro-blue': 'text-primary',
    'bg-retro-blue': 'bg-primary',
    'border-retro-blue': 'border-primary',

    'bg-retro-dark': 'bg-bg-primary',
    'text-retro-dark': 'text-bg-primary',

    'bg-retro-grid': 'bg-bg-secondary',
    'text-retro-grid': 'text-muted',
    'border-retro-grid': 'border-border-normal',
}

extensions = ['.tsx', '.ts', '.jsx', '.js']

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root:
        continue
    for file in files:
        if any(file.endswith(ext) for ext in extensions):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()

            new_content = content
            for old, new in replacements.items():
                new_content = new_content.replace(old, new)

            if new_content != content:
                print(f"Updating {filepath}")
                with open(filepath, 'w') as f:
                    f.write(new_content)
