import json
# Import the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types

class CloudNaturalLanguage:
	client = language.LanguageServiceClient()

	def __init__(self):
		pass

	"""
	Input: a string with the text to analyze for sentiment
	Output: JSON file with the following format
	{
		"text": string,
		"score": float,
		"magnitude": float
	}
	"""
	def analyzeSentiment(self, text):
		document = types.Document(
    		content=text,
    		type=enums.Document.Type.PLAIN_TEXT
    	)

		sentiment = self.client.analyze_sentiment(document=document).document_sentiment

		sentimentData = {}
		sentimentData['text'] = text
		sentimentData['score'] = sentiment.score
		sentimentData['magnitude'] = sentiment.magnitude

		return json.dumps(sentimentData)

if __name__ == "__main__":
	text = "sample text to be analyzed"
	cnl = CloudNaturalLanguage()
	sentiment = cnl.analyzeSentiment(text)
	print(sentiment)