import { Post } from '../../entities/Post';
import AbstractPostRepository from '../../repositories/post';
import { AbstractGetTweetBaseByIdUseCase } from '../base/get-by-id';

interface IGetPostByUserIdParams {
  userId: string;
  page?: number;
  perPage?: number;
  order?: 'Desc' | 'Asc';
  orderBy?: { id?: boolean; createdAt?: boolean };
}

export interface IGetPostByUserIdReturn {
  post: Post;
  likeNumber: number;
  shareNumber: number;
  commentNumber: number;
}

export class GetPostsByUserId {
  constructor(
    private readonly postRepository: AbstractPostRepository,
    private readonly getTweetBaseByIdUseCase: AbstractGetTweetBaseByIdUseCase,
  ) {}

  async execute({
    userId,
    page,
    perPage,
    orderBy,
    order,
  }: IGetPostByUserIdParams): Promise<IGetPostByUserIdReturn[] | null> {
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
