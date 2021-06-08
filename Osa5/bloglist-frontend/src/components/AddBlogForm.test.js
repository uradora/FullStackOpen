import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AddBlogForm from './AddBlogForm'

test('AddBlogForm updates calls handler function with the correct info on submit', () => {
  const createBlog = jest.fn()

  const component = render(<AddBlogForm createBlog={createBlog} />)

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('#form')

  fireEvent.change(title, {
    target: { value: 'Uuninpankkopoika' },
  })
  fireEvent.change(author, {
    target: { value: 'Saku Timonen' },
  })
  fireEvent.change(url, {
    target: { value: 'https://blogit.apu.fi/uuninpankkopoikasakutimonen/' },
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls.length).toBe(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Uuninpankkopoika')
  expect(createBlog.mock.calls[0][0].author).toBe('Saku Timonen')
  expect(createBlog.mock.calls[0][0].url).toBe(
    'https://blogit.apu.fi/uuninpankkopoikasakutimonen/'
  )
})
