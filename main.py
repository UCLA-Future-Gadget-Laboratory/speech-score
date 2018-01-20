
import json

""" Loads config file into global variables """
def init():
	global INPUT_CHUNK_LENGTH, VIDEO_SAVE_PATH, AUDIO_SAVE_PATH, JSON_SAVE_PATH, FINAL_SAVE_PATH

	with open('config.json') as json_data_file:
		config = json.load(json_data_file)

		INPUT_CHUNK_LENGTH = config["input"]["INPUT_CHUNK_LENGTH"]
		VIDEO_SAVE_PATH = config["input"]["VIDEO_SAVE_PATH"]
		AUDIO_SAVE_PATH = config["input"]["AUDIO_SAVE_PATH"]
		JSON_SAVE_PATH = config["intermediate"]["JSON_SAVE_PATH"]
		FINAL_SAVE_PATH = config["final"]["FINAL_SAVE_PATH"]



if __name__ == '__main__':

	# Initialize global variables
	init()

	# Gets video chunk and saves it to VIDEO_SAVE_PATH

	# Passes audio chunk to Google Speech API and returns/saves transcript

	# Uses Google NLP API to perform sentiment analysis, etc. on transcript
	# Use Python SDK to save data to Firebase


	# Extract stuff with Java SDK, with contents in Realtime Database, parse it, and provide immediate feedback on-screen


	# At the end, make a JSON file (or use Firebase) summarizing the entire speech


	# Use Firebase API to upload the final VIDEO, AUDIO, TRANSCRIPT