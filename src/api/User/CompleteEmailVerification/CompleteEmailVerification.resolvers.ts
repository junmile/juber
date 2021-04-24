import { Resolvers } from 'src/types/resolvers';
import privateResolver from '../../../api/utils/privateResolver';
import {
  CompleteEmailVerificationMutationArgs,
  CompleteEmailVerificationResponse,
} from 'src/types/graph';
import User from 'src/entities/User';
import Verification from '../../../entities/Verification';

const resolvers: Resolvers = {
  Mutation: {
    CompleteEmailVerification: privateResolver(
      async (
        _,
        args: CompleteEmailVerificationMutationArgs,
        { req }
      ): Promise<CompleteEmailVerificationResponse> => {
        console.log('completeEmailVerification : ', '시작');
        const user: User = req.user;
        const { key } = args;

        if (user.email) {
          try {
            const verification = await Verification.findOne({
              key,
              payload: user.email,
            });
            if (verification) {
              user.verifiedEmail = true;
              user.save();
              verification.verified = true;
              verification.save();
              return {
                ok: true,
                error: null,
              };
            } else {
              return {
                ok: false,
                error: "Can't verify email",
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
            };
          }
        } else {
          return {
            ok: false,
            error: 'No email to verify',
          };
        }
      }
    ),
  },
};

export default resolvers;
