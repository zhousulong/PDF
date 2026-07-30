export const settings = {
  settings: 'Print Settings',
  scale: 'Resolution (DPI Scale)',
  blur: 'Overall Blur',
  tonerDensity: 'Toner/Ink Density',
  densityUniformity: 'Density Inhomogeneity',
  continuousFade: 'Continuous Print Fade',
  edgeFringe: 'Edge Fringing (Color Blur)',
  halftone: 'Halftone Dot Strength',
  dotGain: 'Dot Gain (Ink Bleed)',
  banding: {
    label: 'Banding / Stripe Strength',
    direction: 'Banding Direction',
    horizontal: 'Horizontal',
    vertical: 'Vertical'
  },
  nozzleClog: 'Clogged Nozzle (White Lines)',
  inkOutColor: {
    label: 'Ink Depletion (Missing Color)',
    none: 'None (Normal)',
    cyan: 'Cyan Depleted (C)',
    magenta: 'Magenta Depleted (M)',
    yellow: 'Yellow Depleted (Y)'
  },
  laserStatus: {
    title: 'Fuser Unit (Laser Print)',
    fuserQuality: 'Fuser Quality (Low = fuzzy text)',
    fuserStreak: 'Fuser Roller Scratch'
  },
  ghosting: 'Fuser Ghosting (Residual Image)',
  needle: {
    title: 'Dot-Matrix Specific',
    dotMatrix: 'Dot-Matrix Pattern',
    ribbonFade: 'Ribbon Aging (Low contrast)'
  },
  paperType: {
    label: 'Paper Type',
    plain: 'Plain Paper',
    coated: 'Coated Paper',
    recycled: 'Recycled Paper',
    photo: 'Photo Paper'
  },
  paperTexture: 'Paper Texture Strength',
  colorspace: {
    label: 'Color Mode',
    colorful: 'Color Print',
    grayscale: 'Black & White'
  },
  colorShift: {
    title: 'Color Deviation',
    redGreen: 'Red (+) / Green (-)',
    blueYellow: 'Blue (+) / Yellow (-)'
  },
  registration: {
    title: 'CMYK Channel Misalignment',
    offsetX: 'Horizontal Shift (px)',
    offsetY: 'Vertical Shift (px)'
  },
  printerType: {
    laser: 'Laser Printer',
    laserDesc: 'Simulates fuser scratches, residual image, and halftone dots',
    inkjet: 'Inkjet Printer',
    inkjetDesc: 'Simulates ink bleeding, clogged nozzle lines, and color deviations',
    needle: 'Dot-Matrix Printer',
    needleDesc: 'Simulates retro 9-pin/24-pin matrix print and ribbon fading'
  },
  presets: {
    label: 'Quick Presets'
  },
  pdfSelectLabel: 'Select PDF File',
  pdfNoSelectMessage: 'No PDF file selected'
}
