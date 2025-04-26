// app/api/entries/route.ts
import { NextResponse } from 'next/server';
import { getEntries, createEntry } from '@/lib/db';

export async function GET() {
  try {
    const entries = getEntries();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Failed to fetch entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const entry = await request.json();
    const newEntry = createEntry(entry);
    return NextResponse.json(newEntry);
  } catch (error) {
    console.error('Failed to create entry:', error);
    return NextResponse.json({ error: 'Failed to create entry' }, { status: 500 });
  }
}