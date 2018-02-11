"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send('Hello from Firebase!\n\n');
});
exports.getProfitMonth = functions.database.ref('/{uid}/cash/{year}/{month}').onWrite((event) => {
    return event.data.val();
});
exports.getCashMonth = functions.https.onRequest((request, response) => {
    response.send('cash!\n\n');
});
//# sourceMappingURL=index.js.map