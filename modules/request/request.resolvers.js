const ApproveList = require('../../models/approve_list');
const { checkRequestExist, addApprove } = require('../../service/requestService');
const { onError, onSuccess } = require('../../src/error_handle');
const { getUserID } = require('../../src/util');
const {deleteRequest,acceptRequest}= require('../../service/roomService');
module.exports = resolvers = {
    Query: {
        // show ra nhung phong host ma co thanh vien cho 
        manageRequestJoin_Host: async (root, { }, context) => {
            var accountID = getUserID(context);
            return ApproveList.aggregate([{ $match: { "hostID": accountID } }]).then((v) => {
                return v;
            });

        },
        // show ra nhung phong user dang cho duoc duyet 
        getPendingJoinRoom_User: async (root, { userID }, context) => {
            var accountID = getUserID(context);

            return ApproveList.aggregate([{ $match: { "userID": accountID } }]).then((v) => {
                return v;
            })
        },
    },
    Mutation: {
        acceptUserRequest: async (_, { requestID, roomID }, context) => {
            var accountID = getUserID(context);
            var result = await acceptRequest(accountID, requestID, roomID);

            if (result) {
                return onSuccess("OK")
            }
            else return onError("fail", "Has error, try again")
        },
        cancelRequest: async (_, {roomID,requestID},context) => {
            var accountID = getUserID(context);

            var result = await deleteRequest(accountID,roomID,requestID);
            return result ? onSuccess("Cancel success") : onError("fail", "Has error");
        },

    }

}