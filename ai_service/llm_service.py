import os
from typing import Dict, List

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

SYSTEM_PROMPT = """You are the TribalEduConnect scholarship guidance assistant.
Answer only from the provided knowledge base context. Be clear, empathetic, and
concise for a student. If the context does not answer the question, say that
the published guidance does not contain the answer and suggest checking the
latest official notification. Never invent deadlines, eligibility decisions,
personal data, or government policy. Do not claim to have checked a student's
account. End with a short 'Sources:' line naming the context topics used."""


def _setting(name: str, default: str) -> str:
    return os.getenv(name, default).strip()


def configured() -> bool:
    return bool((os.getenv("GEMINI_API_KEY") or os.getenv("LLM_API_KEY", "")).strip())


def generate_grounded_answer(query: str, matches: List[Dict[str, str]]) -> str:
    if not configured():
        raise RuntimeError("GEMINI_API_KEY is not configured.")

    context = "\n\n".join(
        f"Context topic: {record['title']}\n{record['content']}"
        for record in matches
    )
    api_key = (os.getenv("GEMINI_API_KEY") or os.environ["LLM_API_KEY"]).strip()
    client = genai.Client(api_key=api_key)

    try:
        response = client.models.generate_content(
            model=_setting("LLM_MODEL", "gemini-flash-lite-latest"),
            contents=f"Knowledge base context:\n{context}\n\nStudent question: {query}",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.2,
                max_output_tokens=450,
            ),
        )
        answer = (response.text or "").strip()
    except Exception as error:
        raise RuntimeError(f"Gemini request failed: {error}") from error

    if not answer:
        raise RuntimeError("Gemini returned an empty assistant message.")
    return answer
