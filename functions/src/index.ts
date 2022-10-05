import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {syncAllUsersCapabilities} from "./security/Capabilities";


admin.initializeApp(functions.config().firebase);

export const userCapabilities = functions.firestore
    .document("capabilitiesUsers/{userId}")
    .onWrite(() => {
      return syncAllUsersCapabilities();
    });

export const rolesCapabilities = functions.firestore
    .document("capabilitiesRoles/{role}")
    .onWrite(async () => {
      return syncAllUsersCapabilities();
    });

export const newUser = functions.auth.user().onCreate((user) => {
  admin.auth()
      .setCustomUserClaims(user.uid, {capabilities: []});
});

export const userDeleted = functions.auth.user()
    .onDelete((user) => {
      admin.firestore().doc(`capabilities/users/${user.uid}`).delete();
    });
