import cors from 'cors';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import helmet from 'helmet';
import logger from 'morgan';
import schema from './schema';
import decodeJWT from './api/utils/decodeJWT';
import { NextFunction, Response } from 'express';
import { ContextParameters } from 'graphql-yoga/dist/types';

class App {
    public app: GraphQLServer;
    public pubSub: any;
    constructor() {
        this.pubSub = new PubSub();
        this.pubSub.ee.setMaxListeners(0);
        this.app = new GraphQLServer({
            schema,
            context: (info: ContextParameters) => {
                const { connection: { context = null } = {} } = info;
                return {
                    req: info.request,
                    pubSub: this.pubSub,
                    context,
                };
            },
        });
        this.middlewares();
    }
    private middlewares = (): void => {
        this.app.express.use(cors());
        this.app.express.use(logger('dev'));
        this.app.express.use(helmet());
        this.app.express.use(this.jwt);
    };

    private jwt = async (req, res: Response, next: NextFunction): Promise<void> => {
        const token = req.get('X-JWT');
        if (token) {
            const user = await decodeJWT(token);
            if (user) {
                req.user = user;
            } else {
                req.user = undefined;
            }
        }
        next();
    };
}

export default new App().app;
