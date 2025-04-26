// lib/db.ts
import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database;

export function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'plus-minus-next.sqlite');
    db = new Database(dbPath);
    initializeDb();
  }
  return db;
}

function initializeDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS entry_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entry_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      FOREIGN KEY (entry_id) REFERENCES entries(id) ON DELETE CASCADE
    );
  `);
}

export function getEntries() {
  const db = getDb();
  const entries = db.prepare(`
    SELECT e.id, e.date, e.created_at
    FROM entries e
    ORDER BY e.created_at DESC
  `).all();

  return entries.map(entry => {
    const items = db.prepare(`
      SELECT type, content
      FROM entry_items
      WHERE entry_id = ?
    `).all(entry.id);

    const plus = items.filter(item => item.type === 'plus').map(item => item.content);
    const minus = items.filter(item => item.type === 'minus').map(item => item.content);
    const next = items.filter(item => item.type === 'next').map(item => item.content);

    return {
      id: entry.id.toString(),
      date: entry.date,
      plus,
      minus,
      next
    };
  });
}

export function createEntry(entry: { date: string; plus: string[]; minus: string[]; next: string[] }) {
  const db = getDb();
  
  const result = db.prepare(`
    INSERT INTO entries (date, created_at)
    VALUES (?, datetime('now'))
  `).run(entry.date);

  const entryId = result.lastInsertRowid;

  const insertItem = db.prepare(`
    INSERT INTO entry_items (entry_id, type, content)
    VALUES (?, ?, ?)
  `);

  const insertMany = db.transaction((items: { type: string; content: string }[]) => {
    for (const item of items) {
      insertItem.run(entryId, item.type, item.content);
    }
  });

  const items = [
    ...entry.plus.map(content => ({ type: 'plus', content })),
    ...entry.minus.map(content => ({ type: 'minus', content })),
    ...entry.next.map(content => ({ type: 'next', content }))
  ];

  insertMany(items);

  return {
    id: entryId.toString(),
    date: entry.date,
    plus: entry.plus,
    minus: entry.minus,
    next: entry.next
  };
}

export function deleteEntry(id: string) {
  const db = getDb();
  db.prepare('DELETE FROM entries WHERE id = ?').run(parseInt(id));
}