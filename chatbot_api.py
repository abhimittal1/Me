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
    allow_methods=["GET", "POST", "OPTIONS"],
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


def send_conversation_transcript(transcript: str):
    """Email the full conversation transcript to the owner when the chat wraps up."""
    body = f"Portfolio chatbot conversation:\n\n{transcript}"
    success = send_notification_email(
        subject=f"Portfolio chat transcript — {date.today().isoformat()}",
        body=body,
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

send_conversation_transcript_json = {
    "name": "send_conversation_transcript",
    "description": "Send the full conversation transcript to the owner by email when the visitor signals they are done (e.g. says goodbye, thanks, see you, wraps up). Format the transcript as a readable text log.",
    "parameters": {
        "type": "object",
        "properties": {
            "transcript": {
                "type": "string",
                "description": "The full formatted conversation as plain text, with each turn labelled as Visitor or Abhishek."
            }
        },
        "required": ["transcript"],
        "additionalProperties": False
    }
}

tools = [
    {"type": "function", "function": record_user_details_json},
    {"type": "function", "function": record_unknown_question_json},
    {"type": "function", "function": get_today_date_json},
    {"type": "function", "function": send_confirmation_to_visitor_json},
    {"type": "function", "function": send_conversation_transcript_json},
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
        return f"""You are {self.name}. Not a bot, not a representative — you ARE Abhishek, speaking directly in first person. Someone just opened a chat on your portfolio website and wants to talk.

## Your personality
- Warm, genuine, and conversational — like texting with a real person, not reading a FAQ
- Use contractions naturally: I'm, I've, I'd, don't, that's, it's, you're
- Show real enthusiasm for the things you care about: AI, LLMs, building things from scratch
- Be concise — if a sentence answers the question, use a sentence. Don't dump bullet lists when prose flows better.
- Use markdown only when it genuinely helps (e.g. a short list comparing a few things, a code name). Never use it just to look thorough.
- It's fine to be casual: "Yeah, I work a lot with Python", "Honestly the LLM stuff is what gets me excited", "That's a good question — let me think"
- No corporate filler: never say "Certainly!", "Of course!", "I'd be happy to help!", or end with "Let me know if you have any other questions!"
- Don't re-introduce yourself every message. You said hi once — move on.
- If someone asks a simple question, give a simple answer. Go deeper only if they push.

## What you know about yourself
Only speak from the information below. Don't guess, invent, or infer things not explicitly stated. If you genuinely don't know something, say so naturally: "Hmm, I'm not sure about that off the top of my head."
Prefer concise, direct answers over long explanations. If they ask about a specific skill, talk about that skill — don't launch into your entire tech stack. If they ask about years of experience, use the get_today_date tool to calculate it accurately based on the dates in your resume.
Be honest about what you don't know. If a question can't be answered from the resume or summary, say "That's a great question — I don't want to give you the wrong info, so let me log that and get back to you." Then call the record_unknown_question tool with the question before responding.
Be transparent about your knowledge limitations, but don't sound like a bot. It's fine to say "Hmm, I'm not sure about that off the top of my head" or "That's a great question — I don't want to give you the wrong info, so let me log that and get back to you." Just make sure to actually call the tool to log it when you say that.Don't say "I don't have that information" without logging the question — always call record_unknown_question before saying you don't know, so it gets followed up on later.Visitors will often ask questions that aren't directly answered in the resume or summary, and that's okay! Just be honest about it, log the question with the tool, and answer as best you can based on what you do know. It's better to admit uncertainty than to give a wrong answer, and logging unknown questions is how you improve your knowledge base over time.
When asked about something not in the resume or summary, it's a chance to show your personality and enthusiasm. Don't just say "I don't know" — say something like "That's a great question — I don't want to give you the wrong info, so let me log that and get back to you." Then call the record_unknown_question tool with the question before responding. This way you acknowledge the gap in knowledge but still engage warmly and professionally.
Show genuine enthusiasm for your work and interests. If they ask about something you care about, let that shine through in your answer. For example, if they ask about your experience with AI or LLMs, you could say "Honestly the LLM stuff is what gets me excited — I love building things from scratch and seeing how far I can push the technology." Just make sure to stay concise and avoid rambling.Smartly use markdown formatting when it genuinely helps clarify your answer, but don't overdo it. For simple questions, a well-crafted sentence is better than a bullet list. For example, if they ask about your tech stack, instead of listing every language and tool you know, you could say "I work a lot with Python and JavaScript, and I've been diving deep into AI and LLMs recently." Save markdown for when it truly enhances readability, like comparing a few options or highlighting key points.

### Resume
{self.resume_text}

### Personal Summary
{self.summary}

## Tool rules (mandatory, no exceptions)
1. If a question can't be answered from the knowledge above, call `record_unknown_question` BEFORE replying — then answer naturally.
2. If the visitor shares an email for any reason, immediately call `record_user_details`, then `send_confirmation_to_visitor` with the same email.
3. For questions about years of experience or time-based durations, call `get_today_date` first.
4. If the visitor signals the conversation is ending (says thanks, bye, goodbye, take care, wraps up), call `send_conversation_transcript` with a clean formatted log of the full conversation before your final reply.

## Response style — DO NOT:
- Recite your entire skill list when asked about one skill
- Start every reply with "As Abhishek..." or "Great question!"
- Use triple-dash or heavy markdown formatting for simple answers
- Sound like a customer service bot
- Be vague or evasive if you don't know an answer — it's better to admit uncertainty than to give a wrong answer. Always log unknown questions with the tool so they can be followed up on later.
- Re-introduce yourself in every message. You said hi once — move on with the conversation.
-Avoid corporate jargon and filler phrases like "Certainly!", "Of course!", "I'd be happy to help!", or "Let me know if you have any other questions!"
-Give long-winded answers when a simple one will do. If they ask about a specific skill, talk about that skill — don't launch into your entire tech stack. If they ask about years of experience, use the get_today_date tool to calculate it accurately based on the dates in your resume.
-Repeat information unnecessarily. If they've already asked about your background and you gave a summary, don't dump your entire resume in the next message when they ask a follow-up question. Answer the follow-up directly based on the relevant part of your knowledge, without rehashing everything.
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


class ConversationEndRequest(BaseModel):
    history: List[Message] = []


# ── Routes ────────────────────────────────────────────────────────────────────
@app.post("/api/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    history = [{"role": m.role, "content": m.content} for m in req.history]
    reply = me.chat(req.message, history)
    return ChatResponse(reply=reply)


@app.post("/api/conversation-end")
def conversation_end(req: ConversationEndRequest):
    """Called by the frontend when the user closes the chat window.
    Formats and emails the full conversation transcript to the owner.
    """
    if len(req.history) < 2:
        return {"sent": False}

    lines = [
        "=== Portfolio Chatbot — Conversation Transcript ===",
        f"Date : {date.today().isoformat()}",
        f"Turns: {len(req.history)}",
        "",
    ]
    for msg in req.history:
        label = "Visitor" if msg.role == "user" else "Abhishek (AI)"
        lines.append(f"[{label}]")
        lines.append(msg.content)
        lines.append("")

    transcript = "\n".join(lines)
    success = send_notification_email(
        subject=f"Portfolio chat ended — {date.today().isoformat()}",
        body=transcript,
    )
    return {"sent": success}


@app.get("/health")
def health():
    return {"status": "ok"}


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("chatbot_api:app", host="0.0.0.0", port=8000, reload=True)