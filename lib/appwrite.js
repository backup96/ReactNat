import { Account, Client, ID } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'co.edu.sena',
    projectId: '66c4e8a3000680ba52ba',
    databaseId: '66c4ed29000bce5d8d8f',
    userCollectionId: '66c4ed9c0009a622f0a6',
    videoCollectionId: '66c4ede100171e55b198',
    storageId: '66c4f1c9002e161d755d'
}
    
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId)
    .setPlatform(config.platform)


    const account = new Account(client);

    export const createUser = () => {
    account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
    .then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });
}


