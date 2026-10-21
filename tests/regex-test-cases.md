# Software Testing and Quality Assurance (STQA) Mini Project
## COVID-19 Information & Awareness Portal
**Candidate / Developer:** Omkar Ahirrao  
**Course:** Software Testing and Quality Assurance (STQA)  
**Database:** Supabase Cloud PostgreSQL 17 (Live)  
**Technology Stack:** Next.js 16 (React 19, TypeScript), Tailwind CSS, Node.js `pg`, Bcrypt  

---

## 1. Test Plan Overview

### 1.1 Objective
To design, implement, and rigorously execute an exhaustive test suite verifying the functional correctness, input validation, regular expressions, boundary conditions, database persistence, and security robustness of the COVID-19 Information and Awareness Portal.

### 1.2 Scope of Testing
- **Regular Expression Testing:** Evaluation of Name, Email, Mobile Number, and Password against strict regex rules.
- **Boundary Value Analysis (BVA):** Boundary testing for length limits (Name: 2-50 chars, Mobile: 10 digits, Comment: 2-500 chars, Feedback: 5-1000 chars).
- **Equivalence Class Partitioning (ECP):** Valid vs Invalid partitions across all form inputs.
- **Security Testing:** Cross-Site Scripting (Stored XSS) sanitization, SQL Injection neutralization, and Role-Based Access Control (RBAC).
- **Database Testing:** Atomicity, unique constraint enforcement on duplicate emails, relational integrity, and foreign key cascades.
- **Functional Testing:** Registration, session authentication, comment publishing, and moderation.

---

## 2. Master Regular Expression Rules

| Field | Formal Regular Expression | Valid Example | Invalid Examples |
|---|---|---|---|
| **Name** | `^[A-Za-z ]{2,50}$` | `Omkar Ahirrao` | `A`, `Omkar123`, `Omk@r`, ` ` (spaces only), 51 chars |
| **Email** | `^[^\s@]+@[^\s@]+\.[^\s@]+$` | `omkar@gmail.com` | `omkar@gmail`, `omkar@.com`, `@gmail.com`, `omkar @gmail.com` |
| **Mobile** | `^[6-9][0-9]{9}$` | `9876543210` | `98765432` (8 digits), `98765432100` (11 digits), `5876543210` (starts with 5), `98765abcde` |
| **Password** | `^(?=.*[A-Za-z])(?=.*\d).{8,}$` | `Omkar123` | `short1` (&lt;8 chars), `OmkarAhirrao` (no numbers), `12345678` (no letters) |
| **Comment** | Trimmed length: `2` to `500` characters | `Stay safe everyone!` | Empty string, whitespace only, `A`.repeat(501) |
| **Feedback** | Trimmed length: `5` to `1000` characters | `The symptoms checker was helpful.` | Empty string, &lt;5 characters |

---

## 3. Comprehensive Test Cases Execution Matrix (TC01 - TC36)

| Test ID | Category | Module | Input / Condition | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| **TC01** | Regex Validation | Email | `omkar@gmail.com` | Accepted (`valid: true`) | Accepted (Regex matched) | **PASS** |
| **TC02** | Regex Validation | Email | `omkar@gmail` (Missing TLD) | Rejected (`valid: false`) | Rejected as expected | **PASS** |
| **TC03** | Regex Validation | Email | `omkar@.com` (Missing domain) | Rejected (`valid: false`) | Rejected as expected | **PASS** |
| **TC04** | Regex Validation | Email | `omkar @gmail.com` (Embedded space) | Rejected (`valid: false`) | Rejected as expected | **PASS** |
| **TC05** | Regex Validation | Mobile | `9876543210` (10 digits starting with 9) | Accepted (`valid: true`) | Accepted (Regex matched) | **PASS** |
| **TC06** | Regex Validation | Mobile | `98765432` (8 digits only) | Rejected: length &lt; 10 | Rejected as expected | **PASS** |
| **TC07** | Regex Validation | Mobile | `98765432100` (11 digits) | Rejected: length &gt; 10 | Rejected as expected | **PASS** |
| **TC08** | Regex Validation | Mobile | `98765abcde` (Contains letters) | Rejected: non-digits found | Rejected as expected | **PASS** |
| **TC09** | Regex Validation | Mobile | `5876543210` (Starts with prefix 5) | Rejected: prefix must be 6-9 | Rejected as expected | **PASS** |
| **TC10** | Regex Validation | Password | `Omkar123` (8 chars, letters + numbers) | Accepted (`valid: true`) | Accepted (Regex matched) | **PASS** |
| **TC11** | Regex Validation | Password | `Omk12` (5 chars &lt; 8) | Rejected: length &lt; 8 | Rejected as expected | **PASS** |
| **TC12** | Regex Validation | Password | `OmkarAhirrao` (Letters only) | Rejected: missing digits | Rejected as expected | **PASS** |
| **TC13** | Regex Validation | Password | `12345678` (Numbers only) | Rejected: missing letters | Rejected as expected | **PASS** |
| **TC14** | Regex Validation | Name | `Omkar Ahirrao` (Letters & space) | Accepted (`valid: true`) | Accepted (Regex matched) | **PASS** |
| **TC15** | Boundary & Negative | Name | `O` (Single character &lt; 2) | Rejected: length &lt; 2 | Rejected as expected | **PASS** |
| **TC16** | Regex Validation | Name | `Omkar123` (Contains numbers) | Rejected: numbers disallowed | Rejected as expected | **PASS** |
| **TC17** | Regex Validation | Name | `Omkar@#$` (Special characters) | Rejected: symbols disallowed | Rejected as expected | **PASS** |
| **TC18** | Boundary & Negative | Name | 51 characters (`A` x 51) | Rejected: length &gt; 50 | Rejected as expected | **PASS** |
| **TC19** | Boundary & Negative | Name | Empty string `""` | Rejected: field required | Rejected as expected | **PASS** |
| **TC20** | Security Testing | Comments | `<script>alert("xss")</script>` | Sanitized to HTML entities; not executed | Sanitized to `&lt;script&gt;...` | **PASS** |
| **TC21** | Security Testing | Authentication | `admin' OR '1'='1` (SQLi vector) | Neutralized by parameterized query | Rejected by regex / parameterized SQL | **PASS** |
| **TC22** | Security Testing | Comments | `<img src=x onerror=alert(1)>` | Escaped to safe entity string | Tags safely encoded | **PASS** |
| **TC23** | Boundary & Negative | Comments | Whitespace only `" "` | Rejected: comment cannot be empty | Rejected as expected | **PASS** |
| **TC24** | Boundary & Negative | Comments | 501 characters | Rejected: exceeds 500 chars | Rejected as expected | **PASS** |
| **TC25** | Boundary & Negative | Comments | Valid length comment (56 chars) | Accepted (`valid: true`) | Accepted and stored | **PASS** |
| **TC26** | Boundary & Negative | Feedback | Empty feedback message | Rejected: message required | Rejected as expected | **PASS** |
| **TC27** | Boundary & Negative | Name | Space-only string `" "` | Rejected: whitespace trimmed to empty | Rejected as expected | **PASS** |
| **TC28** | Functional Testing | Authentication | `admin@covidportal.org` format verification | RFC & Regex Compliant | Format valid | **PASS** |
| **TC29** | Database Integrity | Registration | Duplicate email `admin@covidportal.org` | Blocked by PostgreSQL UNIQUE index | Blocked with 409 Conflict | **PASS** |
| **TC30** | Database Integrity | Comments | User ID foreign key association | References valid user in Supabase | Relational join confirmed | **PASS** |
| **TC31** | Functional Testing | Authentication | Incorrect login password | 401 Unauthorized access denial | Login denied as expected | **PASS** |
| **TC32** | Security Testing | Admin Dashboard | Non-admin user access to `/admin` | 401/403 Forbidden Access Denied | Access blocked | **PASS** |
| **TC33** | Functional Testing | Symptoms | Fever + Breath difficulty + Loss of taste | Categorized as High Risk / Emergency | High Risk alert calculated | **PASS** |
| **TC34** | Functional Testing | Password | `Omkar#Safe2026` strength evaluation | Evaluated as Strong (4/4 score) | Strength: Strong | **PASS** |
| **TC35** | Boundary & Negative | Feedback | 4 characters (`Help`) | Rejected: min length is 5 chars | Rejected as expected | **PASS** |
| **TC36** | Database Integrity | Supabase Cloud | Live PostgreSQL handshake & latency | Round-trip latency &lt; 500ms | Latency: 42ms (Postgres 17) | **PASS** |

---

## 4. Execution Summary

- **Total Test Cases Planned:** 36
- **Total Test Cases Executed:** 36
- **Test Cases Passed:** 36 (100%)
- **Test Cases Failed:** 0 (0%)
- **Defects Discovered & Resolved:** 5
- **Quality Status:** **PRODUCTION READY / STQA COMPLIANT**
