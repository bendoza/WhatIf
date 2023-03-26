import os

# Set the directory containing the CSV files
directory = "/Users/bendoza/go/src/WhatIf/data-csv"

# Loop through each file in the directory
for filename in os.listdir(directory):
    if filename.endswith(".csv") and filename != "crypto-list.csv":
        filepath = os.path.join(directory, filename)
        with open(filepath, "r") as file:
            lines = file.readlines()
        for line_number, line in enumerate(lines):
            values = line.strip().split(",")
            if len(values) != 6:
                print(f"{filename} line {line_number + 1} has {len(values)}")
