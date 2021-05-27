import { Publisher, Subjects, PostUpdatedEvent } from '@onebox/common';

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
  subject: Subjects.PostUpdated = Subjects.PostUpdated;
}
