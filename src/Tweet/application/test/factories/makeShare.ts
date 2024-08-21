import { Share } from '../../entities/Share';
import { MakeSomeFieldsRequired } from './makeComment';

type makeShareParams = MakeSomeFieldsRequired<
  Partial<Share>,
  'creatorReferenceTweetId' | 'parentId' | 'parentType'
>;

export const makeShare = (params: makeShareParams) => {
  return new Share({
    content: 'Teste',
    userId: 'id',
    ...params,
  });
};
