const dynamicManagement = {
    desiredCounts: {
        'harvester': 3,
        'builder': 5,
        'repairer': 1,
        'upgrader': 5,
        'hauler': 5,
        // 'defender' count will be dynamically updated
    },

    updateDefenderCount: function() {
        const hostiles = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS);
        const threatLevel = hostiles.length;
        this.desiredCounts['defender'] = Math.min(3, threatLevel); // Cap defenders at 3
    },

    getDesiredCounts: function() {
        return this.desiredCounts;
    },

    canSpawnLargerCreeps: function(spawn) {
        return spawn.room.energyCapacityAvailable >= 800; // Adjusted for 800 energy
    },

    getBodyConfigs: function(spawn) {
        const shouldSpawnMinimal = !this.canSpawnLargerCreeps(spawn);

        // Adjusted body parts for larger creeps with 800 energy
        return {
            harvester: shouldSpawnMinimal ? [WORK, CARRY, MOVE] : [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
            hauler: shouldSpawnMinimal ? [CARRY, MOVE] : [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            upgrader: shouldSpawnMinimal ? [WORK, CARRY, MOVE] : [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            builder: shouldSpawnMinimal ? [WORK, CARRY, MOVE] : [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            repairer: shouldSpawnMinimal ? [WORK, CARRY, MOVE] : [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
            defender: shouldSpawnMinimal ? [TOUGH, MOVE, ATTACK, MOVE] : [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE],
        };
    },
};

module.exports = dynamicManagement;