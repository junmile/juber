import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import {
  RequestRideMutationArgs,
  RequestRideResponse
} from '../../../types/graph';
import User from '../../../entities/User';
import Ride from '../../../entities/Ride';

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (
        _,
        args: RequestRideMutationArgs,
        { req }
      ): Promise<RequestRideResponse> => {
        const user: User = req.user;
        console.log(user);
        try {
          const ride: Ride | any = await Ride.create({
            ...args,
            passenger: user
          }).save();
          console.log(ride);
          return {
            ok: true,
            error: null,
            ride
          };
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null
          };
        }
      }
    )
  }
};

export default resolvers;
