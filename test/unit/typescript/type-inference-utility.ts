import keystone from '../../../index';
import { InferKeystoneDocument } from '../../../keystone-type-inference';
import * as mongoose from 'mongoose';

keystone.init({});

// Define a related list for the relationship tests
const Post = new keystone.List('PostUtilityTest', {});
Post.register();

// 1. Define the list configuration with various field options
const userConfig = {
  fields: {
    // Required field, should be non-nullable
    name: { type: keystone.Field.Types.Text, required: true, initial: true },
    // Not required, no default, should be nullable
    email: { type: keystone.Field.Types.Email, initial: true, unique: true },
    // Has a default, should be non-nullable
    isAdmin: { type: keystone.Field.Types.Boolean, default: false },
    // Relationship with many: false (or omitted), should be ObjectId | undefined
    author: { type: keystone.Field.Types.Relationship, ref: 'PostUtilityTest' },
    // Relationship with many: true, should be ObjectId[]
    posts: { type: keystone.Field.Types.Relationship, ref: 'PostUtilityTest', many: true },
  },
  methods: {
    getProfileUrl(this: any) {
      return `/users/${this._id}`;
    },
  },
} as const;

// 2. Infer the document type
type UserDocument = InferKeystoneDocument<typeof userConfig>;

// 3. Create the Keystone List using the inferred type
const User = new keystone.List<UserDocument>('UserUtilityTest');

// 4. Add fields and methods from the config
User.add(userConfig.fields);
Object.assign(User.schema.methods, userConfig.methods);

// 5. Register the list
User.register();

// Compile-time tests
describe('Advanced Type Inference Utility', () => {
  it('should correctly infer types with options', async () => {
    const user = new User.model();

    // Check if fields are correctly typed
    const name: string = user.name;
    const email: string | undefined = user.email;
    const isAdmin: boolean = user.isAdmin;
    const author: mongoose.Types.ObjectId | undefined = user.author;
    const posts: mongoose.Types.ObjectId[] = user.posts;

    // Check if methods are correctly typed
    const profileUrl: string = user.getProfileUrl();

    // This is a compile-time test, so if it compiles, it passes.
  });
});
