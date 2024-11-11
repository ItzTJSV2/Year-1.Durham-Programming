def digit_sum(n):
    try:
        n = int(n)
    except:
        raise ValueError("Invalid Input")
    if n < 0 or n % 1 != 0:
        raise ValueError("Invalid Input")
    if len(str(n)) == 1:
        return n
    for x in range(len(str(n))):
        return int(str(n)[0]) + digit_sum(int(str(n)[1:]))
    
print(digit_sum(0/0))