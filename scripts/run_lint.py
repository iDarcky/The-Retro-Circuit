import subprocess
import sys

def run_lint():
    try:
        # Run pylint on the src directory
        result = subprocess.run(['pylint', 'src'], capture_output=True, text=True)
        print(result.stdout)
        print(result.stderr)

        # We don't exit with error here to ensure the script completes,
        # but in a real CI pipeline you might want to.
        if result.returncode != 0:
             print(f"Pylint finished with return code {result.returncode}")

    except FileNotFoundError:
        print("Pylint not found. meaningful linting could not be performed.")
        sys.exit(1)

if __name__ == "__main__":
    run_lint()
