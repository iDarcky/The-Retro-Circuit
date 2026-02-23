"""
This module defines the core game objects: Item, Room, and Game.
"""

class Item:
    """
    Represents an item in the game world.
    """
    def __init__(self, name, description):
        """
        Initializes a new Item.

        Args:
            name (str): The name of the item.
            description (str): A description of the item.
        """
        self.name = name
        self.description = description

class Room:
    """
    Represents a room or location in the game world.
    """
    def __init__(self, name, description):
        """
        Initializes a new Room.

        Args:
            name (str): The name of the room.
            description (str): A description of the room.
        """
        self.name = name
        self.description = description
        self.exits = {}
        self.items = []

    def add_exit(self, direction, room):
        """
        Adds an exit to another room.

        Args:
            direction (str): The direction of the exit (e.g., "north").
            room (Room): The room that the exit leads to.
        """
        self.exits[direction] = room

    def add_item(self, item):
        """
        Adds an item to the room.

        Args:
            item (Item): The item to add.
        """
        self.items.append(item)

class Game:
    """
    Manages the game world and initialization.
    """
    def __init__(self):
        """
        Initializes the Game instance.
        """
        self.rooms = {}
        self.start_room = None
        self.create_world()

    def create_world(self):
        """
        Creates the rooms, items, and connections for the game world.
        """
        # Create rooms
        start_room = Room("Start Room", "You are in a small, dimly lit room.")
        hallway = Room("Hallway", "A long narrow hallway.")
        treasure_room = Room("Treasure Room", "A room filled with gold and jewels!")

        # Connect rooms
        start_room.add_exit("north", hallway)
        hallway.add_exit("south", start_room)
        hallway.add_exit("east", treasure_room)
        treasure_room.add_exit("west", hallway)

        # Create items
        key = Item("Key", "A small rusty key.")
        sword = Item("Sword", "A sharp looking sword.")

        # Add items to rooms
        start_room.add_item(key)
        hallway.add_item(sword)

        self.rooms = {
            "Start Room": start_room,
            "Hallway": hallway,
            "Treasure Room": treasure_room
        }
        self.start_room = start_room
