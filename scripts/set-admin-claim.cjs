/**
 * ==============================================================================
 * AR Jishan Digital School & College - Secure Firebase Admin Claim Tool
 * ==============================================================================
 * This is a trusted server-side CLI tool using the Firebase Admin SDK.
 * It assigns cryptographically signed custom claims to Firebase Authentication users.
 * 
 * NEVER import this file or the Firebase Service Account key in client-side code!
 * 
 * Usage:
 *   node scripts/set-admin-claim.cjs set <email-or-uid> [role]
 *   node scripts/set-admin-claim.cjs get <email-or-uid>
 *   node scripts/set-admin-claim.cjs revoke <email-or-uid>
 *   node scripts/set-admin-claim.cjs list
 * 
 * Examples:
 *   node scripts/set-admin-claim.cjs set admin@arjishandigitalschool.edu.bd school_admin
 *   node scripts/set-admin-claim.cjs get admin@arjishandigitalschool.edu.bd
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Resolve Service Account Key
function initFirebaseAdmin() {
  if (admin.apps.length > 0) return admin.app();

  const keyPathFromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const keyJsonFromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const localKeyPath = path.resolve(process.cwd(), 'serviceAccountKey.json');

  let serviceAccount = null;

  if (keyPathFromEnv && fs.existsSync(keyPathFromEnv)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(keyPathFromEnv, 'utf8'));
      console.log(`[Firebase Admin] Loaded service account from ${keyPathFromEnv}`);
    } catch (e) {
      console.error(`[Firebase Admin] Failed to parse key from ${keyPathFromEnv}:`, e.message);
    }
  } else if (keyJsonFromEnv) {
    try {
      serviceAccount = JSON.parse(keyJsonFromEnv);
      console.log('[Firebase Admin] Loaded service account from FIREBASE_SERVICE_ACCOUNT_KEY env');
    } catch (e) {
      console.error('[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e.message);
    }
  } else if (fs.existsSync(localKeyPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
      console.log(`[Firebase Admin] Loaded service account from local serviceAccountKey.json`);
    } catch (e) {
      console.error(`[Firebase Admin] Failed to parse local serviceAccountKey.json:`, e.message);
    }
  }

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id || 'digital-ai-school-ea91f'
    });
    return admin.app();
  }

  // Fallback: Check if application default credentials exist
  try {
    admin.initializeApp({
      projectId: 'digital-ai-school-ea91f'
    });
    console.log('[Firebase Admin] Initialized with Google Application Default Credentials');
    return admin.app();
  } catch (err) {
    console.warn('\n==============================================================================');
    console.warn('⚠️  NOTICE: FIREBASE SERVICE ACCOUNT KEY NOT FOUND');
    console.warn('==============================================================================');
    console.warn('To assign claims to real Firebase users in your Firebase project (digital-ai-school-ea91f):');
    console.warn('1. Open Firebase Console: https://console.firebase.google.com/project/digital-ai-school-ea91f/settings/serviceaccounts/adminsdk');
    console.warn('2. Click "Generate new private key".');
    console.warn('3. Save the downloaded JSON file as "serviceAccountKey.json" in this project directory:');
    console.warn(`   ${localKeyPath}`);
    console.warn('4. (Note: serviceAccountKey.json is already excluded in .gitignore for security).');
    console.warn('==============================================================================\n');
    return null;
  }
}

// Find user by email or UID
async function resolveUser(identifier) {
  try {
    if (identifier.includes('@')) {
      return await admin.auth().getUserByEmail(identifier.trim());
    } else {
      return await admin.auth().getUser(identifier.trim());
    }
  } catch (e) {
    if (e.code === 'auth/user-not-found') {
      return null;
    }
    throw e;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : 'help';
  const target = args[1];
  const roleArg = args[2] || 'school_admin';

  if (!['set', 'get', 'revoke', 'list'].includes(command)) {
    console.log(`
AR Jishan Digital School & College - Firebase Admin Management Tool
-------------------------------------------------------------------
Usage:
  node scripts/set-admin-claim.cjs set <email-or-uid> [role]
  node scripts/set-admin-claim.cjs get <email-or-uid>
  node scripts/set-admin-claim.cjs revoke <email-or-uid>
  node scripts/set-admin-claim.cjs list

Available Roles:
  - school_admin (Default: full campus control)
  - super_admin  (Platform tenant manager)
  - teacher       (Faculty marks & attendance)
  - accountant    (Fee management)
    `);
    process.exit(0);
  }

  const app = initFirebaseAdmin();
  if (!app) {
    process.exit(1);
  }

  try {
    // 1. LIST USERS
    if (command === 'list') {
      console.log('\nListing recent Firebase Auth users...');
      const listUsersResult = await admin.auth().listUsers(20);
      if (listUsersResult.users.length === 0) {
        console.log('No users found in Firebase Authentication yet.');
      } else {
        console.table(listUsersResult.users.map(u => ({
          UID: u.uid,
          Email: u.email || 'N/A',
          Role: u.customClaims?.role || 'None',
          IsAdmin: u.customClaims?.admin === true ? '✅ YES' : '❌ NO',
          Disabled: u.disabled ? 'YES' : 'NO'
        })));
      }
      process.exit(0);
    }

    if (!target) {
      console.error('Error: Please provide a user email or UID.');
      process.exit(1);
    }

    const user = await resolveUser(target);
    if (!user) {
      console.error(`\n❌ User not found in Firebase Auth: "${target}"`);
      console.error('Please ensure the user has first signed up or been created in the Firebase Console:');
      console.error('👉 https://console.firebase.google.com/project/digital-ai-school-ea91f/authentication/users\n');
      process.exit(1);
    }

    // 2. GET CLAIMS
    if (command === 'get') {
      console.log('\n=============================================');
      console.log(`User Profile: ${user.email || 'N/A'}`);
      console.log(`UID:          ${user.uid}`);
      console.log('Active Custom Claims:');
      console.log(JSON.stringify(user.customClaims || {}, null, 2));
      console.log(`Is Admin:     ${user.customClaims?.admin === true ? '✅ YES' : '❌ NO'}`);
      console.log('=============================================\n');
      process.exit(0);
    }

    // 3. SET ADMIN CLAIMS
    if (command === 'set') {
      const claims = {
        admin: true,
        role: roleArg,
        schoolId: 'school_ar_jishan_01',
        assignedAt: new Date().toISOString(),
        issuer: 'AR-Jishan-Server-CLI',
      };

      await admin.auth().setCustomUserClaims(user.uid, claims);

      console.log('\n======================================================');
      console.log('✅ SUCCESS: Admin Custom Claims Granted!');
      console.log('======================================================');
      console.log(`Target User:  ${user.email}`);
      console.log(`Firebase UID: ${user.uid}`);
      console.log(`Assigned Role: ${roleArg}`);
      console.log('Assigned Claims:');
      console.log(JSON.stringify(claims, null, 2));
      console.log('------------------------------------------------------');
      console.log('Next step: The user can now log in at the ERP login portal.');
      console.log('If they are already logged in, they should click "Refresh Claims"');
      console.log('or re-sign in to refresh their cryptographically signed ID Token.');
      console.log('======================================================\n');
      process.exit(0);
    }

    // 4. REVOKE CLAIMS
    if (command === 'revoke') {
      await admin.auth().setCustomUserClaims(user.uid, {
        admin: false,
        role: 'viewer',
        revokedAt: new Date().toISOString()
      });

      console.log('\n======================================================');
      console.log(`🔒 Custom claims revoked for user: ${user.email}`);
      console.log('The user has been demoted to viewer and denied admin access.');
      console.log('======================================================\n');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ Server CLI Error:', error.message);
    process.exit(1);
  }
}

main();
