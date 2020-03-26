import { Resolvers } from '../../../types/resolvers';
import privateResolver from '../../utils/privateResolver';
import {
  SendChatMessageResponse,
  SendChatMessageMutationArgs
} from '../../../types/graph';
import User from '../../../entities/User';
import Message from '../../../entities/Message';
import Chat from '../../../entities/Chat';

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: privateResolver(
      async (
        _,
        args: SendChatMessageMutationArgs,
        { req }
      ): Promise<SendChatMessageResponse> => {
        const user: User = req.user;
        try {
          const chat = await Chat.findOne({ id: args.chatId });
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              const message: any = await Message.create({
                text: args.text,
                chat,
                user
              }).save();
              return {
                ok: true,
                error: null,
                message
              };
            } else {
              return {
                ok: true,
                error: 'unauthorized',
                message: null
              };
            }
          } else {
            return {
              ok: false,
              error: 'chat not found',
              message: null
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            message: null
          };
        }
      }
    )
  }
};

export default resolvers;
