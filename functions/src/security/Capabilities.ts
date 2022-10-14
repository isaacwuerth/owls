import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const capabilitiesUsersUidRoles = "capabilitiesUsers/{uid}";
const firestoreRoles = "capabilitiesRoles/";
const firestoreUserSpecificCapabilities = "capabilitiesUsers/{uid}";
const firestoreUserContext = "userContext/{uid}";

type CRUD = "list" | "get" | "create" | "update" | "delete" | "manage";
type Scope = "all" | "own"

type Capability = {
  action: CRUD;
  subject: string;
  scope?: Scope;
}

const verifyCapability = (capability: Capability) => {
  if (capability.action &&
    !["list", "get", "create", "update", "delete", "manage"]
        .includes(capability.action)) {
    throw new Error(`Invalid capability action: ${capability.action}`);
  }
  if (capability.scope && !["all", "own"].includes(capability.scope)) {
    throw new Error(`Invalid capability scope: ${capability.scope}`);
  }
  if (capability.subject && !capability.subject.length) {
    throw new Error(`Invalid capability subject: ${capability.subject}`);
  }
};

const getRoleCapabilities = (role: string) => {
  return admin.firestore().doc(firestoreRoles + role).get().then((doc) => {
    if (!doc.exists) return [];
    return doc.data()?.capabilities as Capability[] ?? [];
  });
};

const getUserRoles = (uid: string) => {
  return admin.firestore()
      .doc(capabilitiesUsersUidRoles.replace("{uid}", uid))
      .get().then((doc) => {
        if (!doc.exists) return [];
        return doc.data()?.roles as string[] ?? [];
      });
};

const getUserSpecificCapabilities = (uid: string) => {
  return admin.firestore()
      .doc(firestoreUserSpecificCapabilities.replace("{uid}", uid))
      .get().then((doc) => {
        if (!doc.exists) return [];
        return doc.data()?.capabilities as Capability[] ?? [];
      });
};


const factoryCapability = (capability: Capability) => {
  const scope = capability.scope ?? "all";
  return `${capability.subject}:${capability.action}:${scope}`;
};

export const getUserCapabilities = async (uid: string) => {
  const userRoles = await getUserRoles(uid);
  const userSpecific = await getUserSpecificCapabilities(uid);
  const roleCapa = await Promise.all(userRoles.map(getRoleCapabilities));
  userSpecific.forEach((value) => {
    try {
      verifyCapability(value);
    } catch (e) {
      functions.logger.error("Invalid user capability", e, uid, value);
    }
  });
  roleCapa.flat().forEach((value) => {
    try {
      verifyCapability(value);
    } catch (e) {
      functions.logger.error("Invalid role capability", e, uid, value);
    }
  });
  const effectiveCapabilities = [...userSpecific, ...roleCapa.flat()];
  return effectiveCapabilities.map(factoryCapability);
};

export const syncUserCapabilities = async (uid: string) => {
  const capabilities = await getUserCapabilities(uid);
  await admin.auth().setCustomUserClaims(uid, {capabilities});
  await admin.firestore()
      .doc(firestoreUserContext.replace("{uid}", uid))
      .update({lastPermissionUpdate:
          admin.firestore.FieldValue.serverTimestamp()});
};

export const syncAllUsersCapabilities = async () => {
  const users = await admin.auth().listUsers();
  await Promise.all(users.users.map((user) => syncUserCapabilities(user.uid)));
};
