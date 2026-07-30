import { getDocument } from 'pdfjs-dist'
// Prefer monorepo shared helper when built via root; fall back for standalone print app
import { setupPdfWorker } from '../../../../../src/utils/setupPdfWorker'

setupPdfWorker()

export { getDocument }
