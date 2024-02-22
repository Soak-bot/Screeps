const dynamicManagement = require('dynamic.management');

function autoSpawnCreeps() {
    const spawn = Game.spawns['Spawn1'];
    if (spawn.spawning) return;

    const roles = ['harvester', 'hauler', 'upgrader', 'builder', 'repairer', 'defender'];
    const bodyConfigs = dynamicManagement.getBodyConfigs(spawn);
    const desiredCounts = dynamicManagement.getDesiredCounts();

    for (let role of roles) {
        const currentCount = _.filter(Game.creeps, (creep) => creep.memory.role === role).length;
        if (currentCount < desiredCounts[role]) {
            const newName = `${role}${Game.time}`;
            const result = spawn.spawnCreep(bodyConfigs[role], newName, { memory: { role: role } });

            if (result === OK) {
                console.log(`Spawning new ${role}: ${newName}`);
                break; // Ensure only one creep is spawned per tick
            }
        }
    }
}


module.exports = autoSpawnCreeps;