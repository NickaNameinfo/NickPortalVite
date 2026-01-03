# Printer Settings for Barcode Labels

## Label Specifications
- **Label Size**: 35mm × 25mm
- **Layout**: 3 columns × 7 rows per page (21 labels per A4 sheet)
- **Horizontal pitch**: 37-38mm (gap: 2-3mm)
- **Vertical pitch**: 27-28mm (gap: 2-3mm)
- **Top margin**: 10mm
- **Left margin**: 8-10mm
- **Border radius**: 2mm (rounded corners)

## Recommended Printer Settings

### 1. Paper Settings
- **Paper Size**: A4 (210mm × 297mm)
- **Paper Type**: 
  - Standard paper (80-100gsm) for regular printing
  - Label paper (adhesive labels) if using label sheets
  - Cardstock (120-160gsm) for durable labels
- **Orientation**: Portrait (vertical)

### 2. Print Quality Settings
- **Quality**: High/Normal (300 DPI minimum recommended)
- **Color Mode**: Black & White or Grayscale (for barcode clarity)
- **Print Mode**: Normal or High Quality

### 3. Margins & Scaling
- **Margins**: 
  - Top: 10mm (0.4 inches)
  - Bottom: 0mm (handled by label layout)
  - Left: 8-10mm (0.3-0.4 inches)
  - Right: 0mm (handled by label layout)
- **Scaling**: 
  - **Do NOT scale** - Use "Actual Size" or "100%"
  - **Do NOT** use "Fit to Page" or "Shrink to Fit"
  - Ensure "Scale to Fit" is **disabled**

### 4. Advanced Settings

#### For Standard Printers (HP, Canon, Epson, etc.)
```
Paper Size: A4
Orientation: Portrait
Margins: Top: 10mm, Left: 9mm (others: 0mm)
Scale: 100% (Actual Size)
Quality: Normal/High
Color: Black & White or Grayscale
```

#### For Label Printers (Brother, Zebra, Dymo, etc.)
If using dedicated label printers:
- **Label Width**: 35mm
- **Label Height**: 25mm
- **Horizontal Pitch**: 37-38mm
- **Vertical Pitch**: 27-28mm
- **Gap**: 2-3mm (horizontal and vertical)
- **Print Mode**: Direct Thermal or Thermal Transfer (depending on printer)
- **Density**: Medium to High (for barcode clarity)

### 5. Browser Print Settings

When printing from the browser (Chrome, Firefox, Edge):

1. **Open Print Dialog**: `Ctrl+P` (Windows) or `Cmd+P` (Mac)

2. **Settings to Configure**:
   - **Destination**: Save as PDF or Select Printer
   - **Pages**: All
   - **Layout**: Portrait
   - **Paper Size**: A4
   - **Margins**: Custom (Top: 10mm, Left: 9mm, others: 0mm)
   - **Scale**: 100% (DO NOT change)
   - **Background Graphics**: Enabled (to show borders and styling)
   - **Headers and Footers**: Disabled (recommended)

3. **More Settings** (if available):
   - **Options**: 
     - ✅ Background graphics
     - ❌ Headers and footers
     - ❌ Page numbers
   - **Margins**: Minimum or Custom (5mm all sides)

### 6. Print Preview Checklist

Before printing, verify in print preview:
- ✅ Labels are arranged in 3 columns × 7 rows (21 labels per page)
- ✅ Each label is 35mm wide × 25mm tall
- ✅ 2-3mm gap between labels (horizontal and vertical)
- ✅ 10mm top margin and 9mm left margin
- ✅ Barcodes are clear and scannable (small but readable)
- ✅ Text is readable and not cut off
- ✅ Rounded corners are visible
- ✅ No labels are split across pages

### 7. Troubleshooting

#### Labels are too small/large
- **Problem**: Scaling is enabled
- **Solution**: Set scale to 100% (Actual Size) in print dialog

#### Labels are cut off
- **Problem**: Margins too small or printer has unprintable area
- **Solution**: 
  - Ensure top margin is 10mm and left margin is 9mm
  - Check printer's minimum margin requirements
  - Adjust CSS padding in code if needed (currently: padding-top: 10mm, padding-left: 9mm)

#### Labels not aligned properly
- **Problem**: Browser print settings or printer driver issues
- **Solution**:
  - Use "Print to PDF" first, then print the PDF
  - Update printer drivers
  - Try different browser (Chrome recommended)

#### Barcodes not scanning
- **Problem**: Print quality too low or scaling issues (labels are very small)
- **Solution**:
  - Increase print quality to High/300 DPI minimum
  - Ensure 100% scale (no scaling)
  - Use black & white mode
  - Check barcode dimensions in code (width: 1, height: 10 for small labels)
  - Ensure printer can handle fine detail at small sizes

### 8. Recommended Printers

#### For Standard Printing:
- **HP LaserJet** series (P1102, P1106, etc.)
- **Canon PIXMA** series
- **Epson EcoTank** series
- **Brother HL** series

#### For Label Printing:
- **Brother QL** series (QL-700, QL-800)
- **Zebra** label printers (GK420d, ZD420)
- **Dymo** LabelWriter series
- **Rollo** thermal printers

### 9. Label Sheet Recommendations

If using pre-cut label sheets:
- **Sheet Size**: A4
- **Label Size**: 35mm × 25mm (exact match required)
- **Labels per Sheet**: 3 columns × 7 rows = 21 labels per page
- **Horizontal Pitch**: 37-38mm
- **Vertical Pitch**: 27-28mm
- **Gap**: 2-3mm between labels
- **Material**: 
  - White paper labels (standard)
  - Weatherproof labels (for outdoor use)
  - Clear labels (for transparent effect)

### 10. Code Configuration

The current code is configured for:
```css
.label-container {
  width: 35mm;
  height: 25mm;
  border-radius: 2mm;
  padding: 2px;
}

.labels-wrapper {
  gap: 2.5mm;
  row-gap: 2.5mm;
  padding-top: 10mm;
  padding-left: 9mm;
}
```

**Do not modify these values** unless you adjust your printer settings accordingly.

---

## Quick Reference Card

| Setting | Value |
|---------|-------|
| Paper Size | A4 |
| Orientation | Portrait |
| Scale | 100% (Actual Size) |
| Top Margin | 10mm (0.4") |
| Left Margin | 9mm (0.35") |
| Quality | High/Normal (300 DPI) |
| Color | Black & White |
| Background Graphics | Enabled |
| Headers/Footers | Disabled |
| Label Width | 35mm |
| Label Height | 25mm |
| Columns | 3 per row |
| Rows | 7 per page |
| Horizontal Gap | 2.5mm |
| Vertical Gap | 2.5mm |
| Labels per Page | 21 |

---

**Note**: Always do a test print first on regular paper before using label sheets to verify alignment and sizing.
