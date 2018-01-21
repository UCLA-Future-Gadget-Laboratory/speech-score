import json
from cloudNaturalLanguage import CloudNaturalLanguage
from cloudSpeechRecognition import CloudSpeechRecognition


class gcpScript():
	"""
	This is a JSONObject
	It has a __dict__ attribute

	Its __dict__ is initialized with the JSON file
	Its __dict__ is dumped to the JSON file
	"""

	# TODO: Verify that generateTranscript works!!!!!!

	def __init__(self):
		"""
		Initialize the __dict__
		"""
		with open("stream_data.json", "r") as filename:
			data = filename.read()	
			self.__dict__ = json.loads(data)

			print(self.__dict__)

		with open("config.json", "r") as json_data_file:
			config = json.load(json_data_file)

			self.INPUT_CHUNK_LENGTH = config["input"]["INPUT_CHUNK_LENGTH"]
			self.VIDEO_SAVE_PATH = config["input"]["VIDEO_SAVE_PATH"]
			self.AUDIO_SAVE_PATH = config["input"]["AUDIO_SAVE_PATH"]
			self.TRANSCRIPT_SAVE_PATH = config["intermediate"]["TRANSCRIPT_SAVE_PATH"]
			self.JSON_SAVE_PATH = config["intermediate"]["JSON_SAVE_PATH"]
			# self.FINAL_SAVE_PATH = config["final"]["FINAL_SAVE_PATH"]


	def output_final(self):
		""" Outputs final transcript """
		with open(self.transcript_path, 'r') as transcript:
			lines = transcript.readlines()
			lines = [l.rstrip() for l in lines]
		
		return ' '.join(lines)


	def step(self):
		"""
		Processes new data chunk and updates stats
		"""
		self.read()

		# Calculates average WPM
		NUM_CHUNKS = min(len(self.word_count), self.chunks_per_minute)
		self.WPM.append(sum(self.word_count[-NUM_CHUNKS:])*(self.chunks_per_minute/NUM_CHUNKS))

		# Does sentiment analysis on minute history
		# TODO: Pass list instead of copying the string
		text = ' '.join(self.words_last_minute)
		self.analyzeTranscript(text)

		self.chunk_num += 1
		
		# Update stream_data.json
		with open('stream_data.json', 'w') as filename:
			json.dump(self.__dict__, filename)
		return self.__dict__


	def read(self):
		""" 
		Returns new transcript text as list of words
		"""
		# Generates audio file name, e.g. audio_0.webm, audio_1.webm, etc.
		audio_file = self.AUDIO_SAVE_PATH.split('.')
		audio_file = audio_file[0] + '_' + str(self.chunk_num) + '.' + audio_file[1]

		# ### HARDCODING
		# with open(self.transcript_path, 'r') as transcript:
		# 	lines = transcript.readlines()
		# 	print(self.chunk_num)
		# 	chunk = lines[self.chunk_num].split()

		### ACTUAL
		chunk = self.generateTranscript(audio_file)			###

		# Calculates number of words in this chunk
		chunk_length = len(chunk)
		self.word_count.append(chunk_length)

		# Adds words from this chunk to minute history
		self.transcript.append(' '.join(chunk))
		self.words_last_minute.pop(0)
		self.words_last_minute.append(' '.join(chunk))


	def generateTranscript(self, audio_file):
		"""
		"""
		speechRecognitionObj = CloudSpeechRecognition()
		chunk = speechRecognitionObj.transcribe(audio_file, "webm")
		return chunk


	def analyzeTranscript(self, text):
		"""
		analyzeTranscript takes in a string indicating the text to analyze
		e.g. self.analyzeTranscript("Happy happy happy happy happy")
		and returns JSON in the following format:
		{	
			"WPM": float,
			"sentiment": {
				"text": string,
				"score": float,
				"magnitude": float
			}
		}
		"""
		naturalLanguageObj = CloudNaturalLanguage()
		self.sentiment = naturalLanguageObj.analyzeSentiment(text)
		self.average_WPM = self.WPM[-1]
		return