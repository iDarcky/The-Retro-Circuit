"""
This module contains the GameEngine class which manages the game loop and user input.
"""

from src.game import Game
from src.player import Player

class GameEngine:
    """
    Manages the game execution, user input, and game state.
    """
    def __init__(self):
        """
        Initializes the GameEngine.
        """
        self.game = Game()
        self.player = Player("Adventurer")
        self.player.current_room = self.game.start_room
        self.is_running = True

    def process_command(self, command):
        """
        Processes a user command.

        Args:
            command (str): The command string entered by the user.

        Returns:
            str: The response or result of the command.
        """
        parts = command.split()
        if not parts:
            return "Please enter a command."

        action = parts[0].lower()

        if action in ["quit", "exit"]:
            self.is_running = False
            return "Goodbye!"

        if action == "look":
            return self.look()

        if action in ["go", "move", "walk"]:
            if len(parts) < 2:
                return "Go where?"
            direction = parts[1].lower()
            return self.player.move(direction)

        if action == "take":
            if len(parts) < 2:
                return "Take what?"
            item_name = " ".join(parts[1:])
            return self.player.take_item(item_name)

        if action == "drop":
            if len(parts) < 2:
                return "Drop what?"
            item_name = " ".join(parts[1:])
            return self.player.drop_item(item_name)

        if action == "inventory":
            if not self.player.inventory:
                return "You are carrying nothing."
            return "You are carrying: " + ", ".join([item.name for item in self.player.inventory])

        return "I don't understand that command."

    def look(self):
        """
        Returns a description of the current room and its contents.

        Returns:
            str: The description of the current room.
        """
        room = self.player.current_room
        description = f"You are in {room.name}.\n{room.description}\n"
        if room.items:
            description += "You see here: " + ", ".join([item.name for item in room.items]) + "\n"
        description += "Exits: " + ", ".join(room.exits.keys())
        return description

    def run(self):
        """
        Starts the main game loop.
        """
        print("Welcome to the Adventure Game!")
        print(self.look())
        while self.is_running:
            try:
                command = input("> ")
                response = self.process_command(command)
                print(response)
            except (EOFError, KeyboardInterrupt):
                print("\nGoodbye!")
                self.is_running = False
