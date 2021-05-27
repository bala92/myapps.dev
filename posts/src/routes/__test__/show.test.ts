import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the post is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/posts/${id}`).send().expect(404);
});

it('returns the post if the post is found', async () => {
  const title = 'concert';
  const imgUrl = '20';

  const response = await request(app)
    .post('/api/posts')
    .set('Cookie', global.signin())
    .send({
      title,
      imgUrl,
    })
    .expect(201);

  const postResponse = await request(app)
    .get(`/api/post/${response.body.id}`)
    .send()
    .expect(200);

  expect(postResponse.body.title).toEqual(title);
  expect(postResponse.body.imgUrl).toEqual(imgUrl);
});
