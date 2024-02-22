var roleUpgrader = {
    run: function(creep) {
        // Toggle between upgrading and fetching energy based on the creep's energy capacity
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 fetch');
        } else if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            // Move to and upgrade the controller
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                // Use reusePath for more efficient pathfinding
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 10});
            }
        } else {
            // Energy collection strategy with priority: Container/Storage > Source
            var energySource = this.findEnergySource(creep);
            if (energySource) {
                if (('store' in energySource && creep.withdraw(energySource, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) ||
                    creep.harvest(energySource) === ERR_NOT_IN_RANGE) {
                    // Use reusePath for more efficient pathfinding
                    creep.moveTo(energySource, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 15});
                }
            }
        }
    },

    // Function to find the nearest energy source with priority to containers and storages
    findEnergySource: function(creep) {
        // First, try to find a non-empty container or storage
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: s => (s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_STORAGE) &&
                         s.store[RESOURCE_ENERGY] > 0
        });

        if (container) {
            return container;
        }

        // Fallback to the nearest active source if no containers or storages have enough energy
        return creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    }
};

module.exports = roleUpgrader;