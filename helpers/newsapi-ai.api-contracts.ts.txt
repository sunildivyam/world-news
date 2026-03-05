const query = {
  "query": {
    "$query": {
      "$and": [
        {
          "$or": [
            {
              "keyword": "trumph",
              "keywordLoc": "body"
            },
            {
              "keyword": "modi",
              "keywordLoc": "body"
            }
          ]
        },
        {
          "$or": [
            {
              "categoryUri": "dmoz/Business/Financial_Services"
            },
            {
              "categoryUri": "dmoz/Recreation/Travel"
            },
            {
              "categoryUri": "news/Technology"
            }
          ]
        },
        {
          "locationUri": "http://en.wikipedia.org/wiki/New_Delhi"
        }
      ]
    },
    "$filter": {
      "forceMaxDataTimeWindow": "31",
      "isDuplicate": "skipDuplicates",
      "hasDuplicate": "skipHasDuplicates"
    }
  },
  "resultType": "articles",
  "articlesSortBy": "date",
  "includeArticleSocialScore": true,
  "includeArticleConcepts": true,
  "includeArticleCategories": true,
  "includeArticleLocation": true,
  "includeArticleImage": true,
  "includeArticleVideos": true,
  "includeArticleLinks": true,
  "includeArticleExtractedDates": true,
  "includeArticleDuplicateList": true,
  "includeArticleOriginalArticle": true,
  "apiKey": "54087e18-dd20-447e-8796-b4a9418c53ed"
};

const url = `https://eventregistry.org/api/v1/article/getArticles?
query=%7B%22%24query%22%3A%7B%22%24and%22%3A%5B%7B%22%24or%22%3A%5B%7B%22keyword%22%3A%22trumph%22%2C%22keywordLoc%22%3A%22body%22%7D%2C%7B%22keyword%22%3A%22modi%22%2C%22keywordLoc%22%3A%22body%22%7D%5D%7D%2C%7B%22%24or%22%3A%5B%7B%22categoryUri%22%3A%22dmoz%2FBusiness%2FFinancial_Services%22%7D%2C%7B%22categoryUri%22%3A%22dmoz%2FRecreation%2FTravel%22%7D%2C%7B%22categoryUri%22%3A%22news%2FTechnology%22%7D%5D%7D%2C%7B%22locationUri%22%3A%22http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FNew_Delhi%22%7D%5D%7D%2C%22%24filter%22%3A%7B%22forceMaxDataTimeWindow%22%3A%2231%22%2C%22isDuplicate%22%3A%22skipDuplicates%22%2C%22hasDuplicate%22%3A%22skipHasDuplicates%22%7D%7D
&resultType=articles
&articlesSortBy=date
&includeArticleSocialScore=true
&includeArticleConcepts=true
&includeArticleCategories=true
&includeArticleLocation=true
&includeArticleImage=true
&includeArticleVideos=true
&includeArticleLinks=true
&includeArticleExtractedDates=true
&includeArticleDuplicateList=true
&includeArticleOriginalArticle=true
&apiKey=54087e18-dd20-447e-8796-b4a9418c53ed
&callback=JSON_CALLBACK
`;

const response = {
"articles":  {
"results":  [
"0":  {
"uri": "9115665482"
"lang": "eng"
"isDuplicate": false
"date": "2026-03-03"
"time": "07:27:52"
"dateTime": "2026-03-03T07:27:52Z"
"dateTimePub": "2026-03-03T07:26:58Z"
"dataType": "news"
"sim": 0.9019607901573181
"url": "https://www.republicworld.com/india/pm-narendra-modi-most-subscribed-world-leader-30-million-youtube"
"title": "Most Subscribed World Leader: PM Narendra Modi's YouTube Channel Crosses 30 Million Subscribers"
"body": "New Delhi: PM Narendra Modi has crossed the significant milestone of 30 million subscribers on YouTube, further cementing his position as the most-followed world leader on the platform. Among world leaders, PM Modi has the largest number of YouTube subscribers. As per the rankings, he is ..."
"source":  {
"uri": "republicworld.com"
"dataType": "news"
"title": "Republic World"
}
"authors":  [
]
"concepts":  [
"0":  {
"uri": "http://en.wikipedia.org/wiki/Narendra_Modi"
"type": "person"
"score": 5
"label":  {
"eng": "Narendra Modi"
}
}
"1":  {4}
"2":  {4}
"3":  {4}
"4":  {4}
"5":  {5}
"6":  {4}
"7":  {4}
"8":  {4}
"9":  {5}
"10":  {4}
"11":  {4}
"12":  {4}
"13":  {4}
"14":  {4}
"15":  {4}
"16":  {4}
"17":  {4}
"18":  {4}
"19":  {5}
]
"categories":  [
"0":  {
"uri": "dmoz/Health/Fitness/Advice_and_Guides"
"label": "dmoz/Health/Fitness/Advice and Guides"
"wgt": 100
}
"1":  {3}
"2":  {3}
]
"links":  [
]
"videos":  [
]
"image": "https://img.republicworld.com/all_images/2026/03/most-subscribed-world-leader-pm-narendra-modis-youtube-channel-crosses-30-million-subscribers-1772522790952-1280x720.webp"
"duplicateList":  [
]
"originalArticle": null
"eventUri": "eng-11445998"
"location":  {
"type": "place"
"label":  {
"eng": "New Delhi"
}
"country":  {
"type": "country"
"label":  {
"eng": "India"
}
}
}
"extractedDates": null
"shares":  {}
"sentiment": 0.2078431372549019
"wgt": 510218872
"relevance": 52
    },
  ....
]
"totalResults": 710
"page": 1
"count": 100
"pages": 8
}
}
