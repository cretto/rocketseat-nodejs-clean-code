import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let questionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(questionsRepository)
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('1'),
      },
      new UniqueEntityID('1'),
    )

    await questionsRepository.create(newQuestion)

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: '1',
      title: 'Pergunta teste',
      content: 'Conteudo teste',
    })

    expect(questionsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'Pergunta teste',
        content: 'Conteudo teste',
      }),
    )
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('2'),
      },
      new UniqueEntityID('2'),
    )

    await questionsRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        questionId: newQuestion.id.toValue(),
        authorId: '1',
        title: 'Pergunta teste',
        content: 'Conteudo teste',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
