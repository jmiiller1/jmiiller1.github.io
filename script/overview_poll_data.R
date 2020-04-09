library(tidyverse)

setwd("~/Documents/CPSC436/Milestone/project_democratic-primary/data")

original <- read.csv("pollNumbersFiveThirtyEight.csv")

df <- original %>%
  filter(state == "National") %>%
  mutate(Date = lubridate::mdy(modeldate))

df %>%
  ggplot(data = ., aes(x = Date, y = pct_estimate, color = candidate_name)) +
  geom_line()


original <- read.csv("pres_primary_avgs_2020.csv")

df <- original %>%
  select(state, modeldate, candidate_name, pct_estimate) %>%
  filter(state == "National", candidate_name %in% c("Bernard Sanders", "Joseph R. Biden Jr.", "Elizabeth Warren", "Michael Bloomberg", "Pete Buttigieg")) %>%
  mutate(Date = lubridate::mdy(modeldate),
         Candidates = recode(candidate_name, "Bernard Sanders" = "Sanders", "Joseph R. Biden Jr." = "Biden", "Elizabeth Warren" = "Warren", "Michael Bloomberg" = "Bloomberg", "Pete Buttigieg" = "Buttigieg")) %>%
  select(-candidate_name, -modeldate) %>%
  droplevels() %>%
  arrange(as.character(Candidates), Date)

write.table(df, file = "polling_data.csv", sep = ",",
            row.names = FALSE, col.names = c("State", "Date", "Percentage", "Candidates"))

unique(df$Candidates)


df %>%
  ggplot(data = ., aes(x = Date, y = pct_estimate, color = candidate_name)) +
  geom_point()
