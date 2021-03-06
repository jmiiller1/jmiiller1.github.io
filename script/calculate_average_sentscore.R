library(tidyverse)

setwd("~/Documents/CPSC436/Milestone/project_democratic-primary/data")

df <- read.csv("NYT_data.csv", header = TRUE, sep = ",")
d <- df %>%
  mutate(Date = lubridate::ymd(Date),
         Week = lubridate::floor_date(Date, unit = "week", week_start = 1)) %>%
  group_by(Candidates, Week) %>%
  summarise(SentScore.headline = mean(SentScore.headline.),
            SentScore.snippet = mean(SentScore.snippet.),
            SentScore.lead = mean(SentScore.lead.),
            SentScore.avg = mean(SentScore.avg.),
            n = n())

write.csv(d, file = "NYT_data_average.csv", quote = TRUE, row.names = FALSE)
