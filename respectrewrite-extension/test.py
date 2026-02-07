# quick_test.py

import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from llm_client import LLMClient

def quick_test():
    """Quick test of the model."""
    
    print("🔧 Initializing LLM Client...")
    try:
        client = LLMClient()
        print("✅ Client ready\n")
    except Exception as e:
        print(f"❌ Error: {e}")
        return
    
    # Your original test cases
    test_cases = [
        "you are stupid",
        "go back to your country",
        "women can't do math",
        "I wish you were dead"
    ]
    
    print("Running tests...")
    print("-" * 50)
    
    for test in test_cases:
        print(f"\nInput: '{test}'")
        
        try:
            explanation = client.explain_hate_speech_strict(test)
            print(f"Output: {explanation}")
            
            # Simple validation
            if explanation.startswith("It's") and "This" in explanation:
                print("✅ Format correct")
            else:
                print("⚠️  Format might be off")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "-" * 50)
    print("Test complete!")

if __name__ == "__main__":
    quick_test()