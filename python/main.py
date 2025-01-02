import os
import subprocess

def handler(event, context):
    # Path to the dynamically generated plot.py in /tmp
    script_path = '/tmp/plot.py'

    # Check if the file exists
    if os.path.exists(script_path):
        try:
            # Execute plot.py
            subprocess.run(['python3', script_path], check=True)
            return {
                "statusCode": 200,
                "body": "Plot executed successfully."
            }
        except subprocess.CalledProcessError as e:
            return {
                "statusCode": 500,
                "body": f"Error executing plot.py: {e}"
            }
    else:
        return {
            "statusCode": 404,
            "body": "plot.py not found."
        }