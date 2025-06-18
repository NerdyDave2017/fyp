#  Real-Time Speech-to-Sign Language Translator for Nigeria's Deaf Community

A final year project at FUTA aimed at building a real-time, AI-powered system that translates spoken Nigerian English into animated Nigerian Sign Language (NSL) to bridge communication gaps for the Deaf and Hard-of-Hearing community in Nigeria.


##  Project Description

This system converts **live or recorded audio** into **text** using pretrained ASR models like Whisper, processes the text to extract meaningful phrases, and then maps them to **corresponding NSL gestures**, which are finally rendered as **animations** on-screen.


##  Goals

- Enable real-time speech-to-sign communication using AI.
- Fine-tune an ASR model for Nigerian-accented English.
- Create a lookup/mapping system for converting English phrases to NSL tokens.
- Render NSL gestures using image sequences or basic animations.


##  Project Structure

| Folder | Purpose |
|--------|---------|
| `asr/` | Speech recognition using Whisper or Wav2Vec2 |
| `nlp/` | Text processing and mapping to NSL tokens |
| `gesture/` | Gesture lookup and animation rendering |
| `ui/` | UI layer to display animations |
| `data/` | Audio samples, gesture clips, datasets |
| `utils/` | Common functions, metrics, helpers |
| `notebooks/` | Exploratory notebooks for testing ideas |
| `main.py` | Central script to run the whole system |



