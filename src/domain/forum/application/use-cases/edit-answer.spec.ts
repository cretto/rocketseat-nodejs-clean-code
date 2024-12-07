import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { EditAnswerUseCase } from './edit-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'

let answersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(answersRepository)
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('1'),
      },
      new UniqueEntityID('1'),
    )

    await answersRepository.create(newAnswer)

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: '1',
      content: 'Conteudo teste',
    })

    expect(answersRepository.items[0]).toEqual(
      expect.objectContaining({
        content: 'Conteudo teste',
      }),
    )
  })

  it('should not be able to edit a answer from another user', async () => {
    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityID('2'),
      },
      new UniqueEntityID('2'),
    )

    await answersRepository.create(newAnswer)

    const response = await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: '1',
      content: 'Conteudo teste',
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })
})
