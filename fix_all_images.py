import glob

files = glob.glob('src/pages/*.jsx')

for fpath in files:
    with open(fpath, 'r') as f:
        content = f.read()
    
    # We want to replace <img src={product.images[0]} with <img src={product.images.find(img => !img?.endsWith('.mp4')) || product.images[0]}
    new_content = content.replace("<img src={product.images[0]}", "<img src={product.images.find(img => !img.endsWith('.mp4')) || product.images[0]}")
    
    if new_content != content:
        with open(fpath, 'w') as f:
            f.write(new_content)
            print(f"Fixed {fpath}")

