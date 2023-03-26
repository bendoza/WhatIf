import os

# Set the directory containing the CSV files
directory = "/Users/bendoza/go/src/WhatIf/data-csv"

# Loop through each file in the directory
for filename in os.listdir(directory):
    # Only consider files with the .csv extension
    if filename.endswith(".csv"):
        # Open the file for reading
        with open(os.path.join(directory, filename), "r") as file:
            # Read the file contents into a list of lines
            lines = file.readlines()
        # Open the file for writing
        with open(os.path.join(directory, filename), "w") as file:
            # Loop through each line and write it to the file
            count = 0
            for line in lines:
                if count == 0:
                    line = line.replace("Date,Close,CryptoID", "Date,Close,CryptoID,Ticker")
                    file.write(line)
                    count += 1
                else:
                    values = line.strip().split(",")
                    ticker = filename.split("-", 1)[0]
                    line = line.replace(values[0] + ticker, values[0] + ticker + "," + ticker)
                    file.write(line)

