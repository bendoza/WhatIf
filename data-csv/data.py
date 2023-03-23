import os

folder_path = '/Users/bendoza/go/src/WhatIf/data-csv' # replace with the path to your folder

for filename in os.listdir(folder_path):
    if filename.endswith(".csv") and filename != "crypto-list.csv":
        file_path = os.path.join(folder_path, filename)
        with open(file_path, "r") as f:
            lines = f.readlines()
        with open(file_path, "w") as f:
            for i, line in enumerate(lines):
                if i == 0:
                    f.write(line)
                else:
                    parts = line.split(",", 2)
                    print(parts[0] + "," + parts[2])
                    f.write(parts[0] + "," + parts[2])

