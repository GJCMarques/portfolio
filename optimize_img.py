from PIL import Image

path = "assets/img/projetos/tecncoolcapa.png"
out_path = "assets/img/projetos/tecncoolcapa.webp"

try:
    print("Starting conversion...")
    img = Image.open(path)
    
    # Convert to WEBP without resizing, keeping high quality
    img.save(out_path, format="WEBP", quality=95)
    print("Success: Compressed to WebP")
except Exception as e:
    print("Error:", e)
