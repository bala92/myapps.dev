import { Post } from '../post';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a post
  const post = Post.build({
    title: 'concert',
    imgUrl: '5',
    userId: '123',
  });

  // Save the ticket to the database
  await post.save();

  // fetch the ticket twice
  const firstInstance = await Post.findById(post.id);
  const secondInstance = await Post.findById(post.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ imgUrl: '10' });
  secondInstance!.set({ imgUrl: '15' });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  //expect(secondInstance!.save).toThrow(mongoose.Error.VersionError);
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const post = Post.build({
    title: 'concert',
    imgUrl: '20',
    userId: '123',
  });

  await post.save();
  expect(post.version).toEqual(0);
  await post.save();
  expect(post.version).toEqual(1);
  await post.save();
  expect(post.version).toEqual(2);
});
