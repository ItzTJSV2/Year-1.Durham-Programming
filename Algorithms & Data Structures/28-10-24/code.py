# Question 4

def Q4(X):
    A = [] #Stack
    Instance = -1
    for z in range(len(X)):
        if (isinstance(X[z], int)) == False:
            Instance = z+1
            break
        else:
            A.append(X[z])
    print(A)
    for y in range(Instance, len(X)-1-Instance):
        Int1 = A.pop()
        Int2 = A.pop()
        if (X[y] == "+"):
            A.append(Int1 + Int2)
        elif (X[y] == "-"):
            A.append(Int1 - Int2)
        elif (X[y] == "*"):
            A.append(Int1 * Int2)
        elif (X[y] == "/"):
            A.append(Int1 / Int2)
        else:
            print(f"Big Problem: {X[y]}")
    print(f"Output: {str(A.pop())}")

        
        


Q4([4, 5, 1, 2, "+", "-", "/"])

