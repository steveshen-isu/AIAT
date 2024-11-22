import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import t

x = np.linspace(-5, 5, 500)
dof_values = [1, 2, 5, 10, 50]

plt.figure(figsize=(8, 6))
for dof in dof_values:
    plt.plot(x, t.pdf(x, dof), label=f'dof={dof}')

plt.title("Student's t-Distribution\n$f(x) = \\frac{\\Gamma(\\frac{\\nu+1}{2})}{\\sqrt{\\nu\\pi} \\Gamma(\\frac{\\nu}{2})} \\left(1 + \\frac{x^2}{\\nu}\\right)^{-\\frac{\\nu+1}{2}}$")
plt.xlabel('x')
plt.ylabel('Probability Density')
plt.grid(True)
plt.legend()
plt.savefig('plot.png')
plt.close()