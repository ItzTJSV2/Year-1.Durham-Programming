def minimum_join(str1, str2, characters, pos, smallest):
    if pos == smallest:
        #print(characters)
        #print("Minimum: ", len(characters))
        return len(characters)
    
    if str1[pos] in characters or str2[pos] in characters:
        #print(f"{str1[pos]} and {str2[pos]} found in characters")
        minimum_join(str1, str2, characters, pos + 1, smallest)
    else:
        characters.append(str1[pos])
        #print(f"Added {str1[pos]} to characters")
        Value = minimum_join(str1, str2, characters, pos + 1, smallest)
        print("Value: ", Value)
        if Value is not None and Value < smallest:
            print("Found new path, ", Value)
            smallest = Value
            return smallest
        characters.pop()
        print("Smallest: (After str1)", smallest)
        characters.append(str2[pos])
        #print(f"Added {str2[pos]} to characters")
        Value = minimum_join(str1, str2, characters, pos + 1, smallest)
        if Value is not None and Value < smallest:
            print("Found new path, ", Value)
            smallest = Value
            return Value
        characters.pop()
    return smallest
            


print(minimum_join("race", "care", [], 0, 4))
