import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import { GetChatQueryArgs, GetChatResponse } from '../../../types/graph';
import Chat from '../../../entities/Chat';
import User from '../../../entities/User';

const resolvers: Resolvers = {
  Query: {
    GetChat: privateResolver(
      async (_, args: GetChatQueryArgs, { req }): Promise<GetChatResponse> => {
        const user: User = req.user;
        const { type, id } = args;
        try {
          let chat: any;
          if (type === 'chatId') {
            chat = await Chat.findOne(
              {
                id: id,
              },
              { relations: ['messages'] }
            );
          } else {
            chat = await Chat.findOne(
              {
                rideId: id,
              },
              { relations: ['messages'] }
            );
          }

          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              return {
                ok: true,
                error: null,
                chat,
              };
            } else {
              return {
                ok: false,
                error: 'not authorized to see this chat',
                chat: null,
              };
            }
          } else {
            return {
              ok: false,
              error: 'not found',
              chat: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            chat: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
