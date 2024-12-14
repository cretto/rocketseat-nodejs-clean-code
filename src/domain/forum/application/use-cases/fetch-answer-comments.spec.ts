import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { makeAnswerComment } from 'test/factories/make-answer-comment'

let answerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer AnswerComments', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('1') }),
    )

    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('1') }),
    )

    await answerCommentsRepository.create(
      makeAnswerComment({ answerId: new UniqueEntityID('1') }),
    )

    const response = await sut.execute({
      answerId: '1',
      page: 1,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await answerCommentsRepository.create(
        makeAnswerComment({ answerId: new UniqueEntityID('1') }),
      )
    }

    const response = await sut.execute({ answerId: '1', page: 2 })

    expect(response.isRight()).toBe(true)
    expect(response.value?.answerComments).toHaveLength(2)
  })
})
