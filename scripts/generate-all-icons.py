import os
from PIL import Image

def generate_icons():
    # 1. Master icon at 1024x1024
    master_path = os.path.join(os.path.dirname(__file__), '../public/icons/icon-1024x1024.png')
    if not os.path.exists(master_path):
        master_path = os.path.join(os.path.dirname(__file__), '../public/icons/icon-512x512.png')

    master = Image.open(master_path).convert('RGB')
    print(f"Using master icon from {master_path} ({master.size})")

    icons_dir = os.path.join(os.path.dirname(__file__), '../public/icons')
    os.makedirs(icons_dir, exist_ok=True)

    sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512]
    for s in sizes:
        resized = master.resize((s, s), Image.Resampling.LANCZOS)
        out_path = os.path.join(icons_dir, f'icon-{s}x{s}.png')
        resized.save(out_path, 'PNG', optimize=True)
        print(f"Generated {out_path} ({os.path.getsize(out_path)} bytes)")

    # Apple Touch Icons
    public_dir = os.path.join(os.path.dirname(__file__), '../public')
    apple_180 = master.resize((180, 180), Image.Resampling.LANCZOS)
    apple_180.save(os.path.join(public_dir, 'apple-touch-icon.png'), 'PNG', optimize=True)
    apple_180.save(os.path.join(public_dir, 'apple-touch-icon-precomposed.png'), 'PNG', optimize=True)

    # Favicon PNG
    fav_64 = master.resize((64, 64), Image.Resampling.LANCZOS)
    fav_64.save(os.path.join(public_dir, 'favicon.png'), 'PNG', optimize=True)

    # Favicon ICO
    fav_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    fav_images = [master.resize(sz, Image.Resampling.LANCZOS) for sz in fav_sizes]
    fav_images[0].save(
        os.path.join(public_dir, 'favicon.ico'),
        format='ICO',
        sizes=fav_sizes,
        append_images=fav_images[1:]
    )
    print("All app icons and favicons generated successfully!")

if __name__ == '__main__':
    generate_icons()
