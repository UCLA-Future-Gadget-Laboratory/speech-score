import io
from pydub import AudioSegment

"""Streams transcription of the given audio file."""
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types

client = speech.SpeechClient()

mp3File = AudioSegment.from_file("AudioFile.m4a", "m4a")
mp3File.export("AudioFile.flac", format="flac")

with io.open("AudioFile.flac", 'rb') as audio_file:
    content = audio_file.read()

    # In practice, stream should be a generator yielding chunks of audio data.
    stream = [content]
    requests = (types.StreamingRecognizeRequest(audio_content=chunk)
                for chunk in stream)

    audio = types.RecognitionAudio(content=content)
    config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.FLAC,
        sample_rate_hertz=24000,
        language_code='en-US')

    response = client.recognize(config, audio)
    # Each result is for a consecutive portion of the audio. Iterate through
    # them to get the transcripts for the entire audio file.
    for result in response.results:
        # The first alternative is the most likely one for this portion.
        print('Transcript: {}'.format(result.alternatives[0].transcript))
