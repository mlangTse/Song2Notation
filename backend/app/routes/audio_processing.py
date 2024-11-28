import os
from flask import Blueprint, request, jsonify
import librosa
import numpy as np
from music21 import stream, note, chord

audio_processing = Blueprint('audio_processing', __name__)

UPLOAD_FOLDER = 'uploads/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@audio_processing.route('/process-audio', methods=['POST'])
def process_audio():
    """
    Endpoint to upload an audio file and process it to extract musical notation.
    """
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    audio_file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, audio_file.filename)
    audio_file.save(file_path)

    try:
        # Load and process audio file
        y, sr = librosa.load(file_path, sr=None)
        pitches, magnitudes = extract_pitches(y, sr)
        chords = generate_chords(pitches)

        # Generate MusicXML notation
        music_notation = generate_music21_stream(chords)

        # Save MusicXML to a file
        musicxml_path = os.path.join(UPLOAD_FOLDER, "output.musicxml")
        music_notation.write('musicxml', fp=musicxml_path)

        return jsonify({
            'message': 'Audio processed successfully',
            'musicxml_path': musicxml_path,
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def extract_pitches(y, sr):
    """
    Extract pitches from the audio signal using librosa's pitch tracking.
    """
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    return pitches, magnitudes

def generate_chords(pitches):
    """
    Simplify extracted pitches to generate chords.
    """
    chords = []
    for i in range(pitches.shape[1]):
        pitch_indices = np.nonzero(pitches[:, i])[0]
        if len(pitch_indices) > 0:
            # Convert indices to frequencies
            chord_notes = [librosa.midi_to_hz(idx) for idx in pitch_indices]
            chords.append(chord_notes)
    return chords

def generate_music21_stream(chords):
    """
    Convert chords into a Music21 stream object for notation generation.
    """
    music_stream = stream.Stream()
    for chord_notes in chords:
        if chord_notes:  # Ensure there are notes in the chord
            chord_obj = chord.Chord(chord_notes)
            music_stream.append(chord_obj)
    return music_stream