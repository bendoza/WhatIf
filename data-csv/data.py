import csv
import os

# set the directory path where the CSV files are located
directory = "/Users/bendoza/go/src/WhatIf/data-csv/"

# create an empty list to store the data from each file
all_data = []

count = 0
# loop through each file in the directory
for filename in os.listdir(directory):
    if filename.endswith(".csv"):
        with open(os.path.join(directory, filename), 'r') as csv_file:
            # read the CSV file into a list of lists
            csv_reader = csv.reader(csv_file)
            # skip the header row
            next(csv_reader)
            # append the remaining rows to the all_data list
            all_data.extend(csv_reader)

# write the all_data list to a new CSV file called totalData.csv
with open('totalData.csv', 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerows(all_data)
