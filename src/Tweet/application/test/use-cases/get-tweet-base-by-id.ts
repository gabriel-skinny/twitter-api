import {
  AbstractGetTweetBaseByIdUseCase,
  IGetBaseTweet,
} from '../../use-cases/base/get-by-id';
import { makeMockReturnBaseTweet } from '../factories/makeMockReturnBaseTweet';

import { makePost } from '../factories/makePost';

export class GetTweetBaseByIdUseCaseMock
  implements AbstractGetTweetBaseByIdUseCase
{
  async execute(id: string): Promise<IGetBaseTweet | null> {
    return makeMockReturnBaseTweet(makePost());
  }
}
