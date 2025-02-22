def insertionSort(InputArray):
    x = 1 # Start at the second element
    while x < len(InputArray):
        j = x # Repeat for all elements already sorted
        while j > 0 and InputArray[j-1] > InputArray[j]: # Find minimal value that is greater than the current element
            tempValue = InputArray[j] # Swap the two elements
            InputArray[j] = InputArray[j-1]
            InputArray[j-1] = tempValue
            j = j - 1
        x = x + 1 # Go to the next element
    return InputArray

def selectionSort(InputArray):
    x = 0 # Start at the first element
    while x < len(InputArray):
        j = x # Repeat for all elements already sorted
        minIndex = x # Assume the first element is the smallest
        while j < len(InputArray): # Find the smallest value
            if InputArray[j] < InputArray[minIndex]:
                minIndex = j
            j = j + 1
        tempValue = InputArray[x] # Swap the two elements
        InputArray[x] = InputArray[minIndex]
        InputArray[minIndex] = tempValue
        x = x + 1 # Go to the next element
    return InputArray

def bubbleSort(InputArray):
    x = 0 # Start at the first element
    while x < len(InputArray):
        j = 0 # Repeat for all elements
        while j < len(InputArray) - 1:
            if InputArray[j] > InputArray[j+1]: # Swap the two elements
                tempValue = InputArray[j]
                InputArray[j] = InputArray[j+1]
                InputArray[j+1] = tempValue
            j = j + 1
        x = x + 1 # Go to the next element
    return InputArray

def mergeSort(InputArray):
    def merge(left, right):
        result = []
        while len(left) > 0 and len(right) > 0:
            if left[0] <= right[0]:
                result.append(left.pop(0))
            else:
                result.append(right.pop(0))
        result.extend(left)
        result.extend(right)
        return result

    if len(InputArray) <= 1:
        return InputArray

    middle = len(InputArray) // 2
    left = mergeSort(InputArray[:middle])
    right = mergeSort(InputArray[middle:])

    return merge(left, right)


print(mergeSort([23, 1, 10, 5, 2]))