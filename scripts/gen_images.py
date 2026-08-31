"""
Generates realistic-looking procedural placeholder imagery for CHOISISTABORNE.
Uses simulated studio/outdoor lighting, gradients, soft shadows, wall textures
and depth-of-field blur to approximate real product/installation photography.
These remain stand-ins — swap files in /public/images with real shots when
available, same filenames.
"""
import os
import math
import random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

random.seed(7)
np.random.seed(7)

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "images")

# ---- palette -----------------------------------------------------------
SKY_TOP = (156, 196, 232)
SKY_BOTTOM = (224, 235, 240)
SKY_TOP_EVE = (74, 96, 138)
SKY_BOTTOM_EVE = (214, 178, 140)
GROUND = (167, 170, 162)
GROUND_DARK = (108, 111, 106)
WALL_STUDIO = (214, 214, 210)

BODY_WHITE = (241, 241, 238)
BODY_ANTHRACITE = (58, 60, 64)
BODY_BLACK = (30, 31, 34)
ACCENT_BLUE = (46, 120, 235)
ACCENT_GREEN = (57, 176, 110)
ACCENT_AMBER = (230, 158, 45)

BODY_CYCLE = [BODY_WHITE, BODY_ANTHRACITE, BODY_WHITE, BODY_BLACK, BODY_WHITE, BODY_ANTHRACITE]
ACCENT_CYCLE = [ACCENT_BLUE, ACCENT_GREEN, ACCENT_AMBER]


# ---- low-level helpers ---------------------------------------------------

def vgrad(size, top, bottom, gamma=1.0):
    w, h = size
    t = np.linspace(0, 1, h) ** gamma
    t = t.reshape(h, 1, 1)
    top_a = np.array(top, dtype=np.float32).reshape(1, 1, 3)
    bot_a = np.array(bottom, dtype=np.float32).reshape(1, 1, 3)
    row = top_a + (bot_a - top_a) * t
    arr = np.repeat(row, w, axis=1).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


def noise_layer(size, scale=4, strength=10):
    w, h = size
    small = (max(1, w // scale), max(1, h // scale))
    n = np.random.normal(128, strength, (small[1], small[0])).clip(0, 255).astype(np.uint8)
    img = Image.fromarray(n, "L").resize(size, Image.BICUBIC)
    return img


def apply_texture(img, strength=6, scale=3):
    n = noise_layer(img.size, scale=scale, strength=strength).convert("RGB")
    return ImageChops.overlay(img, Image.blend(img, n, 0.5))


def vignette(img, strength=0.35):
    w, h = img.size
    yy, xx = np.mgrid[0:h, 0:w]
    cx, cy = w / 2, h / 2
    dist = np.sqrt(((xx - cx) / (w / 2)) ** 2 + ((yy - cy) / (h / 2)) ** 2)
    mask = np.clip(1 - (dist - 0.55) * strength, 0, 1)
    arr = np.array(img).astype(np.float32)
    arr *= mask[..., None]
    return Image.fromarray(arr.clip(0, 255).astype(np.uint8), "RGB")


def soft_shadow(base, mask_img, blur=24, offset=(0, 14), opacity=110, color=(10, 10, 12)):
    """mask_img: L image, white = shape. Draws a blurred shadow onto base (RGBA)."""
    w, h = base.size
    shadow = Image.new("L", (w, h), 0)
    shadow.paste(mask_img, offset)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    shadow_rgba = Image.new("RGBA", (w, h), color + (0,))
    alpha = shadow.point(lambda p: int(p * opacity / 255))
    shadow_rgba.putalpha(alpha)
    base.alpha_composite(shadow_rgba)


def rounded_mask(size, box, radius):
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle(box, radius=radius, fill=255)
    return m


def diagonal_sheen(size, box, radius, width_ratio=0.22, opacity=70):
    """A soft light streak across a rounded rect, like a glossy reflection."""
    w, h = size
    layer = Image.new("L", size, 0)
    d = ImageDraw.Draw(layer)
    x0, y0, x1, y1 = box
    bw = x1 - x0
    band_w = bw * width_ratio
    cx = x0 + bw * 0.32
    pts = [(cx - band_w, y0 - 20), (cx, y0 - 20), (cx + band_w * 0.4, y1 + 20), (cx - band_w * 0.6, y1 + 20)]
    d.polygon(pts, fill=opacity)
    mask = rounded_mask(size, box, radius)
    layer = ImageChops.multiply(layer, mask)
    return layer.filter(ImageFilter.GaussianBlur(bw * 0.06))


# ---- backdrops -----------------------------------------------------------

def studio_backdrop(size, tone="light"):
    w, h = size
    if tone == "light":
        img = vgrad(size, (247, 246, 242), WALL_STUDIO, gamma=1.4)
    else:
        img = vgrad(size, (46, 48, 52), (20, 21, 24), gamma=1.2)
    floor_y = int(h * 0.74)
    floor = Image.new("RGBA", size, (0, 0, 0, 0))
    fd = ImageDraw.Draw(floor)
    floor_color = (225, 224, 219, 255) if tone == "light" else (30, 31, 34, 255)
    fd.rectangle([0, floor_y, w, h], fill=floor_color)
    img = img.convert("RGBA")
    img.alpha_composite(floor)
    img = img.convert("RGB")
    img = apply_texture(img, strength=4, scale=6)
    img = vignette(img, strength=0.22)
    return img


def outdoor_backdrop(size, time="day"):
    w, h = size
    horizon = int(h * 0.5)
    if time == "day":
        sky = vgrad((w, horizon + 40), SKY_TOP, SKY_BOTTOM, gamma=1.6)
        ground = vgrad((w, h - horizon), GROUND, GROUND_DARK, gamma=0.8)
        glow_col = (255, 250, 235)
        glow_strength = 0.5
    else:
        sky = vgrad((w, horizon + 40), SKY_TOP_EVE, SKY_BOTTOM_EVE, gamma=1.3)
        ground = vgrad((w, h - horizon), (58, 58, 56), (30, 30, 30), gamma=0.8)
        glow_col = (255, 200, 140)
        glow_strength = 0.6
    img = Image.new("RGB", size)
    img.paste(sky, (0, 0))
    img.paste(ground, (0, horizon))
    yy, xx = np.mgrid[0:h, 0:w]
    glow_pos = (w * 0.78, horizon * 0.55)
    dist = np.sqrt((xx - glow_pos[0]) ** 2 + (yy - glow_pos[1]) ** 2) / (w * 0.5)
    a = (np.clip(1 - dist, 0, 1) ** 2.2 * glow_strength * 255).astype(np.uint8)
    overlay_rgb = np.zeros((h, w, 3), dtype=np.uint8)
    overlay_rgb[..., 0] = glow_col[0]
    overlay_rgb[..., 1] = glow_col[1]
    overlay_rgb[..., 2] = glow_col[2]
    overlay_img = Image.fromarray(overlay_rgb, "RGB")
    mask_img = Image.fromarray(a, "L")
    img = Image.composite(overlay_img, img, mask_img.point(lambda p: p // 3))
    img = apply_texture(img, strength=3, scale=5)
    img = vignette(img, strength=0.28)
    return img, horizon


# ---- scene elements --------------------------------------------------

def draw_house_facade(canvas, x, y, w, h, base_color=(224, 219, 206)):
    d = ImageDraw.Draw(canvas, "RGBA")
    wall_grad = vgrad((int(w), int(h * 0.72)), tuple(min(255, c + 14) for c in base_color), tuple(max(0, c - 18) for c in base_color), gamma=1.0)
    canvas.paste(wall_grad, (int(x), int(y + h * 0.28)))
    roof = [(x - w * 0.04, y + h * 0.3), (x + w * 0.5, y), (x + w * 1.04, y + h * 0.3)]
    d = ImageDraw.Draw(canvas, "RGBA")
    d.polygon(roof, fill=(64, 46, 40))
    win_w, win_h = w * 0.22, h * 0.24
    wx, wy = x + w * 0.14, y + h * 0.42
    d.rectangle([wx, wy, wx + win_w, wy + win_h], fill=(150, 178, 196))
    d.rectangle([wx, wy, wx + win_w, wy + win_h], outline=(250, 249, 246), width=max(2, int(w * 0.006)))
    d.line([wx + win_w / 2, wy, wx + win_w / 2, wy + win_h], fill=(250, 249, 246), width=max(2, int(w * 0.005)))
    dw, dh = w * 0.14, h * 0.34
    dx, dy = x + w * 0.68, y + h * 0.66
    d.rectangle([dx, dy, dx + dw, dy + dh], fill=(70, 56, 48))
    d.ellipse([dx + dw * 0.78, dy + dh * 0.5, dx + dw * 0.85, dy + dh * 0.55], fill=(200, 190, 170))
    return canvas


def draw_car(canvas, x, y, w, h, color=(60, 66, 78)):
    shadow_mask = Image.new("L", canvas.size, 0)
    sd = ImageDraw.Draw(shadow_mask)
    sd.ellipse([x + w * 0.05, y + h * 0.78, x + w * 0.95, y + h * 1.05], fill=255)
    soft_shadow(canvas, shadow_mask, blur=w * 0.03, offset=(0, 0), opacity=120)
    body = [
        (x, y + h * 0.62), (x + w * 0.06, y + h * 0.42), (x + w * 0.24, y + h * 0.24),
        (x + w * 0.62, y + h * 0.2), (x + w * 0.84, y + h * 0.42), (x + w, y + h * 0.5),
        (x + w, y + h * 0.76), (x, y + h * 0.76),
    ]
    lighter = tuple(min(255, c + 30) for c in color)
    darker = tuple(max(0, c - 25) for c in color)
    body_grad = vgrad((int(w), int(h)), lighter, darker, gamma=1.0)
    mask = Image.new("L", (int(w), int(h)), 0)
    md = ImageDraw.Draw(mask)
    local_body = [(px - x, py - y) for px, py in body]
    md.polygon(local_body, fill=255)
    canvas.paste(body_grad, (int(x), int(y)), mask)
    d = ImageDraw.Draw(canvas, "RGBA")
    win = [(x + w * 0.28, y + h * 0.26), (x + w * 0.58, y + h * 0.22), (x + w * 0.78, y + h * 0.42), (x + w * 0.3, y + h * 0.42)]
    d.polygon(win, fill=(150, 178, 198, 235))
    wr = h * 0.15
    for wx in (x + w * 0.2, x + w * 0.78):
        d.ellipse([wx - wr, y + h * 0.76 - wr, wx + wr, y + h * 0.76 + wr], fill=(20, 20, 22))
        d.ellipse([wx - wr * 0.45, y + h * 0.76 - wr * 0.45, wx + wr * 0.45, y + h * 0.76 + wr * 0.45], fill=(150, 152, 156))
    d.line([(x + w * 0.1, y + h * 0.42), (x + w * 0.85, y + h * 0.4)], fill=(255, 255, 255, 60), width=2)
    return canvas


def draw_wallbox(canvas, cx, cy, s, body_color=BODY_WHITE, accent=ACCENT_BLUE, style="main", cable=True):
    body_w, body_h = s * 0.42, s
    left = cx - body_w / 2
    top = cy - body_h / 2
    radius = s * 0.07
    box = [left, top, left + body_w, top + body_h]

    mask = rounded_mask(canvas.size, box, radius)
    soft_shadow(canvas, mask, blur=s * 0.05, offset=(int(s * 0.02), int(s * 0.045)), opacity=130)

    lighter = tuple(min(255, c + 24) for c in body_color)
    darker = tuple(max(0, c - 30) for c in body_color)
    grad = vgrad((int(body_w), int(body_h)), lighter, darker, gamma=1.3)
    body_mask = rounded_mask((int(body_w), int(body_h)), [0, 0, body_w, body_h], radius)
    canvas.paste(grad, (int(left), int(top)), body_mask)

    d = ImageDraw.Draw(canvas, "RGBA")
    d.rounded_rectangle(box, radius=radius, outline=tuple(min(255, c + 45) for c in body_color) + (160,), width=max(1, int(s * 0.004)))
    sheen = diagonal_sheen(canvas.size, box, radius, opacity=55)
    white_layer = Image.new("RGBA", canvas.size, (255, 255, 255, 0))
    white_layer.putalpha(sheen)
    canvas.alpha_composite(white_layer)
    d = ImageDraw.Draw(canvas, "RGBA")

    sw, sh = body_w * 0.62, body_h * 0.2
    sx, sy = cx - sw / 2, top + body_h * 0.14
    d.rounded_rectangle([sx, sy, sx + sw, sy + sh], radius=radius * 0.5, fill=(16, 18, 22, 255))
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle([sx + sw * 0.06, sy + sh * 0.22, sx + sw * 0.5, sy + sh * 0.42], radius=4, fill=accent + (255,))
    gd.rounded_rectangle([sx + sw * 0.06, sy + sh * 0.55, sx + sw * 0.7, sy + sh * 0.72], radius=4, fill=(210, 212, 216, 255))
    canvas.alpha_composite(glow)
    d = ImageDraw.Draw(canvas, "RGBA")
    d.polygon([(sx + sw * 0.05, sy), (sx + sw * 0.35, sy), (sx + sw * 0.15, sy + sh), (sx, sy + sh)], fill=(255, 255, 255, 30))

    led_y = sy + sh + body_h * 0.06
    d.rounded_rectangle([cx - body_w * 0.06, led_y, cx + body_w * 0.06, led_y + body_h * 0.02], radius=6, fill=accent + (255,))
    led_glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    gd2 = ImageDraw.Draw(led_glow)
    gd2.ellipse([cx - body_w * 0.14, led_y - body_h * 0.02, cx + body_w * 0.14, led_y + body_h * 0.06], fill=accent + (90,))
    led_glow = led_glow.filter(ImageFilter.GaussianBlur(s * 0.01))
    canvas.alpha_composite(led_glow)
    d = ImageDraw.Draw(canvas, "RGBA")

    port_y = top + body_h * 0.62
    pr = body_w * 0.14
    d.ellipse([cx - pr, port_y, cx + pr, port_y + pr * 2], fill=(24, 25, 28, 255))
    d.ellipse([cx - pr * 0.7, port_y + pr * 0.3, cx + pr * 0.7, port_y + pr * 1.7], outline=(150, 152, 158, 255), width=max(1, int(s * 0.004)))

    if cable and style != "closeup":
        cable_top = (cx + pr * 0.6, port_y + pr)
        pts = []
        n = 28
        end_x = cx + s * 0.62
        end_y = top + body_h * 1.05
        for i in range(n + 1):
            t = i / n
            x = cable_top[0] + (end_x - cable_top[0]) * t + math.sin(t * math.pi * 1.6) * s * 0.05
            y = cable_top[1] + (end_y - cable_top[1]) * (t ** 0.9)
            pts.append((x, y))
        cw = max(2, int(s * 0.02))
        d.line(pts, fill=(30, 31, 34, 255), width=cw, joint="curve")
        d.line(pts, fill=(70, 72, 78, 140), width=max(1, cw // 3), joint="curve")
        hx, hy = pts[-1]
        d.rounded_rectangle([hx - s * 0.045, hy - s * 0.03, hx + s * 0.045, hy + s * 0.09], radius=s * 0.02, fill=(35, 36, 40, 255))
        d.ellipse([hx - s * 0.03, hy + s * 0.02, hx + s * 0.03, hy + s * 0.08], fill=(60, 62, 68, 255))

    return canvas, box


# ---- io --------------------------------------------------------------

def save(img, name, quality=87):
    path = os.path.join(ROOT, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.convert("RGB").save(path, "WEBP", quality=quality, method=4)
    print("wrote", path)


def dof_blur(canvas, focal_ellipse, blur=8, feather=60):
    w, h = canvas.size
    blurred = canvas.filter(ImageFilter.GaussianBlur(blur))
    focal = Image.new("L", (w, h), 0)
    fd = ImageDraw.Draw(focal)
    fd.ellipse(focal_ellipse, fill=255)
    focal = focal.filter(ImageFilter.GaussianBlur(feather))
    return Image.composite(canvas, blurred, focal)


# ---- composed scenes ---------------------------------------------------

def make_hero():
    w, h = 1800, 1125
    bg, horizon = outdoor_backdrop((w, h), time="day")
    canvas = bg.convert("RGBA")
    canvas = draw_house_facade(canvas, w * 0.03, h * 0.08, w * 0.42, h * 0.62, base_color=(226, 219, 202))
    canvas = draw_car(canvas, w * 0.32, h * 0.5, w * 0.34, h * 0.26, color=(52, 58, 70))
    canvas, _ = draw_wallbox(canvas, w * 0.335, h * 0.38, h * 0.34, body_color=BODY_WHITE, accent=ACCENT_BLUE, style="main")
    canvas = canvas.convert("RGB").filter(ImageFilter.GaussianBlur(0.4))
    save(canvas, "hero/hero-main.webp")


def make_hero_closeup():
    w, h = 1400, 1700
    bg = studio_backdrop((w, h), tone="dark")
    canvas = bg.convert("RGBA")
    canvas, _ = draw_wallbox(canvas, w * 0.5, h * 0.48, h * 0.62, body_color=BODY_WHITE, accent=ACCENT_BLUE, style="main")
    save(canvas.convert("RGB"), "hero/hero-closeup.webp")


def make_zoom_sequence():
    steps = [("zoom-1", 0.5, ACCENT_BLUE, BODY_WHITE), ("zoom-2", 0.68, ACCENT_BLUE, BODY_ANTHRACITE),
             ("zoom-3", 0.9, ACCENT_AMBER, BODY_WHITE), ("zoom-4", 1.15, ACCENT_AMBER, BODY_BLACK)]
    for name, scale, accent, body in steps:
        w, h = 1400, 1700
        tone = "dark" if body in (BODY_BLACK, BODY_ANTHRACITE) else "light"
        bg = studio_backdrop((w, h), tone=tone)
        canvas = bg.convert("RGBA")
        canvas, _ = draw_wallbox(canvas, w * 0.5, h * 0.5, h * 0.6 * scale, body_color=body, accent=accent, style="main")
        save(canvas.convert("RGB"), f"hero/{name}.webp")


def make_pinned_steps():
    combos = [(BODY_WHITE, ACCENT_BLUE), (BODY_WHITE, ACCENT_BLUE), (BODY_ANTHRACITE, ACCENT_GREEN),
              (BODY_WHITE, ACCENT_AMBER), (BODY_BLACK, ACCENT_AMBER)]
    for i, (body, accent) in enumerate(combos, start=1):
        w, h = 1200, 1400
        tone = "dark" if body in (BODY_BLACK, BODY_ANTHRACITE) else "light"
        bg = studio_backdrop((w, h), tone=tone)
        canvas = bg.convert("RGBA")
        canvas, _ = draw_wallbox(canvas, w * 0.5, h * 0.52, h * 0.56, body_color=body, accent=accent, style="main")
        save(canvas.convert("RGB"), f"gallery/pinned-{i}.webp")


def make_detail_gallery():
    specs = [
        ("detail-screen", ACCENT_BLUE, "screen"),
        ("detail-connector", ACCENT_AMBER, "connector"),
        ("detail-led", ACCENT_GREEN, "led"),
        ("detail-texture", (170, 172, 176), "texture"),
        ("detail-install", ACCENT_AMBER, "install"),
    ]
    for name, accent, kind in specs:
        w, h = 1200, 1500
        if kind == "install":
            bg, _ = outdoor_backdrop((w, h), time="day")
            canvas = bg.convert("RGBA")
            canvas = draw_house_facade(canvas, w * -0.1, h * 0.05, w * 0.9, h * 0.7, base_color=(214, 208, 194))
            canvas, _ = draw_wallbox(canvas, w * 0.66, h * 0.48, h * 0.34, body_color=BODY_WHITE, accent=accent, style="installation")
            canvas = canvas.convert("RGB")
        else:
            bg = studio_backdrop((w, h), tone="light")
            canvas = bg.convert("RGBA")
            canvas, _ = draw_wallbox(canvas, w * 0.5, h * 0.55, h * 1.35, body_color=BODY_WHITE, accent=accent, style="closeup", cable=(kind == "connector"))
            if kind == "screen":
                ellipse = [w * 0.15, h * 0.15, w * 0.85, h * 0.55]
            elif kind == "connector":
                ellipse = [w * 0.2, h * 0.45, w * 0.8, h * 0.85]
            elif kind == "led":
                ellipse = [w * 0.25, h * 0.35, w * 0.75, h * 0.6]
            else:
                ellipse = [w * 0.1, h * 0.1, w * 0.9, h * 0.9]
            canvas = dof_blur(canvas, ellipse, blur=9, feather=60)
            canvas = canvas.convert("RGB")
        save(canvas, f"gallery/{name}.webp")


def make_configurator():
    combos = [(BODY_WHITE, ACCENT_BLUE), (BODY_ANTHRACITE, ACCENT_AMBER), (BODY_BLACK, ACCENT_GREEN)]
    for i, (body, accent) in enumerate(combos, start=1):
        w, h = 1100, 1350
        tone = "dark" if body in (BODY_BLACK, BODY_ANTHRACITE) else "light"
        bg = studio_backdrop((w, h), tone=tone)
        canvas = bg.convert("RGBA")
        canvas, _ = draw_wallbox(canvas, w * 0.5, h * 0.52, h * 0.56, body_color=body, accent=accent, style="main")
        save(canvas.convert("RGB"), f"misc/configurator-{i}.webp")


PRODUCTS = [
    "wallbox-pulsar-max", "wallbox-copper-sb", "zaptec-go-2", "easee-one",
    "myenergi-zappi", "webasto-pure-2", "schneider-evlink", "hager-witty",
    "legrand-green-up", "delta-ac-mini", "abb-terra-ac", "circontrol-wallbox",
    "keba-p30", "chargepoint-home-flex", "juicebox-40",
]


def make_products():
    for idx, slug in enumerate(PRODUCTS):
        body = BODY_CYCLE[idx % len(BODY_CYCLE)]
        accent = ACCENT_CYCLE[idx % len(ACCENT_CYCLE)]
        tone = "dark" if body in (BODY_BLACK, BODY_ANTHRACITE) else "light"

        w, h = 1000, 1250
        bg = studio_backdrop((w, h), tone=tone)
        canvas = bg.convert("RGBA")
        canvas, _ = draw_wallbox(canvas, w * 0.5, h * 0.5, h * 0.62, body_color=body, accent=accent, style="main")
        save(canvas.convert("RGB"), f"products/{slug}-main.webp")

        w, h = 1000, 1250
        bg = studio_backdrop((w, h), tone=tone)
        canvas = bg.convert("RGBA")
        canvas, _ = draw_wallbox(canvas, w * 0.5, h * 0.5, h * 0.95, body_color=body, accent=accent, style="closeup", cable=False)
        canvas = dof_blur(canvas, [w * 0.15, h * 0.1, w * 0.85, h * 0.6], blur=7, feather=70)
        save(canvas.convert("RGB"), f"products/{slug}-detail.webp")

        w, h = 1000, 1250
        bg, _ = outdoor_backdrop((w, h), time="day")
        canvas = bg.convert("RGBA")
        canvas = draw_house_facade(canvas, w * -0.15, h * 0.02, w * 1.0, h * 0.78, base_color=(218, 212, 197))
        canvas, _ = draw_wallbox(canvas, w * 0.68, h * 0.48, h * 0.36, body_color=body, accent=accent, style="installation")
        save(canvas.convert("RGB"), f"products/{slug}-installation.webp")

        w, h = 1000, 1000
        bg = studio_backdrop((w, h), tone=tone)
        canvas = bg.convert("RGBA")
        canvas, _ = draw_wallbox(canvas, w * 0.5, h * 0.5, h * 1.15, body_color=body, accent=accent, style="closeup", cable=True)
        canvas = dof_blur(canvas, [w * 0.2, h * 0.35, w * 0.8, h * 0.85], blur=8, feather=60)
        save(canvas.convert("RGB"), f"products/{slug}-closeup.webp")


def make_og():
    w, h = 1200, 630
    bg, _ = outdoor_backdrop((w, h), time="evening")
    canvas = bg.convert("RGBA")
    canvas = draw_house_facade(canvas, w * -0.05, h * -0.15, w * 0.5, h * 0.95, base_color=(210, 204, 190))
    canvas, _ = draw_wallbox(canvas, w * 0.72, h * 0.5, h * 0.62, body_color=BODY_WHITE, accent=ACCENT_BLUE, style="main")
    save(canvas.convert("RGB"), "misc/og-cover.webp")


if __name__ == "__main__":
    make_hero()
    make_hero_closeup()
    make_zoom_sequence()
    make_pinned_steps()
    make_detail_gallery()
    make_configurator()
    make_products()
    make_og()
    print("done")