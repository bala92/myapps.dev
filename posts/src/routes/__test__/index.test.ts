import request from 'supertest';
import { app } from '../../app';

const createPost = () => {
  return request(app).post('/api/posts').set('Cookie', global.signin()).send({
    title: 'asldkf',
    imgUrl: '20',
  });
};

it('can fetch a list of posts', async () => {
  await createPost();
  await createPost();
  await createPost();

  const response = await request(app).get('/api/posts').send().expect(200);

  expect(response.body.length).toEqual(3);
});
