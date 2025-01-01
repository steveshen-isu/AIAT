import os
import subprocess

# Path to the plot.py file in the tmp folder
script_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../tmp/plot.py'))

# Execute plot.py silently
subprocess.run(['python3', script_path], check=True)