import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import User from '../../../entities/User';
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusResponse
} from '../../../types/graph';
import Ride from '../../../entities/Ride';

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req }
      ): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            const ride = await Ride.findOne({
              id: args.rideId,
              status: 'REQUESTING'
            });
            if (ride) {
              ride.status = args.status;
            } else {
              return {
                ok: false,
                error: 'Cant update ride'
              };
            }
          } catch (error) {
            return { ok: false, error: error.message };
          }
        } else {
          return {
            ok: false,
            error: 'User is no driving'
          };
        }
      }
    )
  }
};
