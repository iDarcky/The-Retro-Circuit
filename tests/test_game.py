import unittest
import sys
import os

# Add the project root to the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.game import Game
from src.player import Player

class TestGame(unittest.TestCase):
    def setUp(self):
        self.game = Game()
        self.player = Player("Test Player")
        self.player.current_room = self.game.start_room

    def test_initial_room(self):
        self.assertEqual(self.player.current_room.name, "Start Room")

    def test_move(self):
        self.player.move("north")
        self.assertEqual(self.player.current_room.name, "Hallway")
        self.player.move("south")
        self.assertEqual(self.player.current_room.name, "Start Room")

    def test_invalid_move(self):
        msg = self.player.move("east")
        self.assertEqual(msg, "You can't go that way.")
        self.assertEqual(self.player.current_room.name, "Start Room")

    def test_take_item(self):
        # We know key is in the start room
        msg = self.player.take_item("Key")
        self.assertEqual(msg, "You picked up Key.")
        self.assertEqual(len(self.player.inventory), 1)
        self.assertEqual(self.player.inventory[0].name, "Key")
        self.assertEqual(len(self.player.current_room.items), 0)

    def test_drop_item(self):
        self.player.take_item("Key")
        msg = self.player.drop_item("Key")
        self.assertEqual(msg, "You dropped Key.")
        self.assertEqual(len(self.player.inventory), 0)
        self.assertEqual(len(self.player.current_room.items), 1)

if __name__ == '__main__':
    unittest.main()
