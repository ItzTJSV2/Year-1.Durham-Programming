def CalcChain(N):
    array = [N]
    while True:
        if (N == 1):
            break
        if (N % 2 == 0): # Even Function
            array.append(int(N/2))
            N = N/2
        else:
            Value = int((3*N+1)/2)
            if Value > 999:
                array.append(0)
                N = 1
            else:
                array.append(Value)
                N = Value
    return array
for i in range(1, 999):
    print(f"test-{i};{i};{','.join(str(x) for x in CalcChain(i))};50000")
