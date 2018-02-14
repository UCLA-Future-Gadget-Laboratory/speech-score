# Speech Score

## Introduction

The purpose of this app is to analyze a user's speech patterns to find interesting facts about them, and eventually present a report of the user's habits and how well he's speaking. This can be used for speakers to improve. For now, we've settled on using Google Cloud Speech-to-Text API to count words for minute, which has yet to be implemented. Future updates may or may not include spectral analysis to track the dominant frequency of the speaker's voice, with the idea that nervousness should increase pitch, or measure general changes in sibilants to see if speaker is enunciating normally. Visualizations could be made with d3.js.

Since the application is single-user and static, we could wrap it in a desktop application via something like atom.js.

## Built With

* [JQuery](https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js)
* [FontAwesome](https://use.fontawesome.com/) - Used for SVG icons
* [Google Font](https://fonts.googleapis.com/css?family=Lato) - Lato font

## Authors

* **Alexander Chen** - *Initial work* - [alexanderqchen](https://github.com/alexanderqchen/)
* **FGL** - We are mado scientisto.

## Special Thanks
Christine, Chris, and Haoyu for the original idea in which this project is based off.

