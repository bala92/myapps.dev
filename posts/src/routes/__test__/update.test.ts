import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Post } from '../../models/post';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/posts/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdfj',
      imgUrl: '20',
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/posts/${id}`)
    .send({
      title: 'aslkdfj',
      imgUrl: '20',
    })
    .expect(401);
});

it('returns a 401 if the user does not own the post', async () => {
  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkfj',
      imgUrl: '20',
    });

  await request(app)
    .put(`/api/posts/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'alskdjflskjdf',
      imgUrl: '1000',
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      imgUrl: '20',
    });

  await request(app)
    .put(`/api/posts/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      imgUrl: '20',
    })
    .expect(400);

});

it('updates the post provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      imgUrl: '20',
    });

  await request(app)
    .put(`/api/posts/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      imgUrl: '100',
    })
    .expect(200);

  const postResponse = await request(app)
    .get(`/api/post/${response.body.id}`)
    .send();

  expect(postResponse.body.title).toEqual('new title');
  expect(postResponse.body.imgUrl).toEqual('100');
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      imgUrl: '20',
    });

  await request(app)
    .put(`/api/posts/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      imgUrl: '100',
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
