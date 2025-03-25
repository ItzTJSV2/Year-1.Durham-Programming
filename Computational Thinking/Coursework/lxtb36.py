import itertools
def load_dimacs(file_name):
    #file_name will be of the form "problem_name.txt"
    with open(file_name) as file:
        variableCount = 0
        clauseCount = 0
        clauses = []
        for line in file:
            if line[0] == 'p':
                lineSplit = line.split(' ')
                variableCount = int(lineSplit[2])
                clauseCount = int(lineSplit[3])
            elif line[0] == 'c':
                continue
            elif line:
                clause = []
                lineSplit = line.split(' ')
                for x in range(len(lineSplit)):
                    if int(lineSplit[x]) == 0:
                        break
                    else:
                        clause.append(int(lineSplit[x]))
                clauses.append(clause)
    return clauses

def simple_sat_solve(clause_set):
    if clause_set is None or len(clause_set) == 0:
        return False
    variables = [] 
    for clause in clause_set:
        for value in clause:
            value = abs(value)
            if value not in variables:
                variables.append(value)
    if len(variables) > 1:
        all_assignments = itertools.product([-1, 1], repeat=len(variables)) 
    else:
        all_assignments = [[1], [-1]]
    for assignment in all_assignments:
        assignmentSatisfy = True
        for clause in clause_set:
            clauseSatisfy = False
            for x in range(len(clause)):
                index = variables.index(abs(clause[x]))
                if clause[x] * assignment[index] > 0: # Clause is satisfied
                    clauseSatisfy = True
                    break
            if clauseSatisfy == False:
                assignmentSatisfy = False
                break
        if assignmentSatisfy:
            returnedAssignment = []
            for p in range(len(assignment)):
                returnedAssignment.append(variables[p] * assignment[p])
            return returnedAssignment
    return False

def branching_sat_solve(clause_set, partial_assignment=[]):
    if clause_set is None or len(clause_set) == 0:
        return False
    def is_clause_satisfied(clause, assignment):
        return any(lit in assignment for lit in clause)
    def is_clause_unsatisfied(clause, assignment):
        return all(-lit in assignment for lit in clause)
    # Solution is found
    if all(is_clause_satisfied(clause, partial_assignment) for clause in clause_set):
        return partial_assignment
    # Solution is not found
    if any(is_clause_unsatisfied(clause, partial_assignment) for clause in clause_set):
        return False
    # Choose an unassigned variable
    for clause in clause_set:
        for lit in clause:
            if lit not in partial_assignment and -lit not in partial_assignment:
                variable = lit
                break
        else:
            continue
        break
    # Add in a True
    result = branching_sat_solve(clause_set, partial_assignment + [variable])
    if result:
        return result
    # Add in a False
    return branching_sat_solve(clause_set, partial_assignment + [-variable])

def unit_propagate(clause_set):
    while True:
        foundUnit = None
        for clause in clause_set:
            if len(clause) == 1:
                foundUnit = clause[0]
                clause_set.remove(clause)
                break
        if foundUnit == None:
            break
        for clause in clause_set:
            for x in range(len(clause)):
                if abs(clause[x]) == abs(foundUnit):
                    clause.remove(clause[x])
                    break
    return clause_set

def dpll_sat_solve(clause_set,partial_assignment=[]):
    if clause_set is None or len(clause_set) == 0:
        return False
    clause_set = unit_propagate(clause_set)
    def is_clause_satisfied(clause, assignment):
        return any(lit in assignment for lit in clause)
    def is_clause_unsatisfied(clause, assignment):
        return all(-lit in assignment for lit in clause)
    # Solution is found
    if all(is_clause_satisfied(clause, partial_assignment) for clause in clause_set):
        return partial_assignment
    # Solution is not found
    if any(is_clause_unsatisfied(clause, partial_assignment) for clause in clause_set):
        return False
    # Choose an unassigned variable
    for clause in clause_set:
        for lit in clause:
            if lit not in partial_assignment and -lit not in partial_assignment:
                variable = lit
                break
        else:
            continue
        break
    # Add in a True
    result = dpll_sat_solve(clause_set, partial_assignment + [variable])
    if result:
        return result
    # Add in a False
    return dpll_sat_solve(clause_set, partial_assignment + [-variable])



def test():
    print("Testing load_dimacs")
    try:
        dimacs = load_dimacs("sat.txt")
        assert dimacs == [[1],[1,-1],[-1,-2]]
        print("Test passed")
    except:
        print("Failed to correctly load DIMACS file")

    print("Testing simple_sat_solve")
    try:
        sat1 = [[1],[1,-1],[-1,-2]]
        check = simple_sat_solve(sat1)
        assert check == [1,-2] or check == [-2,1]
        print("Test (SAT) passed")
    except:
        print("simple_sat_solve did not work correctly a sat instance")

    try:
        unsat1 = [[1, -2], [-1, 2], [-1, -2], [1, 2]]
        check = simple_sat_solve(unsat1)
        assert (not check)
        print("Test (UNSAT) passed")
    except:
        print("simple_sat_solve did not work correctly an unsat instance")

    print("Testing branching_sat_solve")
    try:
        sat1 = [[1],[1,-1],[-1,-2]]
        check = branching_sat_solve(sat1,[])
        assert check == [1,-2] or check == [-2,1]
        print("Test (SAT) passed")
    except:
        print("branching_sat_solve did not work correctly a sat instance")

    try:
        unsat1 = [[1, -2], [-1, 2], [-1, -2], [1, 2]]
        check = branching_sat_solve(unsat1,[])
        assert (not check)
        print("Test (UNSAT) passed")
    except:
        print("branching_sat_solve did not work correctly an unsat instance")


    print("Testing unit_propagate")
    try:
        clause_set = [[1],[-1,2]]
        check = unit_propagate(clause_set)
        assert check == []
        print("Test passed")
    except:
        print("unit_propagate did not work correctly")


    print("Testing DPLL") #Note, this requires load_dimacs to work correctly
    problem_names = ["sat.txt","unsat.txt"]
    for problem in problem_names:
        try:
            clause_set = load_dimacs(problem)
            check = dpll_sat_solve(clause_set,[])
            if problem == problem_names[1]:
                assert (not check)
                print("Test (UNSAT) passed")
            else:
                assert check == [1,-2] or check == [-2,1]
                print("Test (SAT) passed")
        except:
            print("Failed problem " + str(problem))
    print("Finished tests")



import time
start = time.time()
print(dpll_sat_solve(load_dimacs("8queens.txt")))
print(time.time() - start)