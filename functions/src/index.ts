import * as functions from 'firebase-functions'

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!\n\n');
});

export const getProfitMonth = functions.database.ref('/{uid}/cash/{year}/{month}').onWrite((event) => {
  return event.data.val();
});

export const getCashMonth = functions.https.onRequest((request, response) => {
  response.send('cash!\n\n');
});
