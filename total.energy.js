//
//      Display Room Energy Total
//

/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('total.energy');
 * mod.thing == 'a thing'; // true
 */

function displayRoomEnergyTotal(roomName) {
    const room = Game.rooms[roomName];
    if (!room) {
        console.log('Room not found:', roomName);
        return;
    }

    // Sum energy from all spawns and extensions
    const energyStructures = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION
    });

    let totalEnergy = energyStructures.reduce((sum, structure) => sum + structure.store[RESOURCE_ENERGY], 0);

/*
    // Optionally include energy in containers and storages

    const storageStructures = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_STORAGE || structure.structureType === STRUCTURE_CONTAINER
    });

    totalEnergy += storageStructures.reduce((sum, structure) => sum + structure.store[RESOURCE_ENERGY], 0);
*/

    console.log(`Total energy in room ${roomName}: ${totalEnergy}`);
}

module.exports = {
    displayRoomEnergyTotal: displayRoomEnergyTotal
};