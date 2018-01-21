from main import *

if __name__ == '__main__':

	# Extracts audio chunk from video chunk

	# Passes audio chunk to Google Speech API and returns/saves transcript

	# Uses Google NLP API to perform sentiment analysis, etc. on transcript
	# Use Python to produce JSON file
	if DEBUGGING:

		with open(TRANSCRIPT_SAVE_PATH, 'r') as text:
			total_lines = len(text.readlines())

		for i in range(total_lines):
			info = transProc.step()
			print(info)

		print("The final transcript is \"{}\"".format(transProc.output_final()))


	# Use Node.js to push JSON data to Firebase Realtime Database

	# Bit clumsy here: We are saving JSON file locally, pushing it to Firebase database, then reading it again from firebase database...

	"""
	Using Node.js SDK,
	Extract new contents in Realtime Database, 
	parse it, 
	and provide immediate feedback on-screen

	Browser must react to new changes in the Realtime Database
	"""

	"""
	At end of video,
		Creates a new listing on Firebase summarizing the entire speech
		Display this summary info on Summary Screen
		Upload the final Video, Audio, and Transcript onto Firebase
		Add user authentication and commenting
	"""