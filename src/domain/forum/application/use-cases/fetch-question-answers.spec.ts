import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswersUseCase } from './fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let answersRepository: InMemoryAnswersRepository
let answerAttachmentRepository: InMemoryAnswerAttachmentRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    answerAttachmentRepository = new InMemoryAnswerAttachmentRepository()
    answersRepository = new InMemoryAnswersRepository(
      answerAttachmentRepository,
    )
    sut = new FetchQuestionAnswersUseCase(answersRepository)
  })

  it('should be able to fetch question answers', async () => {
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('1') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('1') }),
    )
    await answersRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('1') }),
    )

    const response = await sut.execute({
      questionId: '1',
      page: 1,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await answersRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('1') }),
      )
    }

    const response = await sut.execute({ questionId: '1', page: 2 })

    expect(response.isRight()).toBe(true)
    expect(response.value?.answers).toHaveLength(2)
  })
})
