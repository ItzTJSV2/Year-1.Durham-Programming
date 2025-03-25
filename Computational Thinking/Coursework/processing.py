# Open the input file in read mode and the output file in write mode
with open('8queens.txt', 'r') as infile, open('output.txt', 'w') as outfile:
    # Read each line from the input file
    for line in infile:
        # Split the line by spaces, remove the last '0', and join the remaining parts back
        parts = line.split()
        parts.pop()  # Remove the last element (which is '0')
        # Join the parts back into a string and write it to the output file
        outfile.write(" ".join(parts) + "\n")
