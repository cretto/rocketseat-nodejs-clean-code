import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let questionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question QuestionComments', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await questionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('1') }),
    )

    await questionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('1') }),
    )

    await questionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('1') }),
    )

    const response = await sut.execute({
      questionId: '1',
      page: 1,
    })

    expect(response.isRight()).toBe(true)
    expect(response.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await questionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('1') }),
      )
    }

    const result = await sut.execute({ questionId: '1', page: 2 })

    expect(result.value?.questionComments).toHaveLength(2)
  })
})
