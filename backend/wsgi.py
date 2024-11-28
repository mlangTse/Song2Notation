# Entry point for Flask app
from app.routes.audio_processing import audio_processing
from flask import Flask

app = Flask(__name__)
app.register_blueprint(audio_processing)

if __name__ == '__main__':
    app.run(debug=True)
