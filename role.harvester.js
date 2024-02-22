var roleHarvester = {
    run: function(creep) {
        // Check if the creep needs renewing
        if (creep.ticksToLive < 300 && !creep.memory.renewing) { // Threshold of 300 ticks to live
            creep.memory.renewing = true; // Mark the creep as needing renew
            creep.say('⚡ renew');
        } else if (creep.ticksToLive > 1400) { // If the creep is sufficiently renewed
            creep.memory.renewing = false; // No longer needs renewing
        }

        // Handle renewing state
        if (creep.memory.renewing) {
            var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS); // Find the closest spawn
            if (spawn && spawn.renewCreep(creep) === ERR_NOT_IN_RANGE) { // Move to spawn if not in range
                creep.moveTo(spawn, { visualizePathStyle: { stroke: '#99ff99' } }); // Use a different color for renew path
            }
            return; // Skip the rest of the function if renewing
        }

        // Assign a specific source to each harvester based on memory or another logic
        if (!creep.memory.sourceId) {
            var sources = creep.room.find(FIND_SOURCES);
            var sourceIndex = creep.name.charCodeAt(creep.name.length - 1) % sources.length;
            creep.memory.sourceId = sources[sourceIndex].id;
        }

        var source = Game.getObjectById(creep.memory.sourceId);

        if (source) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
                creep.say('🔄 Source');
            } else if (creep.store.getFreeCapacity() == 0) {
                creep.drop(RESOURCE_ENERGY); // Consider dropping at a designated spot or transferring to a container
                creep.say('💧 Drop');
            }
        } else {
            console.log(creep.name + ' could not find their assigned source.');
        }
    }
};

module.exports = roleHarvester;