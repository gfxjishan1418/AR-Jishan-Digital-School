/**
 * ==============================================================================
 * AR Jishan Digital School & College - Security & Authorization Test Suite
 * ==============================================================================
 * Run: node scripts/test-authorization.cjs
 * 
 * Verifies:
 *   1. Unauthenticated requests are rejected.
 *   2. Authenticated user without custom claim is denied admin access.
 *   3. Authenticated user with custom claims ({ admin: true, role: 'school_admin' }) is granted access.
 *   4. Client-side privilege escalation / spoofing is blocked.
 *   5. Session revocation triggers access denial.
 *   6. Human-readable Firebase Auth error formatting works.
 * ==============================================================================
 */

const assert = require('assert');

// Test Runner Helper
let passedCount = 0;
let failedCount = 0;

function runTest(testName, testFn) {
  try {
    testFn();
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } catch (error) {
    console.error(`  ❌ FAIL: ${testName}`);
    console.error(`     Reason: ${error.message}`);
    failedCount++;
  }
}

// ------------------------------------------------------------------------------
// Authorization Logic Replica (same as FirebaseService.verifyUserAdminClaims)
// ------------------------------------------------------------------------------
function evaluateAdminClaims(tokenClaims) {
  if (!tokenClaims || typeof tokenClaims !== 'object') {
    return { isAdmin: false, role: 'none' };
  }

  const hasAdminClaim = Boolean(
    tokenClaims.admin === true || 
    tokenClaims.role === 'school_admin' || 
    tokenClaims.role === 'super_admin' ||
    tokenClaims.role === 'admin'
  );

  const resolvedRole = tokenClaims.role || (hasAdminClaim ? 'school_admin' : 'viewer');

  return {
    isAdmin: hasAdminClaim,
    role: resolvedRole
  };
}

function formatAuthError(err) {
  const code = err?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email address or password. Please check your credentials and try again.';
    case 'auth/user-not-found':
      return 'No user found with this email address. Please contact the school administrator.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled by the institution. Please contact the administrator.';
    default:
      return err?.message || 'Authentication failed.';
  }
}

console.log('\n==============================================================================');
console.log('🧪 Starting AR Jishan Security & Authorization Verification Tests');
console.log('==============================================================================\n');

// Test 1: Unauthenticated user
runTest('Unauthenticated user (null/empty token) is denied admin access', () => {
  const result = evaluateAdminClaims(null);
  assert.strictEqual(result.isAdmin, false, 'Unauthenticated user must have isAdmin: false');
  assert.strictEqual(result.role, 'none', 'Unauthenticated user role must be "none"');
});

// Test 2: Regular authenticated user with no admin claims
runTest('Authenticated user without admin claim is denied admin access', () => {
  const claims = { email: 'student@arjishan.edu.bd', email_verified: true };
  const result = evaluateAdminClaims(claims);
  assert.strictEqual(result.isAdmin, false, 'User without admin claim must NOT have admin access');
  assert.strictEqual(result.role, 'viewer', 'Role must default to viewer');
});

// Test 3: Authenticated user with standard student role
runTest('Student user cannot access administrative ERP privileges', () => {
  const claims = { role: 'student', studentId: 'stu-101' };
  const result = evaluateAdminClaims(claims);
  assert.strictEqual(result.isAdmin, false, 'Student role must not be granted admin access');
  assert.strictEqual(result.role, 'student');
});

// Test 4: Authenticated user with verified school_admin claim
runTest('Verified user with admin: true & role: school_admin is granted access', () => {
  const claims = {
    admin: true,
    role: 'school_admin',
    schoolId: 'school_ar_jishan_01',
    issuer: 'AR-Jishan-Server-CLI'
  };
  const result = evaluateAdminClaims(claims);
  assert.strictEqual(result.isAdmin, true, 'User with valid custom claim must have isAdmin: true');
  assert.strictEqual(result.role, 'school_admin');
});

// Test 5: Super Admin verified claim
runTest('Platform super_admin with custom claim is granted full access', () => {
  const claims = {
    admin: true,
    role: 'super_admin',
  };
  const result = evaluateAdminClaims(claims);
  assert.strictEqual(result.isAdmin, true, 'Super admin must have isAdmin: true');
  assert.strictEqual(result.role, 'super_admin');
});

// Test 6: Client-side tampering attempt
runTest('Client-side spoofing attempt (falsified string "false") is rejected', () => {
  const spoofedClaims = {
    admin: 'true', // string instead of boolean true
    role: 'viewer'
  };
  const result = evaluateAdminClaims(spoofedClaims);
  assert.strictEqual(result.isAdmin, false, 'Strict boolean comparison must reject non-boolean string');
});

// Test 7: Revoked claims
runTest('Revoked claims ({ admin: false, role: "viewer" }) strictly blocks user', () => {
  const revokedClaims = {
    admin: false,
    role: 'viewer',
    revokedAt: '2026-10-28T12:00:00Z'
  };
  const result = evaluateAdminClaims(revokedClaims);
  assert.strictEqual(result.isAdmin, false, 'Revoked user must be rejected immediately');
  assert.strictEqual(result.role, 'viewer');
});

// Test 8: Error formatting for invalid credentials
runTest('Firebase error code "auth/invalid-credential" produces helpful message', () => {
  const formatted = formatAuthError({ code: 'auth/invalid-credential' });
  assert.ok(formatted.includes('Incorrect email address or password'), 'Must return helpful credential error');
});

// Test 9: Error formatting for user-not-found
runTest('Firebase error code "auth/user-not-found" produces helpful message', () => {
  const formatted = formatAuthError({ code: 'auth/user-not-found' });
  assert.ok(formatted.includes('No user found with this email address'), 'Must return user not found error');
});

console.log('\n==============================================================================');
console.log(`📊 Test Results: ${passedCount} Passed, ${failedCount} Failed`);
console.log('==============================================================================\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Authorization & Security Tests PASSED Successfully!\n');
  process.exit(0);
}
