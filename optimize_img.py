from PIL import Image
import os

path = "assets/img/projetos/gtmovelcapa.png"
out_path = "assets/img/projetos/gtmovelcapa.webp"

try:
    print("Starting conversion for GT Movel with quality 99...")
    img = Image.open(path)
    
    # Save with 99 quality 
    img.save(out_path, format="WEBP", quality=99)
    
    size_kb = os.path.getsize(out_path) / 1024
    print(f"Success: Compressed to WebP. New size: {size_kb:.2f} KB")
except Exception as e:
    print("Error:", e)
