import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: 'co.edu.sena',
    projectId: '66c4e8a3000680ba52ba',
    databaseId: '66c4ed29000bce5d8d8f',
    userCollectionId: '66c4ed9c0009a622f0a6',
    videoCollectionId: '66c4ede100171e55b198',
    storageId: '66c4f1c9002e161d755d'
}

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) 
    .setProject(config.projectId)
    .setPlatform(config.platform)


    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);
    const storage = new Storage(client);


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
        logoutUser();
        const session = await account.createEmailPasswordSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const logoutUser = async () => {
  try {
    const session = await account.deleteSession('current')
    return session;
  } catch (error) {
    throw new Error(error)
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

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [Query.orderDesc('$createdAt', Query.limit(7))]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("videotitle", query),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const savedPosts = async (userId) => {
   try {
     const posts = await databases.listDocuments(
       databaseId,
       videoCollectionId,
       [Query.search("users", userId)]
     );

     return posts.documents;
   } catch (error) {
     throw new Error(error);
   }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl

  try {
    if(type === 'video'){
      fileUrl = storage.getFileView(storageId, fileId)
    } else if(type === 'image'){
      fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
    } else {
      throw Error('Invalid file type')
    }

    if(!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error)
  }
}

export const uploadFile = async (file, type) => {
  if(!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };
  
  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error)
  }
}

export const createVideo = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, 'image'),
      uploadFile(form.video, 'video'),
    ])

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        videotitle: form.title,
        videothumbnail: thumbnailUrl,
        video: videoUrl,
        videoprompt: form.prompt,
        creator: form.userId
      }
    )

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}