import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@onebox/common';
import { Post } from '../models/post';
import { PostUpdatedPublisher } from '../events/publishers/post-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/posts/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new NotFoundError();
    }

    if (post.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    post.set({
      title: req.body.title,
      imgUrl: req.body.imgUrl,
    });
    await post.save();
    new PostUpdatedPublisher(natsWrapper.client).publish({
      id: post.id,
      title: post.title,
      imgUrl: post.imgUrl,
      userId: post.userId,
      version: post.version,
    });

    res.send(post);
  }
);

export { router as updatePostRouter };
