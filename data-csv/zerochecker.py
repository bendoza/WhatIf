import os

folder_path = "/Users/bendoza/go/src/WhatIf/data-csv"  # replace with the actual path to your folder

# Loop through all files in the folder
for filename in os.listdir(folder_path):
    if filename.endswith(".csv"):
        with open(os.path.join(folder_path, filename), "r") as file:
            # Skip the first line

            next(file)
            # Loop through all remaining lines
            for line in file:
                values = line.split(",")
                # Check if the second through sixth values equal 0.0
                if float(values[1]) == 0.0 or float(values[2]) == 0.0 or float(values[3]) == 0.0 or float(values[4]) == 0.0 or float(values[5]) == 0.0:
                    print(filename)
                    break
