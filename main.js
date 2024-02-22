// Role modules
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleHauler = require('role.hauler');
const roleDefender = require('role.defender');

// Utility modules
const autoSpawnCreeps = require('auto.spawner');
const dynamicManagement = require('dynamic.management');
const totalEnergy = require('total.energy');

module.exports.loop = function () {
    
    // Clear memory of dead creeps
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            console.log(`Clearing non-existing creep memory: ${name}`);
            delete Memory.creeps[name];
        }
    }

for (const [id, siteInfo] of Object.entries(Memory.constructionSites)) {
    const site = Game.getObjectById(id);
    if (!site) {
        // Site might be completed or no longer visible
        delete Memory.constructionSites[id];
        continue;
    }
    //Log site information
    console.log(`Construction Site: ${id}, Type: ${siteInfo.type}, Position: ${siteInfo.pos.x},${siteInfo.pos.y}`);
    }


    // Update dynamic counts and other adaptive strategies
    dynamicManagement.updateDefenderCount()

    // Auto-spawning creeps based on dynamically adjusted counts
    autoSpawnCreeps(dynamicManagement.getDesiredCounts());

     // Display total *spawn* energy for the room
    totalEnergy.displayRoomEnergyTotal('E58S54');

    // Creep role management
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;
            case 'builder':
                roleBuilder.run(creep);
                break;
            case 'defender':
                roleDefender.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'hauler':
                roleHauler.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            default:
                console.log(`Unhandled role for creep ${name}: ${creep.memory.role}`);
        }
    }
};