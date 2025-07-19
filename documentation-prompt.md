### **Goals**

1. Read the following files to understand the codebase:

fields/mixins/ArrayField.js
fields/mixins/ArrayField.js
fields/types/textarea/TextareaField.js
fields/types/textarea/TextareaColumn.js
fields/types/textarea/TextareaType.js
fields/types/textarea/TextareaFilter.js
fields/types/geopoint/GeoPointField.js
fields/types/geopoint/GeoPointColumn.js
fields/types/geopoint/GeoPointType.js
fields/types/geopoint/GeoPointFilter.js
fields/types/url/UrlColumn.js
fields/types/url/UrlType.js
fields/types/url/UrlFilter.js
fields/types/url/UrlField.js
fields/types/email/EmailField.js
fields/types/email/EmailType.js
fields/types/email/EmailColumn.js
fields/types/email/EmailFilter.js
fields/types/password/PasswordType.js
fields/types/password/PasswordFilter.js
fields/types/password/PasswordColumn.js
fields/types/password/PasswordField.js
fields/types/name/NameFilter.js
fields/types/name/NameColumn.js
fields/types/name/NameType.js
fields/types/name/NameField.js
fields/types/select/SelectField.js
fields/types/select/SelectType.js
fields/types/select/SelectFilter.js
fields/types/select/SelectColumn.js
fields/types/location/LocationColumn.js
fields/types/location/LocationFilter.js
fields/types/location/LocationField.js
fields/types/location/LocationType.js
fields/types/code/CodeType.js
fields/types/code/CodeField.js
fields/types/code/CodeFilter.js
fields/types/code/CodeColumn.js
fields/types/key/KeyColumn.js
fields/types/key/KeyFilter.js
fields/types/key/KeyType.js
fields/types/key/KeyField.js
fields/types/date/DateFilter.js
fields/types/date/DateField.js
fields/types/date/DateType.js
fields/types/date/DateColumn.js
fields/types/embedly/EmbedlyType.js
fields/types/embedly/EmbedlyField.js
fields/types/embedly/EmbedlyColumn.js
fields/types/embedly/EmbedlyFilter.js
fields/types/textarray/TextArrayType.js
fields/types/textarray/TextArrayFilter.js
fields/types/textarray/TextArrayColumn.js
fields/types/textarray/TextArrayField.js
fields/types/money/MoneyColumn.js
fields/types/money/MoneyField.js
fields/types/money/MoneyType.js
fields/types/money/MoneyFilter.js
fields/types/azurefile/AzureFileFilter.js
fields/types/azurefile/AzureFileType.js
fields/types/azurefile/AzureFileField.js
fields/types/azurefile/AzureFileColumn.js
fields/types/relationship/RelationshipColumn.js
fields/types/relationship/RelationshipType.js
fields/types/relationship/RelationshipFilter.js
fields/types/relationship/RelationshipField.js
fields/types/s3file/S3FileFilter.js
fields/types/s3file/S3FileColumn.js
fields/types/s3file/S3FileField.js
fields/types/s3file/S3FileType.js
fields/types/numberarray/NumberArrayField.js
fields/types/numberarray/NumberArrayColumn.js
fields/types/numberarray/NumberArrayType.js
fields/types/numberarray/NumberArrayFilter.js
fields/types/color/ColorField.js
fields/types/color/ColorFilter.js
fields/types/color/colored-swatch.js
fields/types/color/ColorColumn.js
fields/types/color/transparent-swatch.js
fields/types/color/ColorType.js
fields/types/file/FileType.js
fields/types/file/FileFilter.js
fields/types/file/FileField.js
fields/types/file/FileColumn.js
fields/types/cloudinaryimage/CloudinaryImageField.js
fields/types/cloudinaryimage/CloudinaryImageFilter.js
fields/types/cloudinaryimage/CloudinaryImageType.js
fields/types/cloudinaryimage/CloudinaryImageColumn.js
fields/types/cloudinaryimages/CloudinaryImagesField.js
fields/types/cloudinaryimages/CloudinaryImagesFilter.js
fields/types/cloudinaryimages/CloudinaryImagesThumbnail.js
fields/types/cloudinaryimages/CloudinaryImagesColumn.js
fields/types/cloudinaryimages/CloudinaryImagesType.js
fields/types/text/TextType.js
fields/types/text/TextFilter.js
fields/types/text/TextColumn.js
fields/types/text/TextField.js
fields/types/Type.js
fields/types/localfile/LocalFileField.js
fields/types/localfile/LocalFileColumn.js
fields/types/localfile/LocalFileFilter.js
fields/types/localfile/LocalFileType.js
fields/types/localfiles/LocalFilesField.js
fields/types/localfiles/LocalFilesFilter.js
fields/types/localfiles/LocalFilesType.js
fields/types/localfiles/LocalFilesColumn.js
fields/types/Field.js
fields/types/datetime/DatetimeType.js
fields/types/datetime/DatetimeField.js
fields/types/datetime/DatetimeColumn.js
fields/types/datetime/DatetimeFilter.js
fields/types/markdown/MarkdownColumn.js
fields/types/markdown/MarkdownType.js
fields/types/markdown/MarkdownFilter.js
fields/types/markdown/lib/bootstrap-markdown.js
fields/types/markdown/MarkdownField.js
fields/types/boolean/BooleanField.js
fields/types/boolean/BooleanColumn.js
fields/types/boolean/BooleanFilter.js
fields/types/boolean/BooleanType.js
fields/types/number/NumberType.js
fields/types/number/NumberColumn.js
fields/types/number/NumberFilter.js
fields/types/number/NumberField.js
fields/types/datearray/DateArrayFilter.js
fields/types/datearray/DateArrayType.js
fields/types/datearray/DateArrayField.js
fields/types/datearray/DateArrayColumn.js
fields/types/html/HtmlFilter.js
fields/types/html/HtmlType.js
fields/types/html/HtmlColumn.js
fields/types/html/HtmlField.js
fields/utils/evalDependsOn.js
fields/utils/definePrototypeGetters.js
fields/utils/addPresenceToQuery.js
fields/utils/bindFunctions.js

Add thorough and comprehensive JSDoc documentation to the following files in the project:

---

### **Instructions**

1. **Preparation and Analysis**

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
