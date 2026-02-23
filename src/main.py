"""
Main entry point for the text-based adventure game.
"""
from src.game_engine import GameEngine

if __name__ == "__main__":
    engine = GameEngine()
    engine.run()
