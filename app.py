from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
import os
from dotenv import load_dotenv
from detoxify import Detoxify

# ✅ CORS Middleware
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

# ✅ Groq LLM Client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ✅ Detoxify Model (Fast Toxicity Detection)
detoxify_model = Detoxify('original')

app = FastAPI()

# ✅ SUPER IMPORTANT
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # pour dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RewriteRequest(BaseModel):
    text: str


# ✅ Fast Toxicity Check Function
def is_toxic(text: str, threshold: float = 0.7) -> bool:
    """
    Use Detoxify model to detect toxic content.
    Returns True if toxicity score > threshold.
    """
    result = detoxify_model.predict(text)
    toxicity_score = result["toxicity"]
    
    print(f"🔍 Toxicity Score: {toxicity_score:.2f} for text: {text[:50]}...")
    
    return toxicity_score > threshold


@app.post("/rewrite")
def rewrite_text(req: RewriteRequest):
    
    # ⚡ STEP 1: Fast toxicity check with Detoxify
    if not is_toxic(req.text):
        return {"rewrite": None, "is_safe": True}
    
    # ⚠️ STEP 2: Only call LLM if toxic
    print("⚠️ Toxic content detected - Calling LLM for explanation")
    
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """CRITICAL INSTRUCTIONS - READ CAREFULLY:
                        
                        You MUST format your output EXACTLY like this:
                        
                        It's [TYPE OF HARM]. This [NEGATIVE EFFECT].
                        
                        RULES YOU MUST FOLLOW:
                        1. Output EXACTLY 2 phrases separated by a period
                        2. First phrase MUST start with "It's"
                        3. Second phrase MUST start with "This"
                        4. Each phrase should be short (3-7 words)
                        5. NO additional text, explanations, or examples
                        6. NO markdown, no formatting, just plain text
                        7. If the text is ambiguous, focus on potential harm
                        
                        EXAMPLES:
                        Input: "you are stupid"
                        Output: "It's insulting intelligence. This makes people feel hated."
                        
                        Input: "I hate all people from that country"
                        Output: "It's prejudiced generalization. This promotes discrimination."
                        
                        Input: "You don't belong here"
                        Output: "It's exclusionary language. This makes people feel unwelcome."
                        
                        REMEMBER: 2 phrases only. It's [harm]. This [effect]."""
            },
            {
                "role": "user",
                "content": f"Analyze this message for potential harm: '{req.text}'\n\nOutput your analysis in exactly 2 phrases following the format."
            }
        ],
        max_tokens=80,
        temperature=0.1,
        top_p=0.1
    )
    
    explanation = completion.choices[0].message.content.strip()
    
    # Post-processing to ensure format compliance
    if explanation.count('.') > 1:
        # Take only first 2 phrases
        parts = explanation.split('.')
        explanation = f"{parts[0].strip()}. {parts[1].strip()}."
    
    # Ensure it starts with "It's" and has "This" in second part
    if not explanation.startswith("It's"):
        explanation = f"It's {explanation}"
    
    return {
        "rewrite": explanation,  # Note: This is actually explanation, not rewrite
        "is_safe": False
    }