import os

def contains_emoji(text):
    for char in text:
        # Check for non-ASCII characters that are likely emojis
        # This is a simple heuristic; for more robust check we could use the emoji library
        if ord(char) > 127:
            # Filter out common non-emoji non-ASCII chars if necessary (e.g. copyright, smart quotes)
            # For this task, we want to find mostly everything that isn't standard code
            return True, char
    return False, None

def scan_files(directory):
    emoji_files = []
    print(f"Scanning {directory}...")
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        lines = f.readlines()
                        for i, line in enumerate(lines):
                            has_emoji, char = contains_emoji(line)
                            if has_emoji:
                                # Print hex value to identify the char
                                print(f"FILE: {path}")
                                print(f"LINE {i+1}: {line.strip()}")
                                print(f"CHAR: {char} (Base 10: {ord(char)}, Hex: {hex(ord(char))})")
                                print("-" * 40)
                                emoji_files.append(path)
                                break
                except Exception as e:
                    print(f"Error reading {path}: {e}")
    
    return emoji_files

if __name__ == "__main__":
    scan_files('./src')
