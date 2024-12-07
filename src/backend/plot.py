import matplotlib.pyplot as plt
import sympy

# Generate the first 1000 prime numbers
primes = list(sympy.primerange(1, 7920))[:1000]

# Plot the primes
plt.figure(figsize=(10, 6))
plt.plot(primes, marker='o', linestyle='', markersize=3, label='Prime Numbers')
plt.grid(True)

# Add title and labels
plt.title("Prime Number Distribution\n$f(n) = p_n$, where $p_n$ is the nth prime")
plt.xlabel("Index (n)")
plt.ylabel("Prime Number ($p_n$)")

# Save the plot as an image
plt.savefig("plot.png")
plt.close()