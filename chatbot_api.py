from dotenv import load_dotenv
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import date
from pypdf import PdfReader
from typing import List

load_dotenv(override=True)

# ── App setup ──────────────────────────────────────────────────────────────────
app = FastAPI(title="Abhishek Chatbot API")

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# ── SMTP config ────────────────────────────────────────────────────────────────
SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER     = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
NOTIFY_EMAIL  = os.getenv("NOTIFY_EMAIL", SMTP_USER)


def send_notification_email(subject: str, body: str, to: str = None) -> bool:
    """Send a plain-text email via SMTP STARTTLS.

    Soft-fails (logs and returns False) if SMTP credentials are not configured,
    so local development still works without an email setup.
    """
    if not (SMTP_USER and SMTP_PASSWORD):
        print(f"[Email] No SMTP credentials — skipping: {subject}", flush=True)
        return False

    recipient = to or NOTIFY_EMAIL or SMTP_USER
    msg = MIMEMultipart()
    msg["From"]    = SMTP_USER
    msg["To"]      = recipient
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, recipient, msg.as_string())
        print(f"[Email] Sent to {recipient}: {subject}", flush=True)
        return True
    except Exception as exc:
        print(f"[Email] Failed ({subject}): {exc}", flush=True)
        return False


# ── Tool functions ─────────────────────────────────────────────────────────────
def record_user_details(email, name="Name not provided", notes="not provided"):
    body = (
        f"New portfolio lead!\n\n"
        f"Name  : {name}\n"
        f"Email : {email}\n"
        f"Notes : {notes}"
    )
    send_notification_email(subject=f"Portfolio lead: {name}", body=body)
    return {"recorded": "ok"}


def record_unknown_question(question):
    body = f"The chatbot could not answer the following question:\n\n{question}"
    send_notification_email(subject="Chatbot: unanswered question", body=body)
    return {"recorded": "ok"}


def get_today_date():
    """Return today's ISO date so the assistant can calculate durations accurately."""
    return {"date": date.today().isoformat()}


def send_confirmation_to_visitor(email, name="there"):
    """Send an acknowledgment email directly to the visitor."""
    body = (
        f"Hi {name},\n\n"
        f"Thanks for reaching out! I've received your details and will get back to you soon.\n\n"
        f"In the meantime, feel free to explore my portfolio or connect with me on LinkedIn.\n\n"
        f"Best regards,\n"
        f"Abhishek Mittal"
    )
    success = send_notification_email(
        subject="Great to connect! — Abhishek Mittal",
        body=body,
        to=email,
    )
    return {"sent": success}


# ── Tool schemas ───────────────────────────────────────────────────────────────
record_user_details_json = {
    "name": "record_user_details",
    "description": "Record that a visitor is interested in being in touch and has provided an email address.",
    "parameters": {
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "description": "The visitor's email address"
            },
            "name": {
                "type": "string",
                "description": "The visitor's name, if provided"
            },
            "notes": {
                "type": "string",
                "description": "Any additional context from the conversation worth logging"
            }
        },
        "required": ["email"],
        "additionalProperties": False
    }
}

record_unknown_question_json = {
    "name": "record_unknown_question",
    "description": "Record any question that could not be answered from the knowledge base. Always call this before responding when you don't know the answer.",
    "parameters": {
        "type": "object",
        "properties": {
            "question": {
                "type": "string",
                "description": "The question that could not be answered"
            }
        },
        "required": ["question"],
        "additionalProperties": False
    }
}

get_today_date_json = {
    "name": "get_today_date",
    "description": "Returns today's date in ISO format (YYYY-MM-DD). Call this whenever you need to calculate years of experience, project durations, or answer any time-sensitive question accurately.",
    "parameters": {
        "type": "object",
        "properties": {},
        "required": [],
        "additionalProperties": False
    }
}

send_confirmation_to_visitor_json = {
    "name": "send_confirmation_to_visitor",
    "description": "Send a brief acknowledgment email to the visitor after successfully recording their contact details with record_user_details. Always call this immediately after record_user_details.",
    "parameters": {
        "type": "object",
        "properties": {
            "email": {
                "type": "string",
                "description": "The visitor's email address"
            },
            "name": {
                "type": "string",
                "description": "The visitor's name, if provided"
            }
        },
        "required": ["email"],
        "additionalProperties": False
    }
}

tools = [
    {"type": "function", "function": record_user_details_json},
    {"type": "function", "function": record_unknown_question_json},
    {"type": "function", "function": get_today_date_json},
    {"type": "function", "function": send_confirmation_to_visitor_json},
]


# ── Me class ───────────────────────────────────────────────────────────────────
class Me:
    def __init__(self):
        self.openai = OpenAI()
        self.name = "Abhishek Mittal"

        # Resume — prefer the public folder PDF, fall back to me/
        resume_paths = [
            "public/Abhishek_Resume_AI.pdf",
            "me/Abhishek_Mittal_Resume.pdf",
        ]
        self.resume_text = ""
        for path in resume_paths:
            if os.path.exists(path):
                reader = PdfReader(path)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        self.resume_text += text
                break

        # Summary — prefer public folder, fall back to me/
        summary_paths = [
            "public/Abhishek.txt",
            "me/Abhishek.txt",
        ]
        self.summary = ""
        for path in summary_paths:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    self.summary = f.read()
                break

    def handle_tool_call(self, tool_calls):
        results = []
        for tool_call in tool_calls:
            tool_name = tool_call.function.name
            arguments = json.loads(tool_call.function.arguments)
            print(f"Tool called: {tool_name} with args {arguments}", flush=True)
            tool = globals().get(tool_name)
            result = tool(**arguments) if tool else {"error": "unknown tool"}
            results.append({
                "role": "tool",
                "content": json.dumps(result),
                "tool_call_id": tool_call.id,
            })
        return results

    def system_prompt(self):
        return f"""You are a professional AI representative acting as {self.name}. Your role is to engage with visitors, answer questions about {self.name}'s background, experience, and skills, and identify potential professional connections.

## Your Identity
You are {self.name}. Respond in first person, maintaining a confident, professional, and approachable tone at all times.

## Knowledge Base
You have access to the following information about {self.name}. Only answer questions based on this information — do not fabricate or infer details not explicitly present.

### Resume
{self.resume_text}

### Personal Summary
{self.summary}

## Tool Usage Rules (STRICT — NO EXCEPTIONS)
1. If ANY question cannot be answered from the Resume or Personal Summary, call `record_unknown_question` BEFORE responding.
2. If the visitor shares an email address for any reason, immediately call `record_user_details`, then call `send_confirmation_to_visitor` with the same email.
3. If asked about years of experience, current age of a project, or any time-sensitive duration, call `get_today_date` first to get an accurate answer.
4. These are mandatory actions — not suggestions.

## Behavioral Guidelines
- Speak in first person as {self.name} — never break character
- Be concise, professional, and helpful
- If you cannot answer something, be transparent, then log it with `record_unknown_question`
- Steer interested visitors towards sharing their email or connecting on LinkedIn
- Do not speculate or provide information not supported by the knowledge base
- Keep responses focused on professional topics
"""

    def chat(self, message: str, history: list) -> str:
        messages = (
            [{"role": "system", "content": self.system_prompt()}]
            + history
            + [{"role": "user", "content": message}]
        )
        done = False
        while not done:
            response = self.openai.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                tools=tools,
            )
            if response.choices[0].finish_reason == "tool_calls":
                assistant_message = response.choices[0].message
                tool_calls = assistant_message.tool_calls
                results = self.handle_tool_call(tool_calls)
                messages.append(assistant_message)
                messages.extend(results)
            else:
                done = True
        return response.choices[0].message.content


# ── Singleton ─────────────────────────────────────────────────────────────────
me = Me()


# ── Request / Response models ─────────────────────────────────────────────────
class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[Message] = []


class ChatResponse(BaseModel):
    reply: str


# ── Routes ────────────────────────────────────────────────────────────────────
@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    history = [{"role": m.role, "content": m.content} for m in req.history]
    reply = me.chat(req.message, history)
    return ChatResponse(reply=reply)


@app.get("/health")
def health():
    return {"status": "ok"}


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("chatbot_api:app", host="0.0.0.0", port=8000, reload=True)