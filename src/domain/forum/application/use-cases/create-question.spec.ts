import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let questionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(questionsRepository)
  })

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova pergunta',
      content: 'Conteudo da pergunta',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.question).toEqual(
      expect.objectContaining({
        title: 'Nova pergunta',
        content: 'Conteudo da pergunta',
      }),
    )
    expect(questionsRepository.items[0]).toEqual(result.value?.question)
  })
})
