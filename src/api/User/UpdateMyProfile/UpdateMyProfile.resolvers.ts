import { Resolvers } from 'src/types/resolvers';
import privateResolver from 'src/api/utils/privateResolver';
import {
  UpdateMyProfileResponse,
  UpdateMyProfileMutationArgs
} from 'src/types/graph';
import User from 'src/entities/User';

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (_, args: UpdateMyProfileMutationArgs, { req }) => {
        const user: User = req.user;
        await User.update({ id: user.id }, { ...args });
      }
    )
  }
};

export default resolvers;
