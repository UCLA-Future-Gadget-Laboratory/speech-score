import json


def reset():
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
		CHUNKS_PER_MINUTE = int(60//(INPUT_CHUNK_LENGTH/1000))

	with open('stream_data.json', 'w') as filename:
			# Constant, based on config file
		stream_data = {}

		stream_data["transcript_path"] = TRANSCRIPT_SAVE_PATH
		stream_data["chunks_per_minute"] = CHUNKS_PER_MINUTE

		# Will update
		stream_data["words_last_minute"] = ['' for _ in range(CHUNKS_PER_MINUTE)]
		stream_data["word_count"] = []
		stream_data["WPM"] = []
		stream_data["average_WPM"] = 0
		stream_data["chunk_num"] = 0
		stream_data["chunk"] = ""
		# Remove transcript, since this would be from local file
		stream_data["transcript"] = ""

		json.dump(stream_data, filename)

	return