import os

# Set the directory containing the CSV files
directory = "/Users/bendoza/go/src/WhatIf/data-csv"

# Loop through each file in the directory
for filename in os.listdir(directory):
    # Only consider files with the .csv extension
    if filename.endswith(".csv") and filename != "crypto-list.csv":
        # Open the file for reading
        with open(os.path.join(directory, filename), "r") as file:
            # Read the file contents into a list of lines
            lines = file.readlines()
        # Open the file for writing
        with open(os.path.join(directory, filename), "w") as file:
            # Loop through each line and write it to the file
            for i, line in enumerate(lines):
                # If it's the first line, remove ",Adj Close" from the end
                if i == 0:
                    line = line.replace(",Adj Close", "")
                # Write the line to the file
                file.write(line)
