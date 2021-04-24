import { Resolvers } from 'src/types/resolvers';
import privateResolver from '../../../api/utils/privateResolver';
import User from '../../../entities/User';
import { ToggleDrivingModeResponse } from 'src/types/graph';

const resolvers: Resolvers = {
  Mutation: {
    ToggleDrivingMode: privateResolver(
      async (_, args, { req }): Promise<ToggleDrivingModeResponse> => {
        const user: User = req.user;
        user.isDriving = !user.isDriving;
        user.save();
        return {
          ok: true,
          error: null
        };
      }
    )
  }
};

export default resolvers;
