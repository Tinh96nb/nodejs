var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "tinhpham") {
    console.log("Kết nối ok");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    
    console.error("Lỗi kết nối");
    res.sendStatus(403);          
  }  
});
router.post('/', function (req, res) {
  var data = req.body;

  // Make sure this is a page subscription
  if (data.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else {
          console.log("Lỗi nhận tin: ", event);
        }
      });
    });

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know
    // you've successfully received the callback. Otherwise, the request
    // will time out and we will keep trying to resend.
    res.sendStatus(200);
  }
});
  
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Tin nhắn từ %d tới %d lúc %d .", senderID, recipientID, timeOfMessage);
  console.log("Block tn: " +JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches a keyword
    // and send back the example. Otherwise, just echo the text we received.
    switch (messageText) {
      case 'generic':
        sendGenericMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}
function sendGenericMessage(recipientId, messageText) {
  // To be expanded in later sections
}
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: "OK.can I help you?",
    }
  };
  console.log("dang xu ly gui di tin nhan");
  callSendAPI(messageData);
}
function callSendAPI(messageData) {
  console.log("dang gui");
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: "EAAMRrxw2tPgBAJIIXrC7hT5xRZC7nk2913WtJ7hqhuyB1vMInafyKafzyexkhYq8Ss8SiS8A51Lrqke1OjFxTcPfvqGaqrCJ3k3yLgxv04S6ZABx9I6ZCvmd67ZAP5uUDWxYoLAqU3d8RIkkK19bN5PrrtZCwpU1jR5nvbmOOMQZDZD" },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Gui thanh cong message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}
module.exports = router;
