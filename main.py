import os
from gtts import gTTS
import random
from playsound import playsound
import sys

reload(sys)
sys.setdefaultencoding('utf8')


trump = True

def get_quotes():
    quotes = open("quotes.txt").read().split(";")
    return quotes

def say_random_quote(quotes):
    quote = random.choice(quotes)
    tts = gTTS(text=quote,lang='en')
    tts.save("quote.mp3")
    playsound("quote.mp3")

def main():
    quotes = get_quotes()
    say_random_quote(quotes)

if __name__ == "__main__":
    main()
