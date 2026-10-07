# WHT job photos -> web. Crop to the slot's aspect, resize, auto-levels,
# gentle contrast + saturation, mild sharpen. No external tools.
Add-Type -AssemblyName System.Drawing

function Save-Jpeg($bmp, $path, $quality) {
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
    $p = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int]$quality)
    $bmp.Save($path, $enc, $p)
}

function Convert-Photo {
    param(
        $Src, $Dst, [int]$TargetW,
        [double]$Aspect = 1.5,            # width / height of the slot
        [string]$Gravity = 'center',      # which part of the frame to keep
        [int]$Quality = 78,
        [double]$Contrast = 1.10, [double]$Saturation = 1.08, [double]$Sharpen = 0.35
    )

    $img = [System.Drawing.Image]::FromFile($Src)
    try {
        if ($img.PropertyIdList -contains 274) {
            switch ($img.GetPropertyItem(274).Value[0]) {
                3 { $img.RotateFlip('Rotate180FlipNone') }
                6 { $img.RotateFlip('Rotate90FlipNone') }
                8 { $img.RotateFlip('Rotate270FlipNone') }
            }
        }
    } catch {}

    # ---- crop to the slot aspect ----
    $sw = $img.Width; $sh = $img.Height
    $cw = $sw; $ch = [int][math]::Round($sw / $Aspect)
    if ($ch -gt $sh) { $ch = $sh; $cw = [int][math]::Round($sh * $Aspect) }
    switch ($Gravity) {
        'top'    { $cx = [int](($sw - $cw) / 2); $cy = 0 }
        'bottom' { $cx = [int](($sw - $cw) / 2); $cy = $sh - $ch }
        'upper'  { $cx = [int](($sw - $cw) / 2); $cy = [int](($sh - $ch) * 0.25) }
        'lower'  { $cx = [int](($sw - $cw) / 2); $cy = [int](($sh - $ch) * 0.75) }
        default  { $cx = [int](($sw - $cw) / 2); $cy = [int](($sh - $ch) / 2) }
    }
    $srcRect = New-Object System.Drawing.Rectangle $cx, $cy, $cw, $ch

    # ---- resize ----
    $scale = $TargetW / $cw
    if ($scale -gt 1) { $scale = 1 }
    $w = [int][math]::Round($cw * $scale)
    $h = [int][math]::Round($ch * $scale)
    $rs = New-Object System.Drawing.Bitmap -ArgumentList $w, $h
    $g = [System.Drawing.Graphics]::FromImage($rs)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.PixelOffsetMode = 'HighQuality'
    $g.SmoothingMode = 'HighQuality'
    $dstRect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $g.DrawImage($img, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose(); $img.Dispose()

    # ---- pixels ----
    $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
    $data = $rs.LockBits($rect, 'ReadWrite', 'Format24bppRgb')
    $stride = $data.Stride
    $bytes = New-Object byte[] ($stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)

    # ---- auto levels from the luminance histogram ----
    $hist = New-Object int[] 256
    for ($y = 0; $y -lt $h; $y++) {
        $row = $y * $stride
        for ($x = 0; $x -lt $w; $x++) {
            $i = $row + $x * 3
            $l = [int](0.114 * $bytes[$i] + 0.587 * $bytes[$i+1] + 0.299 * $bytes[$i+2])
            $hist[$l]++
        }
    }
    $total = $w * $h
    $clip = [int]($total * 0.003)
    $lo = 0; $acc = 0
    for ($i = 0; $i -lt 256; $i++) { $acc += $hist[$i]; if ($acc -gt $clip) { $lo = $i; break } }
    $hi = 255; $acc = 0
    for ($i = 255; $i -ge 0; $i--) { $acc += $hist[$i]; if ($acc -gt $clip) { $hi = $i; break } }
    if ($hi - $lo -lt 32) { $lo = 0; $hi = 255 }

    $lut = New-Object byte[] 256
    $range = [double]($hi - $lo)
    for ($i = 0; $i -lt 256; $i++) {
        $v = ($i - $lo) / $range
        if ($v -lt 0) { $v = 0 }; if ($v -gt 1) { $v = 1 }
        $v = ($v - 0.5) * $Contrast + 0.5
        if ($v -lt 0) { $v = 0 }; if ($v -gt 1) { $v = 1 }
        $lut[$i] = [byte][math]::Round($v * 255)
    }

    for ($y = 0; $y -lt $h; $y++) {
        $row = $y * $stride
        for ($x = 0; $x -lt $w; $x++) {
            $i = $row + $x * 3
            $b = $lut[$bytes[$i]]; $g2 = $lut[$bytes[$i+1]]; $r = $lut[$bytes[$i+2]]
            $l = 0.114 * $b + 0.587 * $g2 + 0.299 * $r
            $bytes[$i]   = [byte][math]::Max(0, [math]::Min(255, [math]::Round($l + ($b - $l) * $Saturation)))
            $bytes[$i+1] = [byte][math]::Max(0, [math]::Min(255, [math]::Round($l + ($g2 - $l) * $Saturation)))
            $bytes[$i+2] = [byte][math]::Max(0, [math]::Min(255, [math]::Round($l + ($r - $l) * $Saturation)))
        }
    }

    if ($Sharpen -gt 0) {
        $copy = $bytes.Clone()
        for ($y = 1; $y -lt $h - 1; $y++) {
            $row = $y * $stride
            for ($x = 1; $x -lt $w - 1; $x++) {
                $i = $row + $x * 3
                for ($c = 0; $c -lt 3; $c++) {
                    $p = $i + $c
                    $blur = ($copy[$p - $stride - 3] + $copy[$p - $stride] + $copy[$p - $stride + 3] +
                             $copy[$p - 3]           + $copy[$p]           + $copy[$p + 3] +
                             $copy[$p + $stride - 3] + $copy[$p + $stride] + $copy[$p + $stride + 3]) / 9.0
                    $v = $copy[$p] + ($copy[$p] - $blur) * $Sharpen
                    if ($v -lt 0) { $v = 0 }; if ($v -gt 255) { $v = 255 }
                    $bytes[$p] = [byte][math]::Round($v)
                }
            }
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $data.Scan0, $bytes.Length)
    $rs.UnlockBits($data)
    Save-Jpeg $rs $Dst $Quality
    $rs.Dispose()
    [pscustomobject]@{
        File = (Split-Path $Dst -Leaf); Source = "${sw}x${sh}"; Out = "${w}x${h}"
        Levels = "$lo-$hi"; KB = [math]::Round((Get-Item $Dst).Length / 1KB, 1)
    }
}

# ---------------------------------------------------------------------------
# The actual run. Dot-source this file to get Convert-Photo on its own, or run
# it with -Run to rebuild every web photo from the client's originals:
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File build\process-photos.ps1 -Run
#
# Always start from the originals. Re-processing an output stacks the edits.
# ---------------------------------------------------------------------------
if ($args -contains '-Run') {
    $src = "$HOME\Desktop\BigonDigital\WHT Electrical\Image\WHT"
    $dst = "$PSScriptRoot\..\assets\photos"
    $jobs = @(
        @{ s = 'IMG-20260429-WA0039'; d = 'hero-solar-roof';          w = 1600; a = 1.7778; q = 72; sh = 0.12 }
        @{ s = 'IMG-20260429-WA0003'; d = 'electrical-technician';    w = 800;  a = 1.5;    q = 78; sh = 0.35 }
        @{ s = 'IMG-20260429-WA0037'; d = 'solar-inverter-battery';   w = 800;  a = 1.5;    q = 78; sh = 0.35 }
        @{ s = 'IMG-20260429-WA0033'; d = 'plumbing-tanks';           w = 800;  a = 1.5;    q = 74; sh = 0.35 }
        @{ s = 'IMG-20260429-WA0011'; d = 'maintenance-ceiling';      w = 800;  a = 1.5;    q = 78; sh = 0.35 }
        @{ s = 'IMG-20260429-WA0034'; d = 'project-commercial-solar'; w = 800;  a = 1.5;    q = 74; sh = 0.35 }
        @{ s = 'IMG-20260429-WA0022'; d = 'project-backup-power';     w = 800;  a = 1.5;    q = 78; sh = 0.35 }
        @{ s = 'IMG-20260429-WA0038'; d = 'project-gate-motor';       w = 800;  a = 1.5;    q = 74; sh = 0.35 }
        @{ s = 'IMG-20260429-WA0025'; d = 'fault-finding-meter';      w = 800;  a = 1.5;    q = 78; sh = 0.35 }
        @{ s = 'IMG-20260429-WA0014'; d = 'electrical-db-board';      w = 800;  a = 1.5;    q = 78; sh = 0.35 }
    )
    $res = foreach ($j in $jobs) {
        Convert-Photo -Src "$src\$($j.s).jpg" -Dst "$dst\$($j.d).jpg" `
            -TargetW $j.w -Aspect $j.a -Quality $j.q -Sharpen $j.sh
    }
    $res | Format-Table -AutoSize
    "TOTAL KB: $([math]::Round(($res | Measure-Object KB -Sum).Sum, 1))"
}
