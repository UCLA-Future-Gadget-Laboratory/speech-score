# Imports the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types

# Instantiates a client

class CloudNaturalLanguage:
	client = language.LanguageServiceClient()

	def __init__(self, text):
		self.text = text

	def analyzeSentiment(self):
		document = types.Document(
    		content=self.text,
    		type=enums.Document.Type.PLAIN_TEXT
    	)

		return self.client.analyze_sentiment(document=document).document_sentiment

if __name__ == "__main__":
	text = "sample text to be analyzed"
	asdf = CloudNaturalLanguage(text)
	sentiment = asdf.analyzeSentiment()
	print('Text: {}'.format(text))
	print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))