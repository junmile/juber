import privateResolver from 'src/api/utils/privateResolver';
import User from 'src/entities/User';
import { EditPlaceMutationArgs, EditPlaceResponse } from 'src/types/graph';
import Place from 'src/entities/Place';
import cleanNullArgs from 'src/api/utils/cleanNullArgs';
import { Resolvers } from 'src/types/resolvers';

const resolvers: Resolvers = {
  Mutation: {
    EditPlace: privateResolver(
      async (
        _,
        args: EditPlaceMutationArgs,
        { req }
      ): Promise<EditPlaceResponse> => {
        const user: User = req.user;
        try {
          const place = await Place.findOne({ id: args.placeId });
          if (place) {
            if (place.userId === user.id) {
              const notNull = cleanNullArgs(args);
              await Place.update({ id: args.placeId }, { ...notNull });
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
