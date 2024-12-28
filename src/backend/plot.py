import numpy as np
import matplotlib.pyplot as plt

# Define the function
def f(x):
    return (x**2 + 2*x + 1) / (x + 2)

# Generate x values avoiding the vertical asymptote at x = -2
x = np.linspace(-10, 10, 1000)
x = x[x != -2]

# Plot the function
plt.figure(figsize=(8, 6))
plt.plot(x, f(x), label=r"$\frac{x^2+2x+1}{x+2}$", color="blue")

# Add grid
plt.grid(True)

# Add title with theorem and equations
plt.title("Illustration of Asymptote\nFunction: $\\frac{x^2+2x+1}{x+2}$", fontsize=14)

# Save the plot as an image
plt.savefig("plot.png")