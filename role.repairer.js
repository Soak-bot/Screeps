var roleHarvester = require('role.harvester');

var roleRepairer = {
    run: function(creep) {
        if (creep.store.getFreeCapacity() > 0) {
            var source = creep.pos.findClosestByPath(FIND_SOURCES); // Find the closest source for efficiency
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 50 }); // Use reusePath for efficiency
            }
        } else {
            var repairTargets = this.findRepairTargets(creep);
            if (repairTargets.length > 0) {
                if (creep.repair(repairTargets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTargets[0], { visualizePathStyle: { stroke: '#ffffff' }, reusePath: 50 }); // Use reusePath for efficiency
                }
            } else {
                roleHarvester.run(creep); // Fallback to harvester role
            }
        }
    },

    findRepairTargets: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => (structure.hits < structure.hitsMax && structure.hits > 0) &&
                                   (structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) ||
                                   (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) &&
                                   structure.hits < structure.hitsMax && structure.hits > 0
        });

        // Prioritize critical repairs first, then general, then defensive without sorting the entire array
        var criticalRepairs = targets.filter(structure => structure.hits < 650);
        var nonDefensiveRepairs = targets.filter(structure => !criticalRepairs.includes(structure) &&
                                                              structure.structureType != STRUCTURE_WALL &&
                                                              structure.structureType != STRUCTURE_RAMPART);
        var defensiveRepairs = targets.filter(structure => !criticalRepairs.includes(structure) &&
                                                           !nonDefensiveRepairs.includes(structure));

        return [...criticalRepairs, ...nonDefensiveRepairs, ...defensiveRepairs]; // Combine the filtered lists
    }
};

module.exports = roleRepairer;
