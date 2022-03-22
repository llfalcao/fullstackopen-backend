import { Blog } from '../models/Blog';
import listHelper from '../utils/list_helper';
import listWithMultipleBlogs from '../db/blogs.json';

test('dummy returns one', () => {
  const blogs: Blog[] = [];
  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of one blog to be equal to their like count', () => {
    const listWithOneBlog: Blog[] = [
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      },
    ];

    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of multiple blogs', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs);
    expect(result).toBe(36);
  });
});

test('favorite blog', () => {
  const result = listHelper.favoriteBlog(listWithMultipleBlogs);
  expect(result).toEqual({
    author: 'Edsger W. Dijkstra',
    likes: 12,
    title: 'Canonical string reduction',
  });
});

test('most blogs', () => {
  const result = listHelper.mostBlogs(listWithMultipleBlogs);
  expect(result).toEqual({ name: 'Robert C. Martin', count: 3 });
});
