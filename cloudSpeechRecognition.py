import io
import os
from pydub import AudioSegment

"""Streams transcription of the given audio file."""
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types

class CloudSpeechRecognition:
    client = speech.SpeechClient()

    def __init__(self):
        pass

    def transcribe(self, audio, type):
        audioFileOriginal = AudioSegment.from_file(audio, type)
        audioFileOriginal.export("AudioFile.flac", format="flac")

        audioFileConverted = io.open("AudioFile.flac", 'rb')
        content = audioFileConverted.read()

        # In practice, stream should be a generator yielding chunks of audio data.
        stream = [content]
        requests = (types.StreamingRecognizeRequest(audio_content=chunk)
                    for chunk in stream)

        audio = types.RecognitionAudio(content=content)
        config = types.RecognitionConfig(
            encoding=enums.RecognitionConfig.AudioEncoding.FLAC,
            sample_rate_hertz=48000,
            language_code='en-US')

        response = self.client.recognize(config, audio)

        print(response)

        # chunk_transcript=None

        chunk_transcript = response.results.alternatives[0].transcript
        # Each result is for a consecutive portion of the audio. Iterate through
        # them to get the transcripts for the entire audio file.
        for result in response.results:
            # The first alternative is the most likely one for this portion.
            print('Transcript: {}'.format(result.alternatives[0].transcript))

        audioFileConverted.close()
        os.remove("AudioFile.flac")
        return chunk_transcript

