import json
import re
from pathlib import Path
from typing import Dict, List, Tuple
from llm_service import configured, generate_grounded_answer


STOP_WORDS = {
    "a", "an", "and", "are", "can", "do", "for", "how", "i", "in", "is",
    "it", "me", "of", "on", "or", "the", "to", "what", "which", "with",
    "you", "your",
}


def _tokens(text: str) -> List[str]:
    return [
        token for token in re.findall(r"[a-z0-9]+", text.lower())
        if token not in STOP_WORDS and len(token) > 1
    ]


def load_knowledge_base() -> List[Dict[str, str]]:
    source = Path(__file__).parent / "data" / "knowledge_base.json"
    with source.open("r", encoding="utf-8") as file:
        records = json.load(file)
    if not isinstance(records, list) or not all(isinstance(record, dict) for record in records):
        raise ValueError("Knowledge base must contain a list of document objects.")
    return records


def _score(query_tokens: List[str], record: Dict[str, str]) -> Tuple[int, int]:
    title_tokens = set(_tokens(record["title"]))
    content_tokens = set(_tokens(record["content"]))
    title_matches = len(set(query_tokens) & title_tokens)
    content_matches = len(set(query_tokens) & content_tokens)
    return title_matches * 3 + content_matches, len(content_tokens)


def retrieve(query: str, limit: int = 3) -> List[Dict[str, str]]:
    query_tokens = _tokens(query)
    if not query_tokens:
        return []
    records = load_knowledge_base()
    ranked = sorted(
        records,
        key=lambda record: _score(query_tokens, record),
        reverse=True,
    )
    return [record for record in ranked[:limit] if _score(query_tokens, record)[0] > 0]


def answer_query(query: str, history: List[dict] | None = None) -> Dict[str, object]:
    matches = retrieve(query)
    if not matches:
        if configured():
            try:
                return {
                    "answer": generate_grounded_answer(query, [], history or []),
                    "sources": [],
                    "grounded": False,
                    "model": "llm-conversational",
                    "llm_error": None,
                }
            except RuntimeError:
                pass
        return {
            "answer": (
                "I could not find that in the published scholarship guidance. "
                "Try asking about eligibility, required documents, application status, "
                "NFST, or the National Overseas Scholarship."
            ),
            "sources": [],
            "grounded": False,
        }

    model = "retrieval-fallback"
    llm_error = None
    if configured():
        try:
            answer = generate_grounded_answer(query, matches, history or [])
            model = "llm-grounded"
        except RuntimeError as error:
            answer = " ".join(record["content"] for record in matches[:2])
            llm_error = str(error)
    else:
        answer = " ".join(record["content"] for record in matches[:2])
    return {
        "answer": answer,
        "sources": [
            {"title": record["title"], "source": record["source"]}
            for record in matches
        ],
        "grounded": True,
        "model": model,
        "llm_error": llm_error,
    }
