const roleRepairer = require('role.repairer');

var roleBuilder = {
    run: function(creep) {
        // Determine whether to build or fetch energy based on current state and energy levels
        this.updateBuilderState(creep);

        if (creep.memory.building) {
            this.buildConstructionSite(creep);
        } else {
            this.collectEnergy(creep);
        }
    },

    updateBuilderState: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            // Switch to fetching energy when out of energy
            creep.memory.building = false;
            creep.say('🔄 fetch');
        } else if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            // Switch to building when energy is full
            creep.memory.building = true;
            creep.say('🚧 build');
        }
    },

    buildConstructionSite: function(creep) {
        // Assign a construction site if none is assigned or the previous one is completed
        if (!creep.memory.constructionSite || !Game.getObjectById(creep.memory.constructionSite)) {
            this.assignConstructionSite(creep);
        }

        var site = Game.getObjectById(creep.memory.constructionSite);
        if (site) {
            if (creep.build(site) === ERR_NOT_IN_RANGE) {
                creep.moveTo(site, { visualizePathStyle: { stroke: '#ffffff' }, reusePath: 10 });
            }
        } else {
            // Log for debugging purposes
            console.log(`${creep.name} found no valid construction sites.`);
        }
    },

    assignConstructionSite: function(creep) {
        var sites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (sites.length) {
            // Prioritize sites by type and then choose the closest one
            var priorityTypes = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_ROAD];
            var assignedSite = null;

            for (let type of priorityTypes) {
                var filteredSites = sites.filter(site => site.structureType === type);
                if (filteredSites.length > 0) {
                    assignedSite = creep.pos.findClosestByPath(filteredSites);
                    break;
                }
            }

            // If no priority site is found, assign the closest site of any type
            if (!assignedSite) {
                assignedSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            }

            if (assignedSite) {
                creep.memory.constructionSite = assignedSite.id;
            }
        }
    },

    collectEnergy: function(creep) {
        // Prioritize collecting from containers, then storages, then sources
        var sources = creep.room.find(FIND_STRUCTURES, {
            filter: structure => (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
                                  structure.store[RESOURCE_ENERGY] > 0
        });

        if (sources.length === 0) {
            sources = creep.room.find(FIND_SOURCES_ACTIVE);
        }

        if (sources.length > 0) {
            var source = creep.pos.findClosestByPath(sources);
            if (source instanceof Source) {
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 10 });
                }
            } else {
                if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 10 });
                }
            }
        } else {
            roleRepairer.run(creep); // Fallback to repair role
            console.log(`${creep.name} found no energy sources.`);
        }
    }
};

module.exports = roleBuilder;