import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../../api/utils/privateResolver';
import {
  UpdateMyProfileResponse,
  UpdateMyProfileMutationArgs
} from 'src/types/graph';
import User from '../../../entities/User';
import cleanNullArgs from '../../../api/utils/cleanNullArgs';

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (
        _,
        args: UpdateMyProfileMutationArgs,
        { req }
      ): Promise<UpdateMyProfileResponse> => {
        const user: User = req.user;
        const notNull = cleanNullArgs(args);

        try {
          if (args.password !== null) {
            user.password = args.password;
            user.save();
          }
          await User.update({ id: user.id }, { ...notNull });
          return {
            ok: true,
            error: null
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message
          };
        }
      }
    )
  }
};

export default resolvers;
