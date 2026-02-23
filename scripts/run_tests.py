import unittest
import sys
import os

# Add the project root to the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

loader = unittest.TestLoader()
start_dir = 'tests'
suite = loader.discover(start_dir)

runner = unittest.TextTestRunner()
result = runner.run(suite)

if not result.wasSuccessful():
    sys.exit(1)
