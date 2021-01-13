//CosmosDB
const { CosmosClient } = require("@azure/cosmos");
const endpoint = "https://cosmosmask.documents.azure.com:443/";
const key = "";
const clientDB = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    //CosmosDB
    const { database } = await clientDB.databases.createIfNotExists({ id: "DBmaskplease" });
    context.log(database.id);
    const { container } = await database.containers.createIfNotExists({ id: "MaskXday" });
    context.log(container.id);

    var d = new Date();
    var today = new Date().toISOString().slice(0, 10);

    
    var queri = "SELECT * FROM c WHERE c.date = '"+today+"'";
    context.log(queri);

    const { resources } = await container.items
    .query(queri)
    .fetchAll();

    if(resources.length == 0){
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: 0
        };
    }else{
        for (const o of resources) {
            context.log(`${o.id},${o.numMask}, ${o.date} pescato `);
            context.res = {
                status: 200, /* Defaults to 200 */
                body: o.numMask
            };
            break;

        }
    }




}