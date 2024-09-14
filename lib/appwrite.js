import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

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
    const avatars = new Avatars(client);
    const databases = new Databases(client);

    export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        const newUser = await databases.createDocument(
          config.databaseId,
          config.userCollectionId,
          ID.unique(),
          { 
            accountId: newAccount.$id, 
            useremail: email,
            username,
            useravatar: avatarUrl
          }
        )

        return newUser; 
    } catch (error) {
        console.log(error)
        throw new Error(error);
    }
}

export const signIn = async (email, password) => {
    try {
        await logoutUser();
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

const logoutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error(error);
  }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get(); 

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0]
    } catch (error) {
        console.log(error);
    }
}
