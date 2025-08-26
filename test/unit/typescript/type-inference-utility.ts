import keystone from '../../../index';
import { InferKeystoneDocument } from '../../../keystone-type-inference';

keystone.init({});

// 1. Define the list configuration
const userConfig = {
  fields: {
    name: { type: keystone.Field.Types.Text, required: true, initial: true },
    email: { type: keystone.Field.Types.Email, required: true, initial: true, unique: true },
    isAdmin: { type: keystone.Field.Types.Boolean, default: false },
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
describe('Type Inference Utility', () => {
  it('should correctly infer types and allow usage', async () => {
    const user = new User.model();

    // Check if fields are correctly typed
    const name: string = user.name;
    const email: string = user.email;
    const isAdmin: boolean = user.isAdmin;

    // Check if methods are correctly typed
    const profileUrl: string = user.getProfileUrl();

    // This is a compile-time test, so if it compiles, it passes.
    // The assertions below are for runtime validation if needed.
    // require('assert').strictEqual(typeof name, 'string');
    // require('assert').strictEqual(typeof email, 'string');
    // require('assert').strictEqual(typeof isAdmin, 'boolean');
    // require('assert').strictEqual(typeof profileUrl, 'string');
  });
});
