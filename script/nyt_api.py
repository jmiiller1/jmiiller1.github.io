import requests
import json
import time
import csv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from pprint import pprint

analyzer = SentimentIntensityAnalyzer()

#api_key = '3vBom6ktWDJ9iFa3jXvmcx1JhVfQH79z'

#for year, month in [(2019, 6), (2019, 7), (2019, 8), (2019, 9), (2019, 10), (2019, 11), (2019, 12), (2020, 1), (2020, 2)]:
#    print(year, month)
#    url = f'https://api.nytimes.com/svc/archive/v1/{year}/{month}.json?api-key=' + api_key
#    r = requests.get(url)
#    json_data = r.json()

#    filename = f'{year}-{month}.txt'
#    output = open(filename, mode='w')
#    json.dump(json_data, output)
#    output.close()
#    time.sleep(20)

out = open('NYT_data.csv', mode='w')
writer = csv.writer(out, quoting=csv.QUOTE_NONNUMERIC)
writer.writerow(['Date', 'Candidates', 'NewsDesk', 'Category', 'SentScore(headline)', 'SentScore(abstract)', 'SentScore(lead)', 'SentScore(Avg)'])

#out.write(','.join(['Date', 'Candidates', 'Section', 'SentScore(headline)', 'SentScore(abstract)', 'SentScore(lead)', 'SentScore(Avg)']) + '\n')

for year, month in [(2019, 6), (2019, 7), (2019, 8), (2019, 9), (2019, 10), (2019, 11), (2019, 12), (2020, 1), (2020, 2)]:
    f = open(f'{year}-{month}.txt', mode='r')
    articles = json.load(f)

    # Joe Biden, Bernie Sanders, Elizabeth Warren, Michael Bloomberg, Pete Buttigieg
    for i in range(len(articles['response']['docs'])):
        headline = articles['response']['docs'][i]['headline']['main']
        abstract = articles['response']['docs'][i]['abstract']
        lead_paragraph = articles['response']['docs'][i]['lead_paragraph']
        keywords = [obj['value'] for obj in articles['response']['docs'][i]['keywords']]
        section_name = articles['response']['docs'][i]['news_desk'].lower()
        date = articles['response']['docs'][i]['pub_date'][:10]
        snippet = articles['response']['docs'][i]['snippet']

        if any([name in headline for name in ['Biden', 'Sanders', 'Warren', 'Bloomberg', 'Buttigieg']]):
            names = ','.join([name for name in ['Biden', 'Sanders', 'Warren', 'Bloomberg', 'Buttigieg'] if name in headline])
            score_headline = analyzer.polarity_scores(headline)['compound']
            score_abstract = analyzer.polarity_scores(abstract)['compound']
            score_paragraph = analyzer.polarity_scores(lead_paragraph)['compound']
            avg = (score_headline + score_abstract + score_paragraph) / 3
            if section_name in {'business', 'business day', 'sundaybusiness'}:
                category = 'business'
            elif section_name in {'editorial', 'opinion', 'oped', 'upshot'}:
                category = 'opinion'
            elif section_name in {'politics', 'national', 'u.s.', 'washington'}:
                category = 'politics'
            else:
                category = 'other'
            writer.writerow([date, names, section_name, category, round(score_headline, 2), round(score_abstract, 2), round(score_paragraph, 2), round(avg, 2)])

out.close()
