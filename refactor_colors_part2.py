import os

replacements = {
    'from-retro-neon': 'from-secondary',
    'to-retro-neon': 'to-secondary',
    'via-retro-neon': 'via-secondary',

    'from-retro-pink': 'from-accent',
    'to-retro-pink': 'to-accent',
    'via-retro-pink': 'via-accent',

    'from-retro-blue': 'from-primary',
    'to-retro-blue': 'to-primary',
    'via-retro-blue': 'via-primary',

    'shadow-retro-neon/20': 'shadow-secondary/20',
    'shadow-retro-pink/20': 'shadow-accent/20',

    'accent-retro-neon': 'accent-secondary',
    'focus:ring-retro-neon': 'focus:ring-secondary',

    'text-retro-grid': 'text-muted',
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
