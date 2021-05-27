import { Publisher, Subjects, PostCreatedEvent } from '@onebox/common';

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
  subject: Subjects.PostCreated = Subjects.PostCreated;
}
