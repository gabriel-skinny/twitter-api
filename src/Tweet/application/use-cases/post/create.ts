import { Post } from '../../entities/Post';
import AbstractPostRepository from '../../repositories/post';
import AbstractMessageBroker, {
  EVENT_TYPES_ENUM,
} from '../../services/messageBroker';

interface ICreatePostUseCaseParams {
  userId: string;
  content: string;
  mediaUrl?: string;
}

export default class CreatePostUseCase {
  constructor(
    private postRepository: AbstractPostRepository,
    private messageBrokerService: AbstractMessageBroker,
  ) {}

  async execute({ userId, content, mediaUrl }: ICreatePostUseCaseParams) {
    const post = new Post({
      userId,
      content,
      mediaUrl,
    });

    await this.postRepository.save(post);

    await this.messageBrokerService.sendEvent({
      eventType: EVENT_TYPES_ENUM.TWEET_CREATION,
      data: { userId, postId: post.id },
    });
  }
}
