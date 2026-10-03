import os
import glob

files = glob.glob('src/**/*.jsx', recursive=True)

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # Replace Wakefit.co first
    content = content.replace("Wakefit.co", "Sleep Nest")
    # Replace remaining Wakefit
    content = content.replace("Wakefit", "Sleep Nest")
    content = content.replace("wakefit", "sleepnest")
    
    with open(file, 'w') as f:
        f.write(content)

print("Replacement complete.")
