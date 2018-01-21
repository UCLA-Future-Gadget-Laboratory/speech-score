import json
import gcpScript
import step

global INPUT_CHUNK_LENGTH, VIDEO_SAVE_PATH, AUDIO_SAVE_PATH, TRANSCRIPT_SAVE_PATH, JSON_SAVE_PATH, FINAL_SAVE_PATH, DEBUGGING

def init():
	""" Loads config file into global variables """

	with open('config.json') as json_data_file:
		config = json.load(json_data_file)

		INPUT_CHUNK_LENGTH = config["input"]["INPUT_CHUNK_LENGTH"]
		VIDEO_SAVE_PATH = config["input"]["VIDEO_SAVE_PATH"]
		AUDIO_SAVE_PATH = config["input"]["AUDIO_SAVE_PATH"]
		TRANSCRIPT_SAVE_PATH = config["intermediate"]["TRANSCRIPT_SAVE_PATH"]
		JSON_SAVE_PATH = config["intermediate"]["JSON_SAVE_PATH"]
		FINAL_SAVE_PATH = config["final"]["FINAL_SAVE_PATH"]

		DEBUGGING = config["debug_mode"]



if __name__ == '__main__':

	# Initialize global variables
	init()
	CHUNKS_PER_MINUTE = int(60//(INPUT_CHUNK_LENGTH/1000))
	transProc = gcpScript.gcpScript(TRANSCRIPT_SAVE_PATH, CHUNKS_PER_MINUTE, debug=DEBUGGING)

