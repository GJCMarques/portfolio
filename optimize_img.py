from PIL import Image
import os
import time

path = "assets/img/projetos/cristalterminalcapa.png"
out_path = "assets/img/projetos/cristalterminalcapa.webp"

try:
    print("Starting conversion...")
    start_time = time.time()
    img = Image.open(path)
    
    # Check size
    print(f"Original size: {img.size}")
    
    # If image is insanely large, resize it to max 2560px width to keep it very high quality but sane
    max_width = 2560
    if img.size[0] > max_width:
        ratio = max_width / img.size[0]
        new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
        img = img.resize(new_size, Image.LANCZOS)
        print(f"Resized to {new_size} for sanity")
        
    img.save(out_path, format="WEBP", quality=90, method=0)
    print(f"Success: Compressed to WebP in {time.time() - start_time:.2f} seconds")
except Exception as e:
    print("Error:", e)
