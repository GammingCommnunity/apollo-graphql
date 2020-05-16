const roomInput = require('./input/roomInput');
const gameInput = require('./input/gameInput');
const roomChatInput = require('./input/roomChatInput');
const joinRoomInput = require('./input/joinRoomInput');
const privateChatInput = require('./input/privateChatInput');
const { merge } = require('lodash');
module.exports = function () {
    return [
        roomInput, gameInput, roomChatInput, joinRoomInput, privateChatInput
]
}