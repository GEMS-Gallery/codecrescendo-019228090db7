export const idlFactory = ({ IDL }) => {
  const QuestionId = IDL.Nat;
  const AnswerId = IDL.Nat;
  const UserId = IDL.Principal;
  const Time = IDL.Int;
  const Question = IDL.Record({
    'id' : QuestionId,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'authorId' : UserId,
    'votes' : IDL.Int,
    'createdAt' : Time,
  });
  const Answer = IDL.Record({
    'id' : AnswerId,
    'content' : IDL.Text,
    'authorId' : UserId,
    'votes' : IDL.Int,
    'createdAt' : Time,
    'questionId' : QuestionId,
  });
  const User = IDL.Record({
    'id' : UserId,
    'username' : IDL.Text,
    'reputation' : IDL.Nat,
  });
  return IDL.Service({
    'answerQuestion' : IDL.Func(
        [QuestionId, IDL.Text],
        [IDL.Opt(AnswerId)],
        [],
      ),
    'askQuestion' : IDL.Func([IDL.Text, IDL.Text], [QuestionId], []),
    'getAllQuestions' : IDL.Func([], [IDL.Vec(Question)], ['query']),
    'getAnswer' : IDL.Func([AnswerId], [IDL.Opt(Answer)], ['query']),
    'getAnswersForQuestion' : IDL.Func(
        [QuestionId],
        [IDL.Vec(Answer)],
        ['query'],
      ),
    'getQuestion' : IDL.Func([QuestionId], [IDL.Opt(Question)], ['query']),
    'getUser' : IDL.Func([UserId], [IDL.Opt(User)], ['query']),
    'register' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'voteAnswer' : IDL.Func([AnswerId, IDL.Bool], [IDL.Bool], []),
    'voteQuestion' : IDL.Func([QuestionId, IDL.Bool], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
