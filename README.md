# Simple Text-Based Adventure Game

Welcome to the Simple Text-Based Adventure Game! This is a simple command-line game where you explore different rooms, collect items, and try to find the treasure.

## Project Structure

- `src/`: Contains the source code for the game.
    - `game.py`: Defines the Game class and game logic.
    - `player.py`: Defines the Player class.
    - `game_engine.py`: Manages the game loop and input handling.
    - `main.py`: Entry point for the application.
- `tests/`: Contains unit tests.
    - `test_game.py`: Tests for the Game and Player classes.
- `scripts/`: Helper scripts.
    - `run_tests.py`: Script to run tests.
    - `run_lint.py`: Script to run linting (requires pylint).
- `requirements.txt`: List of dependencies.

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

To play the game, run:

```bash
python3 -m src.main
```

## Testing

To run the tests:

```bash
python3 scripts/run_tests.py
```

## Linting

To lint the code (requires `pylint` installed):

```bash
python3 scripts/run_lint.py
```
