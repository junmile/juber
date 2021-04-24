import { Resolvers } from '../../../types/resolvers';

import {
  RegistrationCheckResponse,
  RegistrationCheckQueryArgs,
} from '../../../types/graph';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Query: {
    RegistrationCheck: async (
      _,
      args: RegistrationCheckQueryArgs,
      __
    ): Promise<RegistrationCheckResponse> => {
      const type = args.type;
      if (type === 'phone') {
        try {
          const phoneNumber = args.phoneNumber!;
          const user: User | any = await User.findOne({
            phoneNumber,
          });
          if (user) {
            return {
              ok: true,
              error: null,
              user,
            };
          } else {
            return {
              ok: false,
              error: '가입되어 있는 회원이 아닙니다.',
              user: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            user: null,
          };
        }
      } else {
        const email = args.email!;
        const user: User | any = await User.findOne({ email });
        if (user) {
          return {
            ok: true,
            error: null,
            user,
          };
        } else {
          return {
            ok: false,
            error: '가입되어 있는 회원이 아닙니다.',
            user: null,
          };
        }
      }
    },
  },
};

export default resolvers;
