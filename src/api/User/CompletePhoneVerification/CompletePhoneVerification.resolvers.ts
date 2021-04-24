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
      console.log('completePhoneVerification : ', args);
      try {
        const verification = await Verification.findOne({
          payload: phoneNumber,
          key,
        });
        if (!verification) {
          return {
            ok: false,
            error: '인증 키를 정확히 기입해 주세요.',
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
        console.log('여기로넘어옴');
        if (user) {
          console.log('1번');
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
          console.log('2번');
          return {
            ok: true,
            error: '인증 되었습니다.',
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
