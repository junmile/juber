import dotenv from 'dotenv';
dotenv.config();
import { Options } from 'graphql-yoga';
import { createConnection } from 'typeorm';
import app from './app';
import connectionOptions from './ormConfig';
import decodeJWT from './api/utils/decodeJWT';

const PORT: number | string = process.env.PORT || 4000;
const PLAYGROUND_ENDPOINT: string = '/playground';
const GRAPHQL_ENDPOINT: string = '/graphql';
const SUBSCRIPTION_ENDPOINT: string = '/subscription';

const appOptions: Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT,
    subscriptions: {
        path: SUBSCRIPTION_ENDPOINT,
        onConnect: async (connectionParams) => {
            const token = connectionParams['X-JWT'];
            if (token) {
                console.log('되냐? : ', token);
                const user = await decodeJWT(token);
                return {
                    currentUser: user,
                };
            }
            return null;
        },
    },
};

const handleAppStart = () => console.log(`listening on port ${PORT}`);

createConnection(connectionOptions)
    .then(() => {
        console.log('app start');
        app.start(appOptions, handleAppStart);
    })
    .catch((error) => console.log(error));
