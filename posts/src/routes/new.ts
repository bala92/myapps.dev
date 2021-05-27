import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@onebox/common';
import { Post } from '../models/post';
import { PostCreatedPublisher } from '../events/publishers/post-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/posts',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, imgUrl } = req.body;

    const post = Post.build({
      title,
      imgUrl,
      userId: req.currentUser!.id,
    });
    await post.save();
    new PostCreatedPublisher(natsWrapper.client).publish({
      id: post.id,
      title: post.title,
      imgUrl: post.imgUrl,
      userId: post.userId,
      version: post.version,
    });

    res.status(201).send(post);
  }
);

export { router as createPostRouter };
