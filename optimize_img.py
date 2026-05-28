from PIL import Image

path = "assets/img/projetos/estudascomigocapa.png"
out_path = "assets/img/projetos/estudascomigocapa.webp"

try:
    print("Starting conversion...")
    img = Image.open(path)
    
    # Just convert to WEBP without resizing, keeping high quality
    img.save(out_path, format="WEBP", quality=95)
    print("Success: Compressed to WebP")
except Exception as e:
    print("Error:", e)
