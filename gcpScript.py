from cloudNaturalLanguage import CloudNaturalLanguage

naturalLanguageObj = CloudNaturalLanguage()

print(naturalLanguageObj.analyzeSentiment("I love dicks"))

"""
analyzeSentiment takes in a string indicating the text to analyze
e.g. naturalLanguageObj.analyzeSentiment("I love dicks")
and returns JSON in the following format:
{
	"text": string,
	"score": float,
	"magnitude": float
}
"""

# TODO: Calculate words per minute and store it in the JSON output


# TODO: Store the JSON output into firebase