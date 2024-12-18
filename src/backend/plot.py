import numpy as np
import plotly.graph_objects as go
import plotly.io as pio

# Generate circle data
theta = np.linspace(0, 2 * np.pi, 500)
x = np.cos(theta)
y = np.sin(theta)

# Create the figure
fig = go.Figure()

# Add the circle trace
fig.add_trace(go.Scatter(x=x, y=y, mode='lines', name='Circle'))

# Set a big layout
fig.update_layout(
    title="Circle Plot",
    xaxis=dict(scaleanchor="y", scaleratio=1),
    width=800,
    height=800,
)

# Convert figure to JSON and print
plot_data_json = pio.to_json(fig)
print(plot_data_json)