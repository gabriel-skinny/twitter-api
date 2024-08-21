import { Comment } from '../../entities/Comment';

export type MakeSomeFieldsRequired<T, K extends keyof T> = {
  [P in K]-?: T[P];
} & Omit<T, K>;

type makeCommentParams = MakeSomeFieldsRequired<
  Partial<Comment>,
  'creatorReferenceTweetId' | 'parentId' | 'parentType'
>;

export const makeComment = (params: makeCommentParams) => {
  return new Comment({
    content: 'Teste',
    userId: 'id',
    ...params,
  });
};
