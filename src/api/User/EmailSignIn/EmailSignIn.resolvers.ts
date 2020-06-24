import { Resolvers } from 'src/types/resolvers';
import { EmailSignInResponse, EmailSignInMutationArgs } from 'src/types/graph';
import User from '../../../entities/User';
import createJWT from '../../utils/createJWT';

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (
      _,
      args: EmailSignInMutationArgs
    ): Promise<EmailSignInResponse> => {
      const { email, password } = args;
      try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          return {
            ok: false,
            error: '해당 이메일로 가입한 정보가 없습니다.',
            token: null,
          };
        }
        const checkPassword = await user.comparePassword(password);
        console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
        console.log(checkPassword);
        if (checkPassword) {
          const token = createJWT(user.id);
          console.log('■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■');
          console.log(token);
          return {
            ok: true,
            error: null,
            token,
          };
        } else {
          return {
            ok: false,
            error: '비밀번호가 틀립니다.',
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
