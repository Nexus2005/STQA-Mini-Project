# STQA Defect Report & Bug Triage Log
## COVID-19 Information and Awareness Portal
**Developer / Tester:** Omkar Ahirrao  
**Course:** Software Testing and Quality Assurance (STQA)  

---

### Defect 1: Stored XSS Execution in Community Comments
- **Defect ID:** `DEF-01`
- **Severity:** `Critical (P1)`
- **Category:** Security / Input Sanitization
- **Related Test Case:** `TC20`, `TC22`
- **Component:** `/api/comments` & Comments Community Board
- **Steps to Reproduce:**
  1. Log into the portal as an authenticated user.
  2. In the comment input textarea, enter: `<script>alert('xss')</script>`.
  3. Click "Post Comment".
- **Observed Behavior:**
  The raw payload was stored into the database and rendered without escaping, causing browser JavaScript execution.
- **Root Cause Analysis:**
  The application relied solely on string length checking without escaping HTML entity delimiters (`<`, `>`, `"`, `'`).
- **Fix Applied:**
  Introduced a server-side `sanitizeHtml()` utility in `src/lib/validation.ts` that converts unsafe delimiters into HTML entities (`&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;`).
- **Verification Result:**
  Re-tested with `<script>` and `<img src=x onerror=...>` payloads. Both are rendered safely as benign plain text. **Status: CLOSED / VERIFIED**.

---

### Defect 2: Duplicate Email Registration during High-Concurrency Submissions
- **Defect ID:** `DEF-02`
- **Severity:** `High (P2)`
- **Category:** Database Testing / Concurrency
- **Related Test Case:** `TC29`
- **Component:** User Registration (`/api/auth/register`)
- **Steps to Reproduce:**
  1. Trigger two simultaneous registration POST requests with the identical email address `omkar@gmail.com`.
- **Observed Behavior:**
  Under simultaneous requests, application-level `SELECT` checks passed simultaneously for both threads, resulting in duplicate user records with conflicting emails.
- **Root Cause Analysis:**
  The database schema lacked a strict PostgreSQL `UNIQUE` constraint on `users.email`.
- **Fix Applied:**
  Updated the schema to declare `email VARCHAR(150) NOT NULL UNIQUE` and added a unique B-Tree index `idx_users_email`. The application catches PostgreSQL unique violation code `23505` and returns HTTP `409 Conflict`.
- **Verification Result:**
  Re-tested in `TC29`. Attempting to register duplicate emails now consistently fails with user-friendly error message. **Status: CLOSED / VERIFIED**.

---

### Defect 3: Mobile Number Regex Allowed Alphabetic Characters at End of String
- **Defect ID:** `DEF-03`
- **Severity:** `Medium (P3)`
- **Category:** Regular Expression Validation
- **Related Test Case:** `TC08`
- **Component:** Mobile Number Input Field (`register.php` / `validation.ts`)
- **Steps to Reproduce:**
  1. Input `98765abcde` into the mobile number input.
- **Observed Behavior:**
  The field was marked valid by an earlier loose regex `/^[6-9][0-9]+/`.
- **Root Cause Analysis:**
  Missing end-of-string anchor `$` allowed non-digit suffixes once the initial digits matched.
- **Fix Applied:**
  Strict regex rule enforced: `/^[6-9][0-9]{9}$/`. Requires string start `^`, first digit `6-9`, followed by exactly 9 digits `0-9`, and string terminator `$`.
- **Verification Result:**
  Re-tested in `TC08`. `98765abcde` is properly rejected. **Status: CLOSED / VERIFIED**.

---

### Defect 4: Whitespace-Only String Accepted in Name Field
- **Defect ID:** `DEF-04`
- **Severity:** `Low (P4)`
- **Category:** Boundary Value Analysis / Negative Testing
- **Related Test Case:** `TC27`
- **Component:** Full Name Field (`src/lib/validation.ts`)
- **Steps to Reproduce:**
  1. Enter 5 consecutive spaces `"     "` in the Full Name field.
- **Observed Behavior:**
  Length check `name.length >= 2` passed because space characters contributed to length.
- **Root Cause Analysis:**
  Input was not trimmed before evaluating length boundaries.
- **Fix Applied:**
  Added `.trim()` before regex and length evaluation. Whitespace-only strings now reduce to length 0 and trigger `Name field cannot be empty`.
- **Verification Result:**
  Re-tested in `TC27`. Space-only input rejected. **Status: CLOSED / VERIFIED**.

---

### Defect 5: Missing Role Verification on Admin User Roster Endpoint
- **Defect ID:** `DEF-05`
- **Severity:** `High (P2)`
- **Category:** Security & Role-Based Access Control (RBAC)
- **Related Test Case:** `TC32`
- **Component:** Admin API (`/api/admin/users`)
- **Steps to Reproduce:**
  1. Issue a direct GET request to `/api/admin/users` as a standard non-admin user or unauthenticated guest.
- **Observed Behavior:**
  User details including emails and phone numbers were returned without admin privileges check.
- **Root Cause Analysis:**
  Missing session cookie role check inside the API handler.
- **Fix Applied:**
  Added authentication middleware checking `user.role === 'admin'`. Unauthenticated or non-admin requests receive HTTP `401 Unauthorized` or `403 Forbidden`.
- **Verification Result:**
  Re-tested in `TC32`. Unauthorized requests are blocked. **Status: CLOSED / VERIFIED**.
