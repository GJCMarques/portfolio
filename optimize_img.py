from PIL import Image
import os

path = "assets/img/projetos/tecncoolcapa.png"
out_path = "assets/img/projetos/tecncoolcapa.webp"

try:
    print("Starting conversion for Tec N Cool (lossless)...")
    img = Image.open(path)
    
    # Save as lossless WebP to preserve exact original quality and size
    img.save(out_path, format="WEBP", lossless=True)
    
    size_kb = os.path.getsize(out_path) / 1024
    print(f"Success: Converted to WebP. New size: {size_kb:.2f} KB")
except Exception as e:
    print("Error:", e)
