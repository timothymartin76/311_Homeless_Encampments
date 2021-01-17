### NYC 311 homeless-related complaints 

library(scales)
library(dplyr)
library(ggplot2)
library(lubridate)
library(dplyr)
library(ggthemes)
library(tidyr)
library(reshape2)


### Read in all NYC 311 homeless related complaints
mydata<- read.csv("https://data.cityofnewyork.us/resource/yvma-4jej.csv?$select=Created_Date,%20Complaint_Type&$limit=4000000")

### Convert to date
mydata$Created.Date <- mdy_hms(mydata$Created.Date)
mydata$Created.Date<-  floor_date(mydata$Created.Date, "month")
mydata$Created.Date <- as.Date(mydata$Created.Date, format = "%Y-%m-%d")

### aggregate dplyr
mydata<- mydata %>%
  group_by(Created.Date, Complaint.Type) %>%
  summarize(Total =  n())

### cleaning up the data for graphing
wide_DF <- mydata %>% spread(Complaint.Type, Total)
wide_DF[is.na(wide_DF)] = 0
long_DF <- melt(wide_DF, id.vars="Created.Date")
long_DF<- arrange(long_DF, Created.Date)
names(long_DF)<- c("Created.Date", "Category", "value")

### graph in ggplot
ggplot(long_DF, aes(x = Created.Date, y = value, group=Category, fill=Category)) + geom_area(position = "stack") + 	
scale_x_date(breaks = pretty_breaks(n = 10)) +
     theme_fivethirtyeight()+
     ggtitle("NYC 311 Homeless Complaints 2010-2021")