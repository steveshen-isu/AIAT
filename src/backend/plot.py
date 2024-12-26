import plotly.graph_objects as go
import plotly.io as pio

# Define pyramid vertices
x = [0, 1, -1, 0]
y = [0, 1, 1, 0]
z = [0, 0, 0, 1]

# Define pyramid faces
i = [0, 0, 0, 1]
j = [1, 2, 3, 2]
k = [2, 3, 1, 3]

# Create the mesh for the pyramid
pyramid = go.Mesh3d(
    x=x,
    y=y,
    z=z,
    i=i,
    j=j,
    k=k,
    color='lightblue',
    opacity=0.50
)

# Create the layout
layout = go.Layout(
    title="3D Pyramid",
    scene=dict(
        xaxis=dict(range=[-2, 2]),
        yaxis=dict(range=[-2, 2]),
        zaxis=dict(range=[-2, 2]),
        aspectratio=dict(x=1.5, y=1.5, z=1.5)
    ),
)

# Create the figure
fig = go.Figure(data=[pyramid], layout=layout)

# Convert figure to JSON
plot_data_json = pio.to_json(fig)
print(plot_data_json)