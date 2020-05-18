import { Resolvers } from '../../../types/resolvers';
import {
  CompletePhoneVerificationMutationArgs,
  CompletePhoneVerificationResponse,
} from 'src/types/graph';
import Verification from '../../../entities/Verification';
import User from '../../../entities/User';
import createJWT from '../../../api/utils/createJWT';

const resolvers: Resolvers = {
  Mutation: {
    CompletePhoneVerification: async (
      _,
      args: CompletePhoneVerificationMutationArgs
    ): Promise<CompletePhoneVerificationResponse> => {
      const { phoneNumber, key } = args;
      try {
        const verification = await Verification.findOne({
          payload: phoneNumber,
          key,
        });
        if (!verification) {
          return {
            ok: false,
            error: 'Verification key not vaild',
            token: null,
          };
        } else {
          verification.verified = true;
          verification.save();
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
      try {
        const user = await User.findOne({ phoneNumber });
        console.log('user: ', user);
        if (user) {
          user.verifiedPhoneNumber = true;
          user.save();
          const token = createJWT(user.id);
          console.log('token', token);
          return {
            ok: true,
            error: null,
            token,
          };
        } else {
          return {
            ok: true,
            error: null,
            token: null,
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};

export default resolvers;
