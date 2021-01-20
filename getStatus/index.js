const { QueueServiceClient } = require("@azure/storage-queue");
const connStr = "";
const queueServiceClient = QueueServiceClient.fromConnectionString(connStr);


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const idreq = (req.query.idreq || (req.body && req.body.idreq));
    context.log('Token ricevuto: '+idreq);


    const queueName = idreq;

    // Verifica messaggi in coda
    try{
        const queueClient = queueServiceClient.getQueueClient(queueName);
        const response = await queueClient.receiveMessages();
        
        if (response.receivedMessageItems.length == 1) {
            const receivedMessageItem = response.receivedMessageItems[0];
            context.log(`Processing & deleting message with content: ${receivedMessageItem.messageText}`);
            
           let isMask = 300;
            if(receivedMessageItem.messageText == "Mascherina non trovata :(") isMask = 200;
            if(receivedMessageItem.messageText == "Mascherina OK") isMask = 201;

            const deleteMessageResponse = await queueClient.deleteMessage(
            receivedMessageItem.messageId,
            receivedMessageItem.popReceipt
            );
            context.log(
            `Delete message successfully, service assigned request Id: ${deleteMessageResponse.requestId}`
            );

            context.res = {
                status: isMask,
                body: receivedMessageItem.messageText
            };

        }
            //elimina la coda
            await queueClient.delete();


    }
    catch(err) {
        context.res = {
            status: 300,
            body: "Riprova più tardi .. (o errore)"
        };
    }

}
