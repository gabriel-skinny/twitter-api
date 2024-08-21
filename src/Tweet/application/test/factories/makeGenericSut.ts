import AbstractPostRepository from '../../repositories/post';
import AbstractMessageBroker from '../../services/messageBroker';
import { InMemoryPostRepository } from '../repositories/inMemoryTweetRepository';
import { MessageBrockerMock } from '../services/messageBroker';

export function makeGenericSut<T extends Object>({
  UseCaseClass,
  adicionalDependencies,
}: {
  UseCaseClass: new (
    postRepository: AbstractPostRepository,
    broker: AbstractMessageBroker,
    ...args: any[]
  ) => T;
  adicionalDependencies?: Object[];
}) {
  const postRepository = new InMemoryPostRepository();
  const messageBrocker = new MessageBrockerMock();

  let useCase: T;
  if (adicionalDependencies?.length)
    useCase = new UseCaseClass(
      postRepository,
      messageBrocker,
      ...adicionalDependencies,
    );
  else useCase = new UseCaseClass(postRepository, messageBrocker);

  return { useCase, postRepository, messageBrocker };
}
