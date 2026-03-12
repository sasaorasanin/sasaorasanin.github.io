import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const cvUrl = process.env.CV_URL ?? 'http://127.0.0.1:4321/';
const outputPath = process.env.CV_PDF_OUTPUT ?? path.join('public', 'cv', 'Sasa-Orasanin-CV.pdf');

const run = async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(cvUrl, { waitUntil: 'networkidle' });

  // Always export a fully expanded document for PDF output.
  await page.evaluate(() => {
    document.querySelectorAll('details').forEach((element) => {
      element.open = true;
    });
  });

  await page.waitForTimeout(80);
  await page.emulateMedia({ media: 'print' });

  await mkdir(path.dirname(outputPath), { recursive: true });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      right: '12mm',
      bottom: '12mm',
      left: '12mm'
    }
  });

  await browser.close();
  process.stdout.write(`PDF generated at ${outputPath}\n`);
};

run().catch((error) => {
  process.stderr.write(`Failed to generate PDF: ${error.message}\n`);
  process.exit(1);
});
