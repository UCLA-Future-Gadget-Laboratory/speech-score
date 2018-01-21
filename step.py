from main import *
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

global transProc


if __name__ == '__main__':

	# Fetch the service account key JSON file contents
	cred = credentials.Certificate('./SBHacks-c18839cd7d0f.json')

	# Initialize the app with a service account, granting admin privileges
	firebase_admin.initialize_app(cred, {
	    'databaseURL': "https://sbhacks-1516442289825.firebaseio.com"
	})

	# As an admin, the app has access to read and write all data, regardless of Security Rules
	ref = db.reference('data')

	# Passes audio chunk to Google Speech API, generates transcript

	# # Uses Google NLP API to perform sentiment analysis, etc. on transcript
	# # Use Python to produce JSON file
	# ref.child('info').push().set(info)
	if DEBUGGING:

		with open(TRANSCRIPT_SAVE_PATH, 'r') as text:
			total_lines = len(text.readlines())

		for i in range(total_lines):
			info = transProc.step()
			ref.child('info').push().set(info)

		print("The final transcript is \"{}\"".format(transProc.output_final()))


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
