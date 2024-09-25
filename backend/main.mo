import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    // Types
    type UserId = Principal;
    type QuestionId = Nat;
    type AnswerId = Nat;

    type User = {
        id: UserId;
        username: Text;
        reputation: Nat;
    };

    type Question = {
        id: QuestionId;
        title: Text;
        content: Text;
        authorId: UserId;
        createdAt: Time.Time;
        votes: Int;
    };

    type Answer = {
        id: AnswerId;
        questionId: QuestionId;
        content: Text;
        authorId: UserId;
        createdAt: Time.Time;
        votes: Int;
    };

    // State
    stable var nextQuestionId : Nat = 0;
    stable var nextAnswerId : Nat = 0;

    let users = HashMap.HashMap<UserId, User>(0, Principal.equal, Principal.hash);
    let questions = HashMap.HashMap<QuestionId, Question>(0, Nat.equal, Nat.hash);
    let answers = HashMap.HashMap<AnswerId, Answer>(0, Nat.equal, Nat.hash);

    // User Management
    public shared(msg) func register(username : Text) : async Bool {
        let userId = msg.caller;
        switch (users.get(userId)) {
            case (?user) { 
                return false; // User already exists
            };
            case null {
                let newUser : User = {
                    id = userId;
                    username = username;
                    reputation = 0;
                };
                users.put(userId, newUser);
                return true;
            };
        };
    };

    public query func getUser(userId : UserId) : async ?User {
        users.get(userId)
    };

    // Question Management
    public shared(msg) func askQuestion(title : Text, content : Text) : async QuestionId {
        let questionId = nextQuestionId;
        nextQuestionId += 1;

        let newQuestion : Question = {
            id = questionId;
            title = title;
            content = content;
            authorId = msg.caller;
            createdAt = Time.now();
            votes = 0;
        };

        questions.put(questionId, newQuestion);
        questionId
    };

    public query func getQuestion(questionId : QuestionId) : async ?Question {
        questions.get(questionId)
    };

    public query func getAllQuestions() : async [Question] {
        Iter.toArray(questions.vals())
    };

    // Answer Management
    public shared(msg) func answerQuestion(questionId : QuestionId, content : Text) : async ?AnswerId {
        switch (questions.get(questionId)) {
            case null { null };
            case (?_) {
                let answerId = nextAnswerId;
                nextAnswerId += 1;

                let newAnswer : Answer = {
                    id = answerId;
                    questionId = questionId;
                    content = content;
                    authorId = msg.caller;
                    createdAt = Time.now();
                    votes = 0;
                };

                answers.put(answerId, newAnswer);
                ?answerId
            };
        }
    };

    public query func getAnswer(answerId : AnswerId) : async ?Answer {
        answers.get(answerId)
    };

    public query func getAnswersForQuestion(questionId : QuestionId) : async [Answer] {
        Iter.toArray(
            Iter.filter(answers.vals(), func (answer : Answer) : Bool {
                answer.questionId == questionId
            })
        )
    };

    // Voting System
    public shared(msg) func voteQuestion(questionId : QuestionId, upvote : Bool) : async Bool {
        switch (questions.get(questionId)) {
            case null { false };
            case (?question) {
                let updatedQuestion = {
                    id = question.id;
                    title = question.title;
                    content = question.content;
                    authorId = question.authorId;
                    createdAt = question.createdAt;
                    votes = question.votes + (if upvote 1 else -1);
                };
                questions.put(questionId, updatedQuestion);
                true
            };
        }
    };

    public shared(msg) func voteAnswer(answerId : AnswerId, upvote : Bool) : async Bool {
        switch (answers.get(answerId)) {
            case null { false };
            case (?answer) {
                let updatedAnswer = {
                    id = answer.id;
                    questionId = answer.questionId;
                    content = answer.content;
                    authorId = answer.authorId;
                    createdAt = answer.createdAt;
                    votes = answer.votes + (if upvote 1 else -1);
                };
                answers.put(answerId, updatedAnswer);
                true
            };
        }
    };
};
