# MaskPleaseGame
MaskPleaseGame è un'applicazione Android ideata per la prevenzione al contagio da Covid-19, adottando le logiche della Gamification.

<p align="center"><img src="./img/photo5837097972922430795.jpg" width="300"/></p>

MaskPleaseGame fornisce le seguenti funzionalità:

- notifica sul cellulare che ricorda di portare la mascherina dopo uscita di casa;
- assegnazione punti reputazione se utente invia foto con mascherina dopo uscita di casa;
- condivisione dei propri punti reputazione con altri utenti;
- visualizzazione del numero di mascherine indossate globalmente.

## Architettura
La seguente figura mostra l'architettura adottata:
<p align="center"><img src="./img/photo5834781246088131707.jpg" width="650" eigth="650"/></p>


Questo tutorial ha lo scopo di mostrare come sia possibile sfruttare le potenzialità dei servizi di Azure per sviluppare un'app android.
Il tutorial mostra anche come fare l'host del codice in Azure.
#### Struttura del tutorial

* **[Prerequisiti](#prerequisites)**
* **[Configurazione risorse](#resources)**
* **[Esecuzione](#execution)**

## Prerequisiti
- [An Azure Subscription](https://portal.azure.com/)
- Node.js


## Configurazione risorse
In questa sezione viene proposto un tutorial per la creazione di tutte le risorse Azure richieste, usando il portale di Azure. Al fine di mantenere il costo il più basso possibile verrà scelto il piano gratuito quando disponibile.

**PROMEMORIA** Ogni risorsa su Cloud necessita di un tempo di implementazione che in alcuni casi può essere piuttosto lungo, sii paziente.

### Resource Group
Per prima cosa è necessario un Azure Resource Group, che è abbastanza semplice da creare tramite portale di Azure.
**ATTENZIONE** La regione selezionata deve essere la stessa per tutte le risorse rimanenti.


### Storage Account
[Storage Account](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview) è il servizio di Azure che consente di archiviare ogni tipo di oggetto dati. Lo utilizziamo per memorizzare temporaneamente le foto contententi persone che indossano la mascherina.
Utilizzo del portale di Azure:
1. Creare una nuova risorsa urilizzando la barra di ricerca e cercare 'Storage account'.
2. Fornire i dettagli per Subscription, Resource Group, nome e Location. 
4. Lasciare i campi rimanenti come da default.
Quando la risorsa è correttamente installata, andare alla risorsa.
1. Nel menu laterale scegliere 'Access keys' e copiare il campo 'Connection string' salvandolo nel file _.env_ nel campo `SAConnectionString`.
2. Inserire il nome dello Storage account, situato nell'angolo in alto a sinistra, nel file _.env_ nel campo `StorageAccountName`.
3. Nel menu laterale scegliere 'Overview' e cliccare su 'Container', creare un nuovo Container con il nome 'public' e per 'Public access level' selezionare 'Container'.

### Cognitive Services
[Cognitive Services](https://docs.microsoft.com/en-us/azure/cognitive-services/what-are-cognitive-services) è un servizio di Azure che consente di integrare intelligenza cognitiva all'interno di un'applicazione. Nello sviluppo di questa applicazione vengono utilizzati i seguenti Azure Cognitive Services di tipo Vision: 
-Computer Vision
-Face
Utilizzo del portale di Azure:
1. Creare una nuova risorsa urilizzando la barra di ricerca e cercare 'Storage account'.

### Cosmos DB
[CosmosDB](https://docs.microsoft.com/en-us/azure/cosmos-db/introduction) è un database NoSQL offerto dai servizi Azure per 
-Computer Vision
-Face
Utilizzo del portale di Azure:
1. Creare una nuova risorsa utilizzando la barra di ricerca e cercare 'Storage account'.

### Function App
[Azure Function App](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) è il servizio Serverless Computing offerto da Azure che permette di eseguire blocchi di codice denominati <<function>>.
Essendo la nostra architettura di completa natura serverless, utilizziamo 3 functions che gestiscono la logica di back-end.
1. Creare una nuova risorsa utilizzando la barra di ricerca e cercare 'Function App'.
2. Fornire i dettagli per Subscription, Resource Group e nome. 
3. Selezionare Node.js come 'Runtime stack', scegliere la Regione e lasciare i restanti campi come da default.
Quando la risorsa è stata correttamente installata, aprire la risorsa.
1. Nel menu laterale scegliere 'Functions' e creare una nuova function usando il bottone 'Add'.
2. Selezionare il 'Template Blob trigger' e inserire un nome per la function.
3. Nel menu laterale della stessa pagina scegliere 'Code+test', sostituire il codice con quello all'interno del file index.js all'interno della cartella BlobTrigger1.
4. Selezionare i template HttpTrigger sia per getStatus che per GetNumMask e ripetere come nel passo precedente.
5. Nel menu della risorsa Function App, dirigersi in Settings > Configuration e creare le application Settings come nella figura seguente, accoppiando ai seguenti nomi le relative keys ed endpoint delle risorse create in precedenza.
6. Sempre menu laterale della Function App, cliccare su Development Tools > Advanced Tool. 
7. Aprire la Power Shell di Kudu e sostiture il contenuto di C:\home\site\wwwroot\package.json con quello di package.json di questo repository.
9. Eseguire dalla Power Shell "npm install"

<p align="center"><img src="./img/photo5834781246088131707.jpg" width="650" eigth="650"/></p>

#### Esecuzione
1. Zip up the code directory manually. Make sure that you are in the bot's project folder, the one that contains index.js file. Select **ALL** the files and folders before running the command to create the zip file, make sure to include also the _.env_ file that can be hidden, in this case use CTRL+H to show it. If your root folder location is incorrect, the bot will fail to run in the Azure portal.
2. Open terminal inside the folder
```sh
$ az webapp deployment source config-zip --resource-group "<resource-group-name>" --name "<name-of-web-app>" --src "<project-zip-path>"
```
3. Wait for the deploy, it might take a while.

#### [Deploy on Microsoft Teams](https://docs.microsoft.com/en-us/azure/bot-service/channel-connect-teams?view=azure-bot-service-4.0)
Go to the Bot Channels Registration resource using the Azure Portal.
1. In the lateral menu choose 'Channels'.
2. Select the Microsoft Teams icon in 'Add a feature channel' section to create a new channels for Microsoft Teams.
3. Close the created channel and return in 'Channels' page. Click on 'Microsoft Teams', that will open a conversation with the bot inside Microsoft Teams app.
**The might take a while to be ready**

**Authors**
ISISLab - Università degli Studi di Salerno
- Pierluigi Liguori
- Fabiano Priore

