import matplotlib.pyplot as plt

def fibonacci(n):
    sequence = [0, 1]
    for i in range(2, n):
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

n = 15
fib_sequence = fibonacci(n)

plt.figure(figsize=(10, 6))
plt.plot(range(n), fib_sequence, marker='o', label='Fibonacci Sequence')
plt.title("Fibonacci Sequence: F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1")
plt.xlabel("n")
plt.ylabel("F(n)")
plt.grid(True)
plt.legend()
plt.savefig("plot.png")