import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@onebox/common';
import { createPostRouter } from './routes/new';
import { showPostRouter } from './routes/show';
import { indexPostRouter } from './routes/index';
import { updatePostRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false && process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(createPostRouter);
app.use(showPostRouter);
app.use(indexPostRouter);
app.use(updatePostRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
