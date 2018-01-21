import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

import reset, json
from gcpScript import gcpScript
global INPUT_CHUNK_LENGTH, VIDEO_SAVE_PATH, AUDIO_SAVE_PATH, TRANSCRIPT_SAVE_PATH, JSON_SAVE_PATH, FINAL_SAVE_PATH

def config():
	""" Loads config file into global variables """
	global INPUT_CHUNK_LENGTH, VIDEO_SAVE_PATH, AUDIO_SAVE_PATH, TRANSCRIPT_SAVE_PATH, JSON_SAVE_PATH, FINAL_SAVE_PATH

	with open('config.json') as json_data_file:
		config = json.load(json_data_file)

		INPUT_CHUNK_LENGTH = config["input"]["INPUT_CHUNK_LENGTH"]
		VIDEO_SAVE_PATH = config["input"]["VIDEO_SAVE_PATH"]
		AUDIO_SAVE_PATH = config["input"]["AUDIO_SAVE_PATH"]
		TRANSCRIPT_SAVE_PATH = config["intermediate"]["TRANSCRIPT_SAVE_PATH"]
		JSON_SAVE_PATH = config["intermediate"]["JSON_SAVE_PATH"]
		FINAL_SAVE_PATH = config["final"]["FINAL_SAVE_PATH"]

		DEBUGGING = config["debug_mode"]
		CHUNKS_PER_MINUTE = int(60//(INPUT_CHUNK_LENGTH/1000))



if __name__ == '__main__':

	# reset.reset()
	config()

	# Fetch the service account key JSON file contents
	cred = credentials.Certificate('./SBHacks-c18839cd7d0f.json')

	# Initialize the app with a service account, granting admin privileges
	firebase_admin.initialize_app(cred, {
	    'databaseURL': "https://sbhacks-1516442289825.firebaseio.com"
	})

	# As an admin, the app has access to read and write all data, regardless of Security Rules
	ref = db.reference('data')
	ref.set({})
	
	# # Uses Google NLP API to perform sentiment analysis, etc. on transcript
	# # Use Python to produce JSON file
	# Assumes transcript saved to TRANSCRIPT_SAVE_PATH
	with open('hi.json', 'w') as filename:
		json.dump({}, filename)



	gcp = gcpScript()
	info = gcp.step()
	print(info)
	ref.push().set(info)


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
