# WHT job photographs

Real photographs of WHT work, supplied by the client. The originals live in
`Desktop\BigonDigital\WHT Electrical\Image\WHT`; the files here are the
web-ready versions.

## How they were prepared

`build/process-photos.ps1` (`Convert-Photo`) does all of it in one pass, with no
external tools:

1. EXIF orientation honoured.
2. Centre-cropped to the aspect of the slot the photo fills (16:9 for the hero,
   3:2 for every card).
3. Resized with high-quality bicubic to the slot's real display width.
4. Auto-levels from the luminance histogram, clipping 0.3% at each end — this is
   the lighting correction; several of these were shot indoors and sat flat.
5. Contrast 1.10 and saturation 1.08 around luminance, then a mild 3x3 unsharp.
6. JPEG at quality 72-78.

The edits are deliberately gentle. Re-running the script on an already-processed
file would stack the contrast and sharpening, so always start from the original.

## Where each one is used

| File | Used on |
| --- | --- |
| `hero-solar-roof.jpg` | Homepage hero (preloaded) |
| `electrical-technician.jpg` | Homepage, Electrical service card |
| `solar-inverter-battery.jpg` | Homepage, Solar & Backup Power card |
| `plumbing-tanks.jpg` | Homepage, Plumbing card |
| `maintenance-ceiling.jpg` | Homepage, Property Maintenance card |
| `fault-finding-meter.jpg` | Homepage, Recent Work — Recurring Electrical Trips |
| `project-backup-power.jpg` | Homepage, Recent Work — Backup Power Installation |
| `project-gate-motor.jpg` | Homepage, Recent Work — Gate Motor Replacement |
| `electrical-db-board.jpg` | Electrical pillar page |
| `project-commercial-solar.jpg` | Solar & Backup Power pillar page |

The table in `build/pages.mjs` (`PHOTO`) holds the filename, real pixel size and
alt text for each. Change a photo there, not in the page markup.

## Still outstanding

The About page keeps two placeholder slots: a photograph of Wayne, and an early
WHT photo. Neither exists in the supplied set.
