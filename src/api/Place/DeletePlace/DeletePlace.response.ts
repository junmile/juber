import privateResolver from 'src/api/utils/privateResolver';
import User from 'src/entities/User';
import { Resolvers } from 'src/types/resolvers';
import { DeletePlaceMutationArgs, DeletePlaceResponse } from 'src/types/graph';
import Place from 'src/entities/Place';

const resolvers: Resolvers = {
  Mutation: {
    DeletePlace: privateResolver(
      async (
        _,
        args: DeletePlaceMutationArgs,
        { req }
      ): Promise<DeletePlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({ id: args.placeId });
          if (place) {
            if (place.userId === user.id) {
              place.remove();
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: 'not authorized'
              };
            }
          } else {
            return {
              ok: false,
              error: 'place not found'
            };
          }
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
