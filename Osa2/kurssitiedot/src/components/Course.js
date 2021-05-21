import React from 'react';

const Header = ({ name }) => {
  return (
    <h1>{name}</h1>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((acc, curr) => {
    return acc + curr.exercises;
  }, 0);
  return (
    <div>
      <p>total of {total} exercises</p>
    </div>
  );
};

const Part = ({ name, exercises }) => {
  return (
    <li>
      {" "}
      {name} {exercises}{" "}
    </li>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      <ul>
        {parts.map((part, id) => (
          <Part key={part.id} name={part.name} exercises={part.exercises} />
        ))}
      </ul>
    </div>
  );
};

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;