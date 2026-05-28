from PIL import Image
import os

path = "assets/img/projetos/expolivecapa.png"
out_path = "assets/img/projetos/expolivecapa.webp"

try:
    print("Starting conversion for updated Expolive image with quality 99...")
    img = Image.open(path)
    
    max_width = 2560
    if img.size[0] > max_width:
        ratio = max_width / img.size[0]
        new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
        img = img.resize(new_size, Image.LANCZOS)
    
    # Save with 99 quality to hit the ~800-900 KB mark
    img.save(out_path, format="WEBP", quality=99)
    
    size_kb = os.path.getsize(out_path) / 1024
    print(f"Success: Compressed to WebP. New size: {size_kb:.2f} KB")
except Exception as e:
    print("Error:", e)
