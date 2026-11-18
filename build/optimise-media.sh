#!/usr/bin/env bash
# =========================================================
#  WHT ELECTRICAL — web versions of the photos and the hero video
#
#      bash build/optimise-media.sh
#
#  Needs ffmpeg built with libwebp, libvpx-vp9 and libx264 (the stock
#  Ubuntu and Homebrew builds have all three). Writes into assets/, so
#  commit what it produces; CI does not run it.
#
#  PHOTOS
#  The JPEGs in assets/photos stay: they are what the Elementor importer
#  pulls into the media library, and what og-image and old links point at.
#  Next to each one this writes:
#      <name>.webp       same pixel size as the JPEG
#      <name>-480.webp   480px wide, for phones (srcset)
#  The hero gets its own two:
#      hero-solar-roof.webp          1280px, the desktop poster
#      hero-solar-roof-mobile.webp   800px, for phones
#  The hero photo is a roof of solar panels: thousands of fine grid lines,
#  which is the worst case for any codec. A light blur before encoding is
#  what brings it down; on phones it sits under an 86% blue panel, so the
#  mobile version can take a much stronger one without anyone seeing it.
#
#  VIDEO
#  Encodes from build/media-src/wht-hero-master.mp4, never from the file
#  in assets/, so re-running this does not compress an already compressed
#  copy. Both outputs are 720p, silent (-an; the hero is muted anyway).
#      wht-hero.webm   VP9   — Chrome, Edge, Firefox      (budget 700 KiB)
#      wht-hero.mp4    H.264, faststart — Safari, fallback (budget 950 KiB)
#  Two-pass at a fixed average bitrate rather than CRF: the footage is
#  detailed enough that CRF 33 (VP9) came out at 2.5 MB, so a quality
#  setting cannot promise a size. 10 s at these rates lands under budget.
# =========================================================
set -euo pipefail

cd "$(dirname "$0")/.."
PHOTOS=assets/photos
VIDEO=assets/video
MASTER=build/media-src/wht-hero-master.mp4

command -v ffmpeg >/dev/null || { echo "ffmpeg is not installed" >&2; exit 1; }

kb() { echo $(( ($(stat -c%s "$1" 2>/dev/null || stat -f%z "$1") + 1023) / 1024 )); }

webp() { # src dst quality [filter]
    ffmpeg -v error -y -i "$1" ${4:+-vf "$4"} -c:v libwebp -quality "$3" \
        -compression_level 6 -preset photo "$2"
    printf '  %-36s %4s KiB\n' "$(basename "$2")" "$(kb "$2")"
}

echo "Photos"
for src in "$PHOTOS"/*.jpg; do
    name=$(basename "$src" .jpg)
    if [ "$name" = hero-solar-roof ]; then
        webp "$src" "$PHOTOS/$name.webp" 45 "gblur=sigma=0.8"
        webp "$src" "$PHOTOS/$name-mobile.webp" 35 "scale=800:-2,gblur=sigma=1.6"
    else
        webp "$src" "$PHOTOS/$name.webp" 75
        webp "$src" "$PHOTOS/$name-480.webp" 70 "scale=480:-2"
    fi
done

echo "Video"
if [ ! -f "$MASTER" ]; then
    echo "  $MASTER is missing; skipping the video" >&2
    exit 0
fi
LOG=$(mktemp -d)/pass
ffmpeg -v error -y -i "$MASTER" -an -vf "scale=-2:720" \
    -c:v libvpx-vp9 -b:v 520k -row-mt 1 -deadline good -cpu-used 2 \
    -pass 1 -passlogfile "$LOG" -f null /dev/null
ffmpeg -v error -y -i "$MASTER" -an -vf "scale=-2:720" \
    -c:v libvpx-vp9 -b:v 520k -row-mt 1 -deadline good -cpu-used 2 \
    -pass 2 -passlogfile "$LOG" "$VIDEO/wht-hero.webm"
printf '  %-36s %4s KiB\n' wht-hero.webm "$(kb "$VIDEO/wht-hero.webm")"
ffmpeg -v error -y -i "$MASTER" -an -vf "scale=-2:720" \
    -c:v libx264 -b:v 700k -preset slow -profile:v high -pix_fmt yuv420p \
    -pass 1 -passlogfile "$LOG" -f null /dev/null
ffmpeg -v error -y -i "$MASTER" -an -vf "scale=-2:720" \
    -c:v libx264 -b:v 700k -preset slow -profile:v high -pix_fmt yuv420p \
    -pass 2 -passlogfile "$LOG" -movflags +faststart "$VIDEO/wht-hero.mp4"
printf '  %-36s %4s KiB\n' wht-hero.mp4 "$(kb "$VIDEO/wht-hero.mp4")"
rm -rf "$(dirname "$LOG")"
