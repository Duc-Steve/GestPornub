import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.soraBest",
  projectId: "66f33e8b00059b34bec5",
  storageId: "66f344a20025819be952",
  databaseId: "660d14b2b809e838959a",
  userCollectionId: "66f341230027e2b894ef",
  videoCollectionId: "66f341c70036d27b67f3",
};

const client = new Client();
client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Enregistrer un utilisateur
export async function createUser(email, password, username) {
  try {
    // Création d'un nouveau compte
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    // Si le compte n'est pas créé, lever une erreur
    if (!newAccount) throw Error;

    // Récupérer l'URL de l'avatar généré avec les initiales de l'utilisateur
    const avatarUrl = avatars.getInitials(username);

    // Connexion automatique après la création du compte
    await signIn(email, password);

    // Création d'un document utilisateur dans la base de données
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id, // Identifiant du compte
        email: email,              // Adresse email
        username: username,        // Nom d'utilisateur
        avatar: avatarUrl,         // URL de l'avatar
      }
    );

    return newUser;
  } catch (error) {
    throw new Error("Erreur lors de la création de l'utilisateur");
  }
}

// Connexion
export async function signIn(email, password) {
  try {
    // Création d'une session pour l'utilisateur
    const session = await account.createEmailSession(email, password);

    return session;
  } catch (error) {
    throw new Error("Erreur lors de la connexion");
  }
}

// Récupérer le compte actuel
export async function getAccount() {
  try {
    // Récupération des informations du compte actuellement connecté
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error("Erreur lors de la récupération du compte");
  }
}

// Récupérer l'utilisateur actuel
export async function getCurrentUser() {
  try {
    // Récupérer le compte actuel
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    // Rechercher l'utilisateur correspondant au compte
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;  // Retourne null en cas d'erreur
  }
}

// Déconnexion
export async function signOut() {
  try {
    // Suppression de la session courante (déconnexion)
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw new Error("Erreur lors de la déconnexion");
  }
}

// Télécharger un fichier
export async function uploadFile(file, type) {
  if (!file) return;

  // Extraction du type MIME du fichier
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    // Téléchargement du fichier sur le serveur
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    // Récupération de l'URL d'aperçu du fichier téléchargé
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error("Erreur lors du téléchargement du fichier");
  }
}



// Récupérer l'aperçu d'un fichier
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    // Si le fichier est une vidéo
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    // Si le fichier est une image
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,   // Largeur maximale
        2000,   // Hauteur maximale
        "top",  // Position de l'aperçu
        100     // Qualité de l'aperçu
      );
    // Si le type de fichier n'est pas pris en charge
    } else {
      throw new Error("Type de fichier invalide");
    }

    // Vérifier si l'URL du fichier a bien été récupérée
    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error("Erreur lors de la récupération de l'aperçu du fichier");
  }
}

// Créer un post vidéo
export async function createVideoPost(form) {
  try {
    // Téléchargement de l'image miniature et de la vidéo en parallèle
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    // Création d'un nouveau document dans la collection vidéo
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      ID.unique(),
      {
        title: form.title,            // Titre de la vidéo
        thumbnail: thumbnailUrl,      // URL de la miniature
        video: videoUrl,              // URL de la vidéo
        prompt: form.prompt,          // Description ou prompt
        creator: form.userId,         // Identifiant du créateur
      }
    );

    return newPost;
  } catch (error) {
    throw new Error("Erreur lors de la création du post vidéo");
  }
}

// Récupérer tous les posts vidéo
export async function getAllPosts() {
  try {
    // Liste tous les documents de la collection vidéo
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId
    );

    return posts.documents;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des posts vidéo");
  }
}

// Récupérer les posts vidéo créés par un utilisateur spécifique
export async function getUserPosts(userId) {
  try {
    // Liste tous les documents dont le champ "creator" correspond à l'identifiant de l'utilisateur
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error("Erreur lors de la récupération des posts de l'utilisateur");
  }
}

// Rechercher des posts vidéo qui correspondent à une requête
export async function searchPosts(query) {
  try {
    // Recherche de documents dont le champ "title" correspond à la requête
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.search("title", query)]
    );

    // Si aucun post n'est trouvé
    if (!posts) throw new Error("Une erreur est survenue");

    return posts.documents;
  } catch (error) {
    throw new Error("Erreur lors de la recherche de posts vidéo");
  }
}

// Get latest created video posts
export async function getLatestPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}
