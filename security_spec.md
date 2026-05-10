# Security Specification: Quiz Master Pro

## 1. Data Invariants
- A **Subject** must have a non-empty name and a valid `createdBy` field matching the user.
- A **Question** must belong to a valid `subjectId`.
- Only the creator of a Subject can add questions to it.
- Correct answers for questions must be one of 'A', 'B', 'C', or 'D'.
- Timestamps must be validated using `request.time`.

## 2. The "Dirty Dozen" Payloads (Unauthorized Attempts)
1. **The Identity Spoofer**: Create a subject with `createdBy` set to another user's UID.
2. **The Shadow Field**: Add a `isVerified: true` hidden field to a question payload.
3. **The Orphaned Question**: Create a question for a `subjectId` that doesn't exist.
4. **The Hijacker**: Update a subject that doesn't belong to me.
5. **The Question Injector**: Add a question to another user's subject.
6. **The Timestamp Faker**: Set `createdAt` to a date in the past.
7. **The Poison ID**: Use a document ID that is 2KB of junk characters.
8. **The PII Leak**: Try to read another user's subject collection (should be restricted if I use private profiles, but here subjects are public or shared? Requirements imply "kho câu hỏi trắc nghiệm" - let's assume private by default or shared if I implement sharing. For now, private: owner only write, anyone sign-in can read if it's a shared app, but doc says "tạo kho câu hỏi", implies ownership).
9. **The Enum Bypass**: Set `correctAnswer` to 'E'.
10. **The Size Attack**: Set `questionText` to a 5MB string.
11. **The Immutable Update**: Try to change `subjectId` of an existing question.
12. **The Zero-ID**: Use an ID like `../..` to attempt path traversal.

## 3. Test Runner (Conceptual)
All the above must return `PERMISSION_DENIED`.
