import numpy as np
import plotly.graph_objects as go
import plotly.io as pio

# Define the Taylor expansion for sin(x)
def sin_taylor(x, terms=5):
    result = 0
    for n in range(terms):
        result += ((-1)**n * x**(2*n + 1)) / np.math.factorial(2*n + 1)
    return result

# Generate x values
x = np.linspace(-np.pi, np.pi, 500)

# Calculate y values for different Taylor expansions
y_exact = np.sin(x)
y_taylor_3 = sin_taylor(x, terms=3)
y_taylor_5 = sin_taylor(x, terms=5)
y_taylor_7 = sin_taylor(x, terms=7)

# Create the plot
fig = go.Figure()

fig.add_trace(go.Scatter(x=x, y=y_exact, mode='lines', name='sin(x)'))
fig.add_trace(go.Scatter(x=x, y=y_taylor_3, mode='lines', name='Taylor (3 terms)'))
fig.add_trace(go.Scatter(x=x, y=y_taylor_5, mode='lines', name='Taylor (5 terms)'))
fig.add_trace(go.Scatter(x=x, y=y_taylor_7, mode='lines', name='Taylor (7 terms)'))

# Update layout with a big size
fig.update_layout(
    title="Sin Taylor Expansion",
    xaxis_title="x",
    yaxis_title="y",
    width=1200,
    height=800,
    font=dict(size=18),
)

# Convert figure to JSON and print it
plot_data_json = pio.to_json(fig)
print(plot_data_json)