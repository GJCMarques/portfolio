from PIL import Image
import os

path = "assets/img/projetos/acasadogicapa.png"
out_path = "assets/img/projetos/acasadogicapa.webp"

try:
    print("Starting conversion for A Casa do Gi (Quality 100)...")
    img = Image.open(path)
    
    # Save with 100 quality
    img.save(out_path, format="WEBP", quality=100)
    
    size_kb = os.path.getsize(out_path) / 1024
    print(f"Success: Compressed to WebP. New size: {size_kb:.2f} KB")
except Exception as e:
    print("Error:", e)
