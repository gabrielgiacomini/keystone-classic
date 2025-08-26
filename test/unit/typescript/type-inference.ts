import keystone from '../../../index';
import { KeystoneDocument } from '../../../index';

keystone.init({});

// Define a Post list for relationship
const Post = new keystone.List('Post', {});
Post.add({
	title: { type: String },
});
Post.register();

// 1. Define a custom document interface
interface UserDocument extends KeystoneDocument {
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  posts: any[]; // Assuming Post is another Keystone list
}

// 2. Create a typed Keystone List
const User = new keystone.List<UserDocument>('User', {
  autocreate: true,
  track: false,
});

// 3. Add fields to the list
User.add({
  name: { type: String, required: true, initial: true },
  email: { type: String, required: true, unique: true, initial: true },
  isAdmin: { type: Boolean, default: false },
  posts: { type: keystone.Field.Types.Relationship, ref: 'Post', many: true },
});

// 4. Add a schema method and verify 'this' is correctly typed
User.schema.methods.getProfileUrl = function(this: UserDocument): string {
  // TypeScript should know about 'this.name' and 'this.email'
  return `/users/${this._id}?name=${this.name}&email=${this.email}`;
};

// 5. Register the list
User.register();

// This is a compile-time test. If this file compiles without errors,
// it means the type definitions are working as expected.
// We can add a dummy test to make sure the file is executed by the test runner.
describe('TypeScript Type Inference', () => {
  it('should compile without errors', () => {
    // This test simply confirms that the file was included in the test run.
    // The real test is the TypeScript compilation of this file.
  });
});
