import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

describe('blog content', () => {
  let component
  let addLike
  let removeBlog

  beforeEach(() => {
    const user = {
      username: 'aka',
      name: 'Meri',
      id: '60b5049d8f19b712e643200e'
    }

    const blog = {
      title: 'A test blog',
      author: 'A test author',
      url: 'www.test.com',
      likes: 10,
      user: user
    }

    addLike = jest.fn()
    removeBlog = jest.fn()

    component = render(
      <Blog
        blog={blog}
        addLike={addLike}
        removeBlog={removeBlog}
        currentUser={user}
      />
    )
  })

  test('renders title and author', () => {
    expect(component.container).toHaveTextContent(
      'A test blog'
    )
    expect(component.container).toHaveTextContent(
      'A test author'
    )
  })

  test('doesn\'t render url and likes by default', () => {
    const div = component.container.querySelector('.moreInfo')

    expect(div).toHaveTextContent(
      'www.test.com'
    )
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking button, renders url and likes', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.moreInfo')
    expect(div).toHaveTextContent(
      'www.test.com'
    )
    expect(div).not.toHaveStyle('display: none')
  })

  test('after clicking like button two times, two events fired', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(addLike.mock.calls).toHaveLength(2)
  })

})