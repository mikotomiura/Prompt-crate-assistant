# backend/db.py
import sqlite3

conn = sqlite3.connect("history.db")
c = conn.cursor()

c.execute("""
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id TEXT,
    prompt TEXT,
    response TEXT,
    timestamp TEXT
)
""")
conn.commit()
conn.close()

print("Database initialized.")