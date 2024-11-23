import { expect, test } from 'vitest'
import { Slug } from './slug'

test('it should be able to create', () => {
  const slug = Slug.createFromText('Example question title')

  expect(slug.value).toEqual('example-question-title')
})
