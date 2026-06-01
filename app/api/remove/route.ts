import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
export const runtime = 'node';

const uploadsDir = path.join(process.cwd(), 'uploads');
const outputDir = path.join(process.cwd(), 'output');
const python = process.env.PYTHON || 'python';
const scriptPath = path.join(process.cwd(), 'scripts', 'remove_bg.py');

async function ensureDirectories() {
  await fs.mkdir(uploadsDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
}

export async function POST(request: Request) {
  await ensureDirectories();

  const formData = await request.formData();
  const image = formData.get('image');

  if (!image || !(image instanceof File)) {
    return NextResponse.json({ error: 'No image file received.' }, { status: 400 });
  }

  const name = image.name.replace(/\s+/g, '_');
  const inputPath = path.join(uploadsDir, `${Date.now()}-${name}`);
  const outputPath = path.join(outputDir, `removed-${Date.now()}-${name.replace(/\.[^.]+$/, '')}.png`);

  const buffer = Buffer.from(await image.arrayBuffer());
  await fs.writeFile(inputPath, buffer);

  try {
    await execFileAsync(python, [scriptPath, inputPath, outputPath], { timeout: 120000 });
    const fileBuffer = await fs.readFile(outputPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${path.basename(outputPath)}"`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Background removal failed.', detail: String(error) }, { status: 500 });
  }
}
