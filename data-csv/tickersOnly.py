import os
import csv

# set the directory path where the CSV files are located
directory = "/Users/bendoza/go/src/WhatIf/data-csv/"

# create an empty set to store unique ticker symbols
tickers = set()

# loop through each file in the directory
for filename in os.listdir(directory):
    if filename.endswith("totalData.csv"):
        with open(os.path.join(directory, filename), 'r') as csv_file:
            # read the CSV file into a list of lists
            csv_reader = csv.reader(csv_file)
            # skip the header row
            next(csv_reader)
            # loop through each row in the CSV file
            for row in csv_reader:
                # get the last element of the row
                last_element = row[-1]
                # add the last element to the set of unique ticker symbols
                tickers.add(last_element)

# convert the set of unique ticker symbols to a sorted list
ticker_list = sorted(list(tickers))

# write the ticker_list to a new text file called cryptoTickersOnly.txt
with open('cryptoTickersOnly.txt', 'w') as txt_file:
    for ticker in ticker_list:
        txt_file.write(ticker + '\n')