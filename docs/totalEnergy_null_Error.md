ControllerExtension
    onWork()
        stateScanner() # __CURRECT__
            countEnergyChangeRatio(this.room, withLimit: __false__)
                structureEnergy # __CURRECT__
                droppedEnergy # _NON_CURRECT_
            setRoomStats(roomName: this.room.name, stats) # __CURRECT__
                structureScanner() # __CURRECT__
        adjustCreep() # __CURRECT__
            changeBaseUnit(type="manager", adjust=this.room.transport.getExpect())} # __CURRECT__
                addTask(name: creepName, role: type, data: { workRoom: room.name, bodyType }) # __NO_RELATED__
                removeCreep(GetName[type](room.name, i)) # __NO_RELATED__
            countEnergyChangeRatio(room: this.room, withLimit: __true__)
                structureEnergy # __NON_CURRECT__
                    amountWithLimit = energyAmount - ENERGY_USE_LIMIT[structure.structureType];
                    {totalEnergy: 0, structureEnergy: 0} # __ERROR__
