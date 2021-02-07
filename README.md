# MaskPleaseGame
MaskPleaseGame è un'applicazione Android ideata per la prevenzione al contagio da Covid-19, adottando le logiche della Gamification.

<p align="center"><img src="./images/ISISLabHelpDeskLogo.png" width="300"/></p>

MaskPleaseChallenge fornisce le seguenti funzionalità:

- notifica sul cellulare che ricorda di portare la mascherina;
- assegnazione punti reputazione se utente invia foto con mascherina dopo uscita di casa;
- condivisione dei propri punti reputazione con altri utenti;
- visualizzazione del numero di mascherine indossate globalmente.

Questo tutorial ha lo scopo di mostrare come sia possibile sfruttare le potenzialità dei servizi di Azure per sviluppare un'app android.
Il tutorial mostra anche come fare l'host del codice in Azure.

#### Architettura
ladksdpsèdsèflsflsf

#### Struttura del tutorial

* **[Prerequisiti](#prerequisites)**
* **[Installazione](#installation)**
* **[Risorse](#resources)**
* **[Esecuzione](#execution)**

## Prerequisiti
- [An Azure Subscription](https://portal.azure.com/)
- Node.js

## Installazione
Questo tutorial è progettato per essere eseguito su un sistema operativo basato su Linux ma può essere facilmente riprodotto su un sistema Windows con piccole modifiche.
```sh
$ npm install
```

## Risorse
In questa sezione viene proposto un tutorial per la creazione di tutte le risorse Azure richieste, usando il portale di Azure. Al fine di mantenere il costo il più basso possibile verrà scelto il piano gratuito quando disponibile.

**PROMEMORIA** Ogni risorsa su Cloud necessita di un tempo di implementazione che in alcuni casi può essere piuttosto lungo, sii paziente.

### Resource Group
Per prima cosa è necessario un Azure Resource Group, che è abbastanza semplice da creare tramite portale di Azure.
**ATTENZIONE** La regione selezionata deve essere la stessa per tutte le risorse rimanenti.


### Language Understanding
[Language Understanding (LUIS)](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/what-is-luis) is a cloud-based conversational AI service that applies custom machine-learning intelligence to text to predict overall meaning. Using LUIS applications are able to understand what a person wants analyzing inputs provided in natural language.
ISISLabHelpDesk uses LUIS to direct the user to the right functionality based on the input text.
Using the Azure Portal.
1. Create a new resource and using the search bar find 'Language Understanding'.
2. Provide the details for the Subscription, Resource Group and the name. 
3. Choose the location and the 'Princing tier' F0 (Free) for both the resources.
4. Leave all the others fields as default.

When the resource is been correctly deployed go to resource.
1. In the lateral menu choose 'Keys and endpoints' click on 'Show keys'.
2. Copy one the two keys and save it in the file _.env_ in `LuisAPIKey` field.
3. Copy the location and save it in the file _.env_ in `LuisAPIHostName` field. You should get something like `<location>.api.cognitive.microsoft.com`.
4. Based on the chosen region, go to
    * [luis.ai](https://www.luis.ai/) for US;
    * [eu.luis.ai](https://www.eu.luis.ai/) for Europe;
    * [luis.ai](https://www.au.luis.ai/) for Australia,
login with your Azure account and select the newly created Authoring resource.
5. Click on the arrow next to 'New app' and choose 'Import as JSON'. Select the file inside the serviceResources folder.
6. After the creation click on the 'Manage' tab, set the option 'Make endpoints public' on (if it is not), and copy the App ID and save it in the file _.env_ in `LuisAppId` field.
7. Click on 'Train' to train the model and then publish it selecting 'Production Slot'.

### Function App
[Azure Function App](https://docs.microsoft.com/en-us/azure/azure-functions/functions-overview) è il servizio Serverless Computing offerto da Azure che permette di eseguire blocchi di codice denominati <<function>>.
Essendo la nostra architettura di completa natura serverless, utilizziamo 3 functions che gestiscono la logica di back-end.
1. Creare una nuova risorsa utilizzando la barra di ricerca e cercare 'Function App'.
2. Fornire i dettagli per Subscription, Resource Group e nome. 
3. Selezionare Node.js come 'Runtime stack', scegliere la Regione e lasciare i restanti campi come da default.
Quando la risorsa è stata correttamente installata, aprire la risorsa.
1. Nel menu laterale scegliere 'Functions' e creare una nuova function usando il bottone 'Add'.
2. Selezionare il 'Template HTTP trigger' e inserire un nome per la function.
3. Il Portale reindirizzerà automaticamente nella pagina della function , clicca su 'Get Function URL'. copia l' URL e salvalo nel file _.env_ nel campo `FunctionEndpoint`.
4. In the lateral menu of the same page choose 'Code+test', replace the code with the one inside the file sendMailFunction.js in the servicesResources folder and save.
5. Vai su `https://<FunctionAppName>.scm.azurewebsites.net` e scegli 'Debug Console' -> 'CMD'.
```sh
$ cd site/wwwroot
$ npm install nodemailer
```

### Storage Account
[Storage Account](https://docs.microsoft.com/en-us/azure/storage/common/storage-account-overview) è il servizio di Azure che consente di archiviare ogni tipo di oggetto dati. Lo utilizziamo per memorizzare temporaneamente le foto contententi persone che indossano la mascherina.
Utilizzo del portale di Azure:
1. Create a new resource and using the search bar find 'Storage account'.
2. Provide the details for the Subscription, Resource Group, the name and the Location. 
4. Leave the remaining fields as default.
When the resource is been correctly deployed go to resource.
1. In the lateral menu choose 'Access keys' and copy the value of 'Connection string' field and save it in the file _.env_ in `SAConnectionString` field.
2. Insert the Storage account name, located in the left-up corner, in the file _.env_ in `StorageAccountName` field.
3. In the lateral menu choose 'Overview' and click on 'Container', create a new container with the name 'public' and for 'Public access level' select 'Container'.

### Bing Search v7
[Bing Image Search API](https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/overview) is an API that allows to implement a smart image search inside applications providing meaningful results. 
ISISLabHelpDesk uses Bing Image Search to suggest an image to the user in order to be used for the seminar.
Using the Azure Portal.
1. Create a new resource and using the search bar find 'Bing Search v7'.
2. Provide the details for the Subscription, Resource Group, the name and select the Free tier F0 in the 'Pricing tier' field. 
3. Check the box and create.
When the resource is been correctly deployed go to resource.
1. In the lateral menu choose 'Keys and Endpoint', click on 'Show keys'
2. Copy one the two keys and save it in the file _.env_ in `BingImageSearch` field.

### Additional resource: Google API key
The Google API key is a unique identifier needed for authentication purpose.
ISISLabHelpDesk access to a public Google Calendar to retrieve the events so a Google Calendar API is needed.
1. In the [Cloud Console](https://console.developers.google.com/), on the [project selector page](https://console.cloud.google.com/projectselector2/home/dashboard?_ga=2.230502236.1548499487.1607075519-698306279.1605005292), select or create a Google Cloud project for which you want to add an API Key.
2. Go to the 'APIs & Services' -> '[Credentials page](https://console.cloud.google.com/apis/credentials)'.
3. On the Credentials page, click 'Create credentials' -> 'API key'. The API key created dialog displays your newly created API key.
4. Copy the key value and save it in the file _.env_ in `GoogleAPIKey` field.
5. In the [Cloud Console](https://console.developers.google.com/), go to the 'Dashboard' -> 'Enable APIs and services', search for Google Calendar API and enable it.

## Execution
A bot developed with Azure Bot Service can be hosted both on Cloud using Web App service and in local using [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/blob/master/README.md) and [ngrok](https://ngrok.com/). The bot will work in the same way but is clearly better to run the bot in a local environment while testing. If you want to execute ISISLabHelpDesk on Microsoft Teams or on others kind of applications the Cloud Hosting is needed.

***ATTENTION*** All the aforementioned resources are nevertheless necessary to ensure proper operation of ISISLabHelpDesk. The only difference is that in local environment Web App service is not used for hosting so it is not required.

### Local hosting
#### Testing the bot with Bot Framework Emulator
1. Start ngrok
```sh
$ ./ngrok http -host-header=rewrite 3978
```
2. Open a terminal in ISISLabHelpDesk folder and start the bot
```sh
$ npm start
```
3. Start Bot Framework Emulator and select 'Open Bot'.
4. Provide the needed fields
    * Bot URL: `http://localhost:3978/api/messages`
    * Microsoft App ID: present within the file _.env_.
    * Microsoft App password: present within the file _.env_.

#### Testing the bot from Azure Portal
1. Start ngrok 
```sh
$ ./ngrok http -host-header=rewrite 3978
```
2. Open a terminal in ISISLabHelpDesk folder and start the bot
```sh
$ npm start
```
3. Go to the Bot Channels Registration resource using the Azure Portal:
    * In the lateral menu choose 'Channels' and insert as 'Messaging endpoint' the URL showed in terminal by ngrok followed by 'api/messages/". You should get something like `https://1aa1a1234567.ngrok.io/api/messages`.
    * Click on 'Save'.
    * In the lateral menu choose 'Test in Web Chat', the bot will start and be ready to test. All the logs will be available in the system terminal.

### Cloud hosting
#### Deploy the project on Web App
1. Zip up the code directory manually. Make sure that you are in the bot's project folder, the one that contains index.js file. Select **ALL** the files and folders before running the command to create the zip file, make sure to include also the _.env_ file that can be hidden, in this case use CTRL+H to show it. If your root folder location is incorrect, the bot will fail to run in the Azure portal.
2. Open terminal inside the folder
```sh
$ az webapp deployment source config-zip --resource-group "<resource-group-name>" --name "<name-of-web-app>" --src "<project-zip-path>"
```
3. Wait for the deploy, it might take a while.

#### Set the bot to use the Web App
Go to the Bot Channels Registration resource using the Azure Portal.
1. In the lateral menu choose 'Settings' and insert as 'Messaging endpoint' the URL of the Web App resource followed by 'api/messages/'. You should get something like `https://<nomeWebApp>.azurewebsites.net/api/messages`.
2. Click on 'Save'.
Now the bot can be tested using the Web Chat available on Azure Portal goin in the in the lateral menu of the Bot Channels Registration resource and choosing 'Test in Web Chat', the bot will start and be ready to test.

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

