import NotFoundCustomError from 'src/Shared/errors/notFound';
import AbstractPostRepository from '../../repositories/post';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

interface ICreatepostUseCaseParams {
  userId: string;
  postId: string;
}

export default class DeletepostUseCase {
  constructor(
    private postRepository: AbstractPostRepository,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute({ userId, postId }: ICreatepostUseCaseParams) {
    const post = await this.postRepository.existsById(postId);

    if (!post) throw new NotFoundCustomError('post');

    await this.postRepository.deleteById(postId);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_DELETION,
      data: { userId, postId },
    });
  }
}
