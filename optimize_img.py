from PIL import Image
import os

def optimize(path, out_path, target_kb=None):
    try:
        print(f"Starting conversion for {path}...")
        img = Image.open(path)
        
        # Determine initial quality
        quality = 100
        
        # Save initially
        img.save(out_path, format="WEBP", quality=quality)
        size_kb = os.path.getsize(out_path) / 1024
        print(f"Initial WebP size (Q={quality}): {size_kb:.2f} KB")
        
        if target_kb and size_kb > target_kb:
            while size_kb > target_kb and quality > 70:
                quality -= 5
                img.save(out_path, format="WEBP", quality=quality)
                size_kb = os.path.getsize(out_path) / 1024
            
            if size_kb > target_kb:
                print("Still too big, applying slight resize...")
                w, h = img.size
                img = img.resize((int(w*0.8), int(h*0.8)), Image.Resampling.LANCZOS)
                img.save(out_path, format="WEBP", quality=85)
                size_kb = os.path.getsize(out_path) / 1024
                
        print(f"Success: Compressed to WebP. Final size: {size_kb:.2f} KB\n")
    except Exception as e:
        print("Error:", e)

import re
import glob

def optimize_all():
    base_dir = "assets/img/projetos"
    # Find all numbered pngs in subdirectories
    search_pattern = os.path.join(base_dir, "**", "[0-9]*.png")
    png_files = glob.glob(search_pattern, recursive=True)
    
    for path in png_files:
        filename = os.path.basename(path)
        # Removed regex check to allow all pngs
            
        out_path = path.replace('.png', '.webp')
        target_kb = 800
        
        try:
            print(f"Converting {path}...")
            img = Image.open(path)
            quality = 95
            img.save(out_path, format="WEBP", quality=quality)
            size_kb = os.path.getsize(out_path) / 1024
            
            while size_kb > target_kb and quality > 60:
                quality -= 5
                img.save(out_path, format="WEBP", quality=quality)
                size_kb = os.path.getsize(out_path) / 1024
            
            if size_kb > target_kb:
                w, h = img.size
                img = img.resize((int(w*0.8), int(h*0.8)), Image.Resampling.LANCZOS)
                img.save(out_path, format="WEBP", quality=80)
                size_kb = os.path.getsize(out_path) / 1024
                
            print(f" -> Saved {out_path} ({size_kb:.2f} KB)")
            # Remove original png to save space
            os.remove(path)
        except Exception as e:
            print(f"Error on {path}: {e}")

optimize_all()
