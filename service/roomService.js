const { Room } = require('../models/room');
const ApproveList = require('../models/approve_list');
module.exports = {
    checkHost: async (roomID, userID) => {
        const result = await Room.find({ "_id": roomID, "hostID": userID }).countDocuments();
        console.log(result);

        if (result > 0) {
            return true;
        }
        else {
            return false;
        }
    },
    isJoinRoom: async (roomID,userID) => {
        var result = await Room.aggregate([{ $match: { "member": userID, "hostID": { $ne: userID }, "_id": roomID } }]);
        return result.length == 1 ? true : false;
    },
    getRoomInfo: async (roomID) => {
        //const result = await Room.aggregate([{ $match: { "_id": mongoose.Types.ObjectId(roomID) }, }]);
        const result = await Room.findOne({ "_id": roomID }).lean(true);
        return result;
        
    },
    editRoom: async (hostID, roomID, newData) => {
        // check token for hostID
        try {
             await Room.findOneAndUpdate(
                { "_id": roomID },
                {
                    $set: newData
                },
                { upsert: true, 'new': true });
            return true;
        } catch (error) {
            return false;
        }

    },
    deleteRoom: async (roomID, userID) => {
        // implement check token here
        var result = await Room.deleteOne({ "_id": roomID });
        return result.ok == 1 ? true : false;
    },
    deleteJoinRequest: async (hostID, userID, roomID) => {
        var result = await ApproveList.deleteOne({
            "hostID": hostID, "userID": userID,
            "roomID": roomID
        });
        if (result.ok == 1) return true;
        return false;
    },
    confirmJoinRequest: async (hostID, userID, roomID) => {
        var result = await this.deleteJoinRequest(hostID, userID, roomID);
        if (result.ok == 1) {
            // add user to this room
            await Room.findOneAndUpdate({ "_id": roomID }, { $push: { "member": userID } }).lean(true);
            return true;
        }
        else return false;
    },


}