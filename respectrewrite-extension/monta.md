allow pasting
document.querySelectorAll('[role="article"]').length

cd respectrewrite-extension 
python -m venv venv   
venv\Scripts\activate 

pip install fastapi uvicorn groq python-dotenv
pip install detoxify torch