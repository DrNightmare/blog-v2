import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'app', 'activities', 'data.json');

// Ensure the activities directory exists
async function ensureDirectoryExists() {
  const dir = path.dirname(dataFilePath);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Initialize the JSON file if it doesn't exist
async function ensureFileExists() {
  try {
    await fs.access(dataFilePath);
  } catch {
    await fs.writeFile(dataFilePath, '[]');
  }
}

// GET /api/activities
export async function GET() {
  try {
    await ensureDirectoryExists();
    await ensureFileExists();
    
    const data = await fs.readFile(dataFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading activities:', error);
    return NextResponse.json({ error: 'Failed to read activities' }, { status: 500 });
  }
}

// POST /api/activities
export async function POST(request: Request) {
  try {
    await ensureDirectoryExists();
    await ensureFileExists();

    const activities = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(activities, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving activities:', error);
    return NextResponse.json({ error: 'Failed to save activities' }, { status: 500 });
  }
} 