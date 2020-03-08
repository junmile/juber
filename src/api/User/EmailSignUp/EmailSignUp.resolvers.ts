import { Resolvers } from 'src/types/resolvers';
import { EmailSignUpMutationArgs, EmailSignUpResponse } from 'src/types/graph';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (
      _,
      args: EmailSignUpMutationArgs
    ): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const exitingUser = await User.findOne(email);
        if (exitingUser) {
          return {
            ok: false,
            error: 'You should log in instead',
            token: null
          };
        } else {
          await User.create({ ...args }).save();
          return {
            ok: true,
            error: null,
            token: 'Coming soon!'
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null
        };
      }
    }
  }
};

export default resolvers;
