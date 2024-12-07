import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { ChooseQuestionBestAnswerUseCase } from './choose-question-best-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { NotAllowedError } from './errors/not-allowed-error'

let questionsRepository: InMemoryQuestionsRepository
let answersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      questionsRepository,
      answersRepository,
    )
  })

  it('should be able to choose question best answer', async () => {
    const newQuestion = makeQuestion()
    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await questionsRepository.create(newQuestion)
    await answersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: newQuestion.authorId.toString(),
    })

    expect(questionsRepository.items[0].bestAnswerId).toEqual(newAnswer.id)
  })

  it('should not be able to choose another user question best answer', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityID('1'),
    })
    const newAnswer = makeAnswer({
      questionId: newQuestion.id,
    })

    await questionsRepository.create(newQuestion)
    await answersRepository.create(newAnswer)

    const result = await sut.execute({
      answerId: newAnswer.id.toString(),
      authorId: '2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(answersRepository.items).toHaveLength(1)
  })
})
