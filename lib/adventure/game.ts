export type Room = {
  id: string;
  name: string;
  description: string;
  exits: Record<string, string>;
  items: string[];
};

export type Item = {
  id: string;
  name: string;
  description: string;
};

export type GameState = {
  currentRoomId: string;
  inventory: string[];
  log: string[];
};

export const items: Record<string, Item> = {
  key: { id: 'key', name: 'Rusty Key', description: 'An old, rusty key.' },
  sword: { id: 'sword', name: 'Iron Sword', description: 'A sturdy iron sword.' },
};

export const getInitialRooms = (): Record<string, Room> => ({
  start: {
    id: 'start',
    name: 'Start Room',
    description: 'You are in a small, dimly lit room. There is a door to the north.',
    exits: { north: 'hallway' },
    items: ['key'],
  },
  hallway: {
    id: 'hallway',
    name: 'Hallway',
    description: 'A long, narrow hallway. To the south is the start room. To the east is a large door.',
    exits: { south: 'start', east: 'treasure_room' },
    items: ['sword'],
  },
  treasure_room: {
    id: 'treasure_room',
    name: 'Treasure Room',
    description: 'A room filled with gold and jewels! You have found the treasure!',
    exits: { west: 'hallway' },
    items: [],
  },
});

export const getInitialState = (): GameState => ({
  currentRoomId: 'start',
  inventory: [],
  log: ['Welcome to the Text Adventure! Type "help" for commands.'],
});

export function processCommand(
  state: GameState,
  command: string,
  rooms: Record<string, Room>
): { newState: GameState; newRooms: Record<string, Room> } {
  const parts = command.toLowerCase().trim().split(' ');
  const action = parts[0];
  const arg = parts.slice(1).join(' ');

  let newLog = [...state.log, `> ${command}`];
  let newState = { ...state };
  let newRooms = JSON.parse(JSON.stringify(rooms)); // Deep copy to avoid mutating state directly in React

  switch (action) {
    case 'look':
      const room = newRooms[state.currentRoomId];
      newLog.push(room.name);
      newLog.push(room.description);
      if (room.items.length > 0) {
        const itemNames = room.items.map((id: string) => items[id].name).join(', ');
        newLog.push(`You see: ${itemNames}`);
      }
      const exits = Object.keys(room.exits).join(', ');
      newLog.push(`Exits: ${exits}`);
      break;

    case 'go':
    case 'move':
    case 'walk':
      const currentRoom = newRooms[state.currentRoomId];
      if (currentRoom.exits[arg]) {
        newState.currentRoomId = currentRoom.exits[arg];
        newLog.push(`You go ${arg}.`);
        // Trigger look automatically
        const nextRoom = newRooms[newState.currentRoomId];
        newLog.push(nextRoom.name);
        newLog.push(nextRoom.description);
         if (nextRoom.items.length > 0) {
            const itemNames = nextRoom.items.map((id: string) => items[id].name).join(', ');
            newLog.push(`You see: ${itemNames}`);
          }
          const nextExits = Object.keys(nextRoom.exits).join(', ');
          newLog.push(`Exits: ${nextExits}`);
      } else {
        newLog.push("You can't go that way.");
      }
      break;

    case 'take':
    case 'get':
      const roomTake = newRooms[state.currentRoomId];
      const itemIndex = roomTake.items.findIndex((id: string) => items[id].name.toLowerCase() === arg || id === arg);
      if (itemIndex !== -1) {
        const itemId = roomTake.items[itemIndex];
        roomTake.items.splice(itemIndex, 1);
        newState.inventory.push(itemId);
        newLog.push(`You took the ${items[itemId].name}.`);
      } else {
        newLog.push("You don't see that here.");
      }
      break;

    case 'drop':
      const invIndex = newState.inventory.findIndex((id: string) => items[id].name.toLowerCase() === arg || id === arg);
      if (invIndex !== -1) {
        const itemId = newState.inventory[invIndex];
        newState.inventory.splice(invIndex, 1);
        newRooms[state.currentRoomId].items.push(itemId);
        newLog.push(`You dropped the ${items[itemId].name}.`);
      } else {
        newLog.push("You don't have that.");
      }
      break;

    case 'inventory':
    case 'i':
      if (newState.inventory.length === 0) {
        newLog.push("You are not carrying anything.");
      } else {
        const invNames = newState.inventory.map((id: string) => items[id].name).join(', ');
        newLog.push(`You are carrying: ${invNames}`);
      }
      break;

    case 'help':
      newLog.push("Available commands:");
      newLog.push("- look: describe the current room");
      newLog.push("- go <direction>: move in a direction (north, south, east, west)");
      newLog.push("- take <item>: pick up an item");
      newLog.push("- drop <item>: drop an item");
      newLog.push("- inventory: check your inventory");
      break;

    default:
      newLog.push("I don't understand that command.");
  }

  newState.log = newLog;
  return { newState, newRooms };
}
