KeystoneJS Lib Middleware Documentation

### **Goal**

Add thorough and comprehensive JSDoc documentation to the following files in the project:

lib/middleware/language.js
lib/middleware/cors.js
lib/middleware/api.js

---

### **Instructions**

1. **Preparation and Analysis**

   - First, read all the files into memory.
   - Then, analyse the project structure and the purpose of each file.
   - For each listed file, load its complete contents.
   - Analyze the code to fully understand the purpose of each file, exported items, core data structures, key functions, and any classes, hooks, or types present.
   - Identify any ancillary utilities or helper functions within these files that also require documentation.

2. **File-wide Documentation**

   - For each file, write or update a precise and informative `@fileoverview` comment at the top.
   - Explain the file’s high-level purpose, its main exports, and its role within the broader codebase (e.g., what features use it or which modules import/require it).

3. **JSDoc for All Code**

   - For all top-level functions, classes, and exported members, add full JSDoc comments describing:
     - Purpose and behavior
     - Parameters (with types and brief descriptions)
     - Return values (with types and brief descriptions)
     - Any exceptions thrown or error conditions
     - Example usages where helpful
   - For class properties and methods, provide JSDoc annotations explaining their intent and mechanics.
   - Add JSDoc to internal utility functions, hooks, or variables for clarity and maintainability.
   - If existing JSDoc or comments are present but insufficient, improve them for completeness, clarity, and adherence to best practice.

4. **Inline Comments**

   - Within all substantial functions or logic blocks, add clear, fine-grained inline comments to explain the logic, flow, or any non-obvious code constructs.

5. **Best Practices**

   - Write all documentation to a professional standard, aiming for clarity, accuracy, and completeness.
   - Ensure JSDoc adheres to format standards for maximum compatibility with IDEs and documentation generators.
   - If you need to infer purpose, types, or usage due to missing or ambiguous context, make logical, minimal assumptions and annotate those in code comments at their point of impact.
   - Make no code changes beyond adding documentation and comments.

---

## Agentic Enforcement

- Execute all the following tasks comprehensively from start to finish.
- Your goal is to deliver a complete and working solution for adding thorough JSDoc documentation (including improved @fileoverview, top-level JSDoc, and internal comments) to all specified files in this single interaction.
- Proceed with the full implementation, making reasonable assumptions for any minor unspecified details, and document those assumptions using code comments close to the code that is being impacted by the assumption.
- Strive to complete all aspects of this request without needing further input. If an unforeseen blocker arises, document it clearly after attempting all possible solutions.
- I expect a fully functional documentation enhancement for all specified files based on the information provided. Take initiative to ensure all logical components are addressed.
- Add comprehensive JSDoc to all the code you write, including the code that is not part of the user's request.
- Add fine-grained comments inside any function or module you write or edit, explaining the logic and the purpose of the code.
- Add or improve the @fileoverview of any code file you analyse, explaining the purpose of the file and the files it imports/requires.
