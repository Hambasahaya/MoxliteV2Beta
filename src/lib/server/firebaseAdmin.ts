import { getAuth } from "firebase-admin/auth";
import { getDataConnect } from "firebase-admin/data-connect";
import type { DataConnect } from "firebase-admin/data-connect";
import {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import type { App, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const parseServiceAccount = (): ServiceAccount | null => {
  const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!rawServiceAccount) {
    return null;
  }

  const serviceAccount = JSON.parse(rawServiceAccount) as ServiceAccount & {
    private_key?: string;
  };

  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  return serviceAccount;
};

export const getFirebaseAdminApp = (): App => {
  if (getApps().length) {
    return getApp();
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const serviceAccount = parseServiceAccount();

  return initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    projectId,
  });
};

export const getFirebaseAdminAuth = () => getAuth(getFirebaseAdminApp());

export const getFirebaseAdminDb = () => getFirestore(getFirebaseAdminApp());

export const isSqlConnectConfigured = () =>
  Boolean(
    process.env.FIREBASE_SQL_CONNECT_LOCATION &&
      process.env.FIREBASE_SQL_CONNECT_SERVICE_ID
  );

export const getFirebaseSqlConnect = (): DataConnect | null => {
  if (!isSqlConnectConfigured()) {
    return null;
  }

  return getDataConnect(
    {
      location: process.env.FIREBASE_SQL_CONNECT_LOCATION as string,
      serviceId: process.env.FIREBASE_SQL_CONNECT_SERVICE_ID as string,
      connector: process.env.FIREBASE_SQL_CONNECT_CONNECTOR || "default",
    },
    getFirebaseAdminApp()
  );
};

export const getActivityTableName = () =>
  process.env.FIREBASE_SQL_CONNECT_ACTIVITY_TABLE || "UserActivity";

export const getActivityQueryField = () =>
  process.env.FIREBASE_SQL_CONNECT_ACTIVITY_QUERY_FIELD || "userActivities";
