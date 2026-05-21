Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\public\images\favicon-final.png")
$bitmap = New-Object System.Drawing.Bitmap 64, 64
$graph = [System.Drawing.Graphics]::FromImage($bitmap)
$graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graph.DrawImage($img, 0, 0, 64, 64)
$bitmap.Save("c:\Users\lucia\OneDrive\Desktop\SweetMaidsB\src\app\favicon.ico", [System.Drawing.Imaging.ImageFormat]::Icon)
$bitmap.Dispose()
$graph.Dispose()
$img.Dispose()
