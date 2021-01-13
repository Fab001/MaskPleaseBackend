// Autenticazione computer vision
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
const keyV = '';
const endpointV = 'https://visionmaskplease.cognitiveservices.azure.com/';
const computerVisionClient = new ComputerVisionClient(new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': keyV } }), endpointV);


//Autenticazione Coda
const { QueueServiceClient } = require("@azure/storage-queue");
const connStr = "";
const queueServiceClient = QueueServiceClient.fromConnectionString(connStr);
const queueName = "codamaskplease";


//Autenticazione CosmosDB
const { CosmosClient } = require("@azure/cosmos");
const endpoint = "https://cosmosmask.documents.azure.com:443/";
const key = "";
const clientDB = new CosmosClient({ endpoint, key });


//Creazione coda per user
async function createCoda(path, context){
        context.log("Path della foto: "+path);      
        let idcoda = path.match(/[^\/?#]+(?=$|[?#])/)[0];
        context.log("Id della coda creata: "+idcoda);     
        const queueClient = queueServiceClient.getQueueClient(idcoda);
        const createQueueResponse = await queueClient.create();
        return queueClient;
}

//Update cosmosDB
async function updateCosmos(container){
    var d = new Date();
    var today = new Date().toISOString().slice(0, 10);

    var queri = "SELECT * FROM c WHERE c.date = '"+today+"'";

    const { resources } = await container.items.query(queri).fetchAll();

    if(resources.length == 0){
         const ogg = {date: today, numMask: 1};
         container.items.create(ogg);
    
    }else{
        for (const o of resources) {
            o.numMask = o.numMask + 1;
            const { resource: updatedItem } = await container.item(o.id, o.date).replace(o);
        }
    }
}


module.exports = async function (context, myBlob) {
   context.log('FUNZIONE HUB');

   const UrlDaAnalizzare = "https://maskpleasestorage.blob.core.windows.net/"+context.bindingData.blobTrigger;

    // SETTING COSMOS DB
    const { database } = await clientDB.databases.createIfNotExists({ id: "DBmaskplease" });
    context.log(database.id);
    const { container } = await database.containers.createIfNotExists({ id: "MaskXday" });
    context.log(container.id);


    //COMPUTER VISION
    context.log('Analisi URL immagine da descrivere ...');
    const caption = (await computerVisionClient.describeImage(UrlDaAnalizzare)).captions[0];
    context.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
    var descr = caption.text;
    var check = descr.includes("mask");


    //Crea coda per utente
     const queueClient = await createCoda(context.bindingData.blobTrigger, context); 

    if(check){
        context.log("MASCHERINA OK");
        // Invio messaggio alla coda
        await queueClient.sendMessage("Mascherina OK");

        //Update CosmosDB
        await updateCosmos(container);
    
    }
    else {
        context.log("Mascherina non trovata :(");
        // Invio messaggio alla coda
        await queueClient.sendMessage("Mascherina non trovata :(");
        
        }



};