import json
from cloudNaturalLanguage import CloudNaturalLanguage

global DEBUGGING

class gcpScript:
	"""
	DEBUGGING:
	Hard-code transcript.txt

	Save the text of each "chunk" in a new line
	"""

	def __init__(self, transcript_path, chunks_per_minute, debug = False):
		"""
		Constants, passed at initialization:
			transcript_path
			chunks_per_minute
		
		Variables, updated each step:
			words_last_minute: a list of strings, contains text of last minute's chunks
			word_count: a list of ints, num of words per chunk
			info: information on recent transcript text, dictionary
		"""
		global DEBUGGING
		DEBUGGING = debug
		self.transcript_path = transcript_path
		self.chunks_per_minute = chunks_per_minute
		# TODO: Transfer this functionality to use Firebase Database

		self.words_last_minute = ['' for _ in range(chunks_per_minute)]
		self.word_count = []
		self.WPM = []

		self.info = {}
		# DEBUGGING: Read a file based on chunk_num
		self.chunk_num = 0


	def output_final(self):
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
		NUM_CHUNKS = min(self.word_count[-1], self.chunks_per_minute)
		self.WPM.append(sum(self.word_count[-NUM_CHUNKS:])*(self.chunks_per_minute/NUM_CHUNKS))

		# Does sentiment analysis on minute history
		# TODO: Pass list instead of copying the string
		text = ' '.join(self.words_last_minute)
		info = self.analyzeTranscript(text)

		self.chunk_num += 1
		return info


	def read(self):
		""" 
		Returns new transcript text as list of words
		"""
		with open(self.transcript_path, 'r') as transcript:
			lines = transcript.readlines()
			chunk = lines[-1].split()

			if DEBUGGING:
				chunk = lines[self.chunk_num].split()

		# Calculates number of words in this chunk
		chunk_length = len(chunk)
		self.word_count.append(chunk_length)

		# Adds words from this chunk to minute history
		self.words_last_minute.pop(0)
		self.words_last_minute.append(' '.join(chunk))


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
		sentiment = naturalLanguageObj.analyzeSentiment(text)

		self.info['sentiment'] = sentiment
		self.info['WPM'] = self.WPM[-1]

		return json.dumps(self.info)


# TODO: Calculate words per minute and store it in the JSON output


# TODO: Store the JSON output into firebase