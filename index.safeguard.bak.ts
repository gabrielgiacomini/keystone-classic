
/** The singleton Keystone instance. */
// declare const keystone: Keystone;
// export { keystone as KeystoneInstance };
// export default keystone;

// --- Dependencies & Placeholders ---
// import * as utils from 'keystone-utils'; // @todo Get/Define types for keystone-utils
// declare class Path { constructor(path: string); get(obj: any, subpath?: string): any; } // @todo Define Path class from lib/path.js
// @todo Add types for external dependencies: @types/lodash, @types/marked, @types/object-assign, asyncdi?

/*
Usage Instructions:

1.  **Installation:**
    ```bash
    npm install --save-dev @types/express @types/mongoose @types/node @types/moment @types/numeral @types/lodash @types/marked
    # or
    yarn add --dev @types/express @types/mongoose @types/node @types/moment @types/numeral @types/lodash @types/marked
    ```
    *Note:* You might need other types like `@types/grappling-hook` depending on your usage.

2.  **Basic Usage:**
    ```typescript
    import * as keystone from 'keystone';
    
    // Configure Keystone
    keystone.set('name', 'My Project');
    keystone.set('user model', 'User');
    keystone.set('mongo', 'mongodb://localhost/my-project');
    keystone.set('admin path', 'admin');
    
    // Define Lists
    const User = new keystone.List('User', {
      track: true, // Adds createdAt, createdBy, updatedAt, updatedBy
      autokey: { path: 'slug', from: 'name', unique: true } // Requires keystone-list-plugins
    });
    
    User.add({
      name: { type: keystone.Field.Types.Text, required: true, index: true },
      email: { type: keystone.Field.Types.Email, initial: true, required: true, unique: true },
      password: { type: keystone.Field.Types.Password, initial: true },
      isAdmin: { type: keystone.Field.Types.Boolean, default: false }
    });
    
    User.defaultColumns = 'name, email, isAdmin';
    User.register();
    
    // Start the application
    keystone.start();
    ```

3.  **Accessing List Methods:**
    ```typescript
    const Post = keystone.list('Post');
    
    // Using the updateItem method
    Post.updateItem(existingPost, { title: 'New Title' }, { user: req.user }, function(err, post) {
      if (err) return handleError(err);
      console.log(`Updated post: ${post.title}`);
    });
    
    // Using the expandColumns method
    const columns = Post.expandColumns('title,status,author');
    console.log(columns); // Array of column objects
    ```

4.  **Accessing Field Methods:**
    ```typescript
    const titleField = Post.field('title');
    if (titleField) {
      // Get Admin UI options
      const uiOptions = titleField.getOptions();
      
      // Format a value
      const formattedTitle = titleField.format(post);
      console.log(`Formatted title: ${formattedTitle}`);
    }
    ```

5.  **Creating a Custom Field Type:**
    ```typescript
    // Extending an existing field type
    keystone.Field.Types.MyText = keystone.Field.Types.Text.extend({
      getOptions: function() {
        const options = keystone.Field.Types.Text.prototype.getOptions.call(this);
        options.myCustomOption = this.options.myCustomOption || false;
        return options;
      }
    });
    ```

6. **Using TypeScript Types for Existing Documents:**
   ```typescript
   // Define a custom interface for your User model
   interface UserDocument extends mongoose.Document {
     name: string;
     email: string;
     password: { hash: string };
     isAdmin: boolean;
     createdAt: Date;
     createdBy?: UserDocument;
   }
   
   // Use the type with the model
   const User = keystone.list('User');
   const userModel = User.model as mongoose.Model<UserDocument>;
   
   // Now you have type safety
   userModel.findOne({ email: 'example@example.com' }, (err, user) => {
     if (user) {
       console.log(user.name); // Properly typed as string
       console.log(user.isAdmin); // Properly typed as boolean
     }
   });
   ```

Type Definition Notes:
- This type definition focuses on core Keystone v4 functionality, but might not cover all plugins/extensions.
- Some field types like Relationship, Name, Email, Password, Money, File types, etc. still need proper type definitions.
- List method signatures (paginate, register, updateItem, etc.) may need refinement based on actual implementation.
- Many core Keystone methods (init, start, populateRelated) still have placeholder signatures.
- Consider creating your own custom typings for specific models in your application for better type safety.
- The Mongoose Document typing for List.model currently uses 'any' - ideally it would be a specific interface based on the fields.
*/
