import math


def Question2():
    n = int(input("n: "))
    Array = []
    for x in range(n-1):
        Array.append(int(input("")))
    
    small1 = 99999
    small2 = 99999
    for x in range(0, n-1):
        if Array[x] < small1:
            small2 = small1
            small1 = Array[x]
        if Array[x] < small2:
            if Array[x] != small1:
                small2 = Array[x]
    
    print("2nd Smallest is ", small2)


def Question3():
    Flag = True
    n = int(input("Value: "))
    for x in range(2, round(n**0.5)):
        if n%x == 0:
            Flag = False
            print("Divisor is " + str(x))
            break
    print(Flag)


def Question4():
    Day1 = int(input("Days: "))
    Month1 = int(input("Months: "))
    Year1 = int(input("Years: "))
    K = int(input("K: "))

    Sum = Day1 + 30*Month1 + 360*Year1
    Diff = Sum + K

    Year2 = math.floor(Diff/360)
    Diff = Diff - 360*Year2
    if Diff < 31:
        Year2 = Year2 - 1
        Diff = Diff + 360

    Month2 = math.floor(Diff/30)
    Diff = Diff - 30*Month2
    if Diff < 1:
        Month2 = Month2 - 1
        Diff = Diff + 30

    Day2 = Diff

    print(f"{Day2}/{Month2}/{Year2}")


print("Which Question")
OInput = input("")
if OInput == "2":
    Question2()
if OInput == "3":
    Question3()
if OInput == "4":
    Question4()