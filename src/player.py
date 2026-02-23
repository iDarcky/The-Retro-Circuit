"""
This module contains the Player class which represents the player in the game.
"""

class Player:
    """
    Represents a player in the game.
    """
    def __init__(self, name):
        """
        Initializes a new Player instance.

        Args:
            name (str): The name of the player.
        """
        self.name = name
        self.inventory = []
        self.current_room = None

    def move(self, direction):
        """
        Moves the player in the specified direction if possible.

        Args:
            direction (str): The direction to move (e.g., "north", "south").

        Returns:
            str: A message indicating the result of the movement attempt.
        """
        if direction in self.current_room.exits:
            self.current_room = self.current_room.exits[direction]
            return f"You moved {direction} to {self.current_room.name}."

        return "You can't go that way."

    def take_item(self, item_name):
        """
        Attempts to pick up an item from the current room.

        Args:
            item_name (str): The name of the item to pick up.

        Returns:
            str: A message indicating whether the item was picked up or not found.
        """
        for item in self.current_room.items:
            if item.name.lower() == item_name.lower():
                self.inventory.append(item)
                self.current_room.items.remove(item)
                return f"You picked up {item.name}."
        return "Item not found."

    def drop_item(self, item_name):
        """
        Drops an item from the player's inventory into the current room.

        Args:
            item_name (str): The name of the item to drop.

        Returns:
            str: A message indicating whether the item was dropped or not in inventory.
        """
        for item in self.inventory:
            if item.name.lower() == item_name.lower():
                self.current_room.items.append(item)
                self.inventory.remove(item)
                return f"You dropped {item.name}."
        return "You don't have that item."
