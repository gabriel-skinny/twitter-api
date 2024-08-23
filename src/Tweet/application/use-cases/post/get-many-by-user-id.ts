import { Post } from '../../entities/Post';
import AbstractBaseTweetRepository from '../../repositories/base';
import AbstractPostRepository from '../../repositories/post';
import { GetTweetBaseByIdUseCase } from '../base/get-by-id';

interface IGetPostByUserIdParams {
  userId: string;
  page?: number;
  perPage?: number;
  order?: 'Desc' | 'Asc';
  orderBy?: { id?: boolean; createdAt?: boolean };
}

interface IGetPostByUserIdReturn {
  post: Post;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
}

export class GetPostsByUserId {
  constructor(
    private readonly postRepository: AbstractPostRepository,
    private readonly baseTweetRepository: AbstractBaseTweetRepository,
    private readonly getTweetBaseByIdUseCase: GetTweetBaseByIdUseCase,
  ) {}

  async execute({
    userId,
    page,
    perPage,
    orderBy,
    order,
  }: IGetPostByUserIdParams): Promise<IGetPostByUserIdReturn[]> {
    const posts = await this.postRepository.findManyByUserId({
      userId,
      limit: perPage,
      skip: page * perPage - perPage,
      order,
      orderBy,
    });

    const returnFormat: IGetPostByUserIdReturn[] = [];

    for (const post of posts) {
      const { tweet, commentNumber, likeNumber, shareNumber } =
        await this.getTweetBaseByIdUseCase.execute(post.id);

      returnFormat.push({
        post: tweet,
        commentNumber,
        likeNumber,
        shareNumber,
      });
    }

    return returnFormat;
  }
}
