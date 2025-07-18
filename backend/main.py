# backend/main.py
from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import openai
import sqlite3
import datetime

openai.api_key = "YOUR_OPENAI_API_KEY"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

class PromptRequest(BaseModel):
    project_id: str
    prompt: str

@app.post("/prompt")
def prompt_to_llm(req: PromptRequest):
    # LLMにプロンプト送信
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role": "user", "content": req.prompt}]
    )
    answer = response.choices[0].message.content

    # SQLiteへ履歴保存
    conn = sqlite3.connect("history.db")
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO history (project_id, prompt, response, timestamp) VALUES (?, ?, ?, ?)",
        (req.project_id, req.prompt, answer, datetime.datetime.now())
    )
    conn.commit()
    conn.close()

    return {"response": answer}
