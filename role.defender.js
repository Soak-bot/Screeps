var roleDefender = {
    /** @param {Creep} creep **/
    run: function(creep) {
        var hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (hostile) {
            if (creep.attack(hostile) == ERR_NOT_IN_RANGE) {
                creep.moveTo(hostile);
            }
        } else {
            // Move to a designated standby position if no hostiles are present
            creep.moveTo(Game.flags.DefenderStandby);
        }
    }
};

module.exports = roleDefender;