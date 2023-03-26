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
            for line in lines:
                # Check if the line contains 6 consecutive commas
                if ",,,,,," not in line:
                    # If it doesn't, write the line to the file
                    file.write(line)
