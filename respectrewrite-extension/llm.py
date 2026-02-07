# app/models/llm_client.py

import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


class LLMClient:

    def __init__(self):

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError("GROQ_API_KEY is missisng. Check your .env file.")

        self.client = Groq(api_key=api_key)

        # excellent choix 👇
        self.model = "llama-3.1-8b-instant"


    def generate(self, prompt: str, max_tokens: int = 200) -> str:

        try:

            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an AI that rewrites harmful or aggressive messages into respectful and empathetic language."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=max_tokens,
                temperature=0.6,
            )

            return completion.choices[0].message.content.strip()

        except Exception as e:

            print("LLM ERROR:", e)
            return "Sorry, rewrite unavailable."
