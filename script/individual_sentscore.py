import nltk
from nltk.tokenize import word_tokenize, RegexpTokenizer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

sentence = 'Democrats Decide That Joe Biden, as Risky as He Ever Was, Is the Safest Bet The former vice president had the Super Tuesday of his dreams, winning in places he hasn\'t even set foot in recently.'
tokenized_sentence = nltk.word_tokenize(sentence)

sid = SentimentIntensityAnalyzer()
pos_word_list=[]
neu_word_list=[]
neg_word_list=[]

for word in tokenized_sentence:
    if (sid.polarity_scores(word)['compound']) >= 0.1:
        pos_word_list.append(word)
    elif (sid.polarity_scores(word)['compound']) <= -0.1:
        neg_word_list.append(word)
    else:
        neu_word_list.append(word)

print('Positive:', pos_word_list)
print('Neutral:', neu_word_list)
print('Negative:', neg_word_list)
score = sid.polarity_scores(sentence)
print('Scores:', score)
