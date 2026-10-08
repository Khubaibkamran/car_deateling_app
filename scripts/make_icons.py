"""Builds the app icon set from the in-app logo (orange triangles sheet + white triangle).

Run from the frontend folder:  python scripts/make_icons.py
Needs Pillow.
"""
from PIL import Image, ImageDraw

BG = (16, 20, 24, 255)  # #101418
SHEET = "assets/images/splash/logo.png"

# Geometry copied from the Figma logo: the white triangle sits 48.83 design-px to the right of the
# orange pair, and one design px is 6.065 sheet px.
SCALE = 6.065
CROP_LEFT, CROP_TOP = 230, 237
WHITE_X = CROP_LEFT + 48.83 * SCALE
WHITE_Y = CROP_TOP
WHITE_W = 45.9444 * SCALE
WHITE_H = 39.9175 * SCALE


def build_logo() -> Image.Image:
    """The full logo on a transparent canvas, trimmed to its bounds."""
    sheet = Image.open(SHEET).convert("RGBA")

    # Draw the white triangle 4x larger, then shrink for smooth edges.
    ss = 4
    layer = Image.new("RGBA", (sheet.width * ss, sheet.height * ss), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    points = [
        (WHITE_X, WHITE_Y),
        (WHITE_X + WHITE_W, WHITE_Y),
        (WHITE_X + WHITE_W * (23.1026 / 45.9444), WHITE_Y + WHITE_H),
    ]
    draw.polygon([(x * ss, y * ss) for x, y in points], fill=(255, 255, 255, 255))
    white = layer.resize(sheet.size, Image.LANCZOS)

    logo = Image.alpha_composite(sheet, white)
    # Ignore near-transparent specks in the source sheet, which would otherwise stretch the bounds.
    solid = logo.getchannel("A").point(lambda a: 255 if a > 40 else 0)
    return logo.crop(solid.getbbox())


def place(logo: Image.Image, size: int, width: int, background=None) -> Image.Image:
    """Centre `logo` scaled to `width` px wide on a square canvas."""
    canvas = Image.new("RGBA", (size, size), background or (0, 0, 0, 0))
    scaled = logo.resize((width, round(logo.height * width / logo.width)), Image.LANCZOS)
    canvas.alpha_composite(scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2))
    return canvas


def silhouette(img: Image.Image) -> Image.Image:
    """White version of an image, keeping its transparency (for themed Android icons)."""
    out = Image.new("RGBA", img.size, (255, 255, 255, 0))
    out.putalpha(img.getchannel("A"))
    white = Image.new("RGBA", img.size, (255, 255, 255, 255))
    white.putalpha(img.getchannel("A"))
    return white


def main() -> None:
    logo = build_logo()
    print("logo size", logo.size)

    # iOS / store icon: full-bleed, the OS rounds the corners.
    place(logo, 1024, 600, BG).convert("RGB").save("assets/volvo-icon.png")

    # Android adaptive icon: only the middle ~66% is guaranteed visible, so keep the logo small.
    foreground = place(logo, 1024, 430)
    foreground.save("assets/android-icon-foreground.png")
    silhouette(foreground).save("assets/android-icon-monochrome.png")
    Image.new("RGBA", (1024, 1024), BG).save("assets/android-icon-background.png")

    # Splash screen mark (drawn on #101418 by the splash plugin).
    place(logo, 1024, 560).save("assets/splash-icon.png")

    # Browser tab icon.
    place(logo, 256, 190, BG).resize((48, 48), Image.LANCZOS).convert("RGB").save("assets/favicon.png")


if __name__ == "__main__":
    main()
