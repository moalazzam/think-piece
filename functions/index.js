const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const firestore = admin.firestore();

exports.helloWorld = functions
  .region('europe-west1')
  .https.onRequest((request, response) => {
    functions.logger.info('Hello logs!', { structuredData: true });
    response.send('Hello from Firebase!');
  });

exports.getAllPosts = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    const snapshot = await firestore.collection('posts').get();
    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    response.json({ posts });
  });

exports.sanitizeContent = functions
  .region('europe-west1')
  .firestore.document('posts/{postId}')
  .onWrite(async (change) => {
    if (!change.after.exists) return;

    const { content, sanitized } = change.after.data();

    if (content && !sanitized) {
      return change.after.ref.update({
        content: content.replace(/CoffeeScript/g, '**********'),
        sanitized: true,
      });
    }

    return null;
  });

exports.incrementCommentCount = functions
  .region('europe-west1')
  .firestore.document('posts/{postId}/comments/{commentId}')
  .onCreate(async (snapshot, context) => {
    const { postId } = context.params;
    const postRef = firestore.doc(`posts/${postId}`);

    const snap = await postRef.get('comments');
    const comments = snap.get('comments');

    return postRef.update({ comments: comments + 1 });
  });
