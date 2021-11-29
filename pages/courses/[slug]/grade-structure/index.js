import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../../../lib/Utils';
import { getSession } from 'next-auth/react';
import { DragDropContext, Droppable, Draggable } from '../../../../components/common/dnd_component';
import axios from 'axios';

function GradeStructure({ listAssignment, _session, slug }) {
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [assignments, setAssignments] = useState(listAssignment);

  function handleChange(e) {
    const name = e.target.name;
    if (name === 'title') {
      setTitle(e.target.value);
    } else {
      setDetail(e.target.value);
    }
  }

  console.log(assignments);

  async function handleCreateAssigment(event) {
    event.preventDefault();

    const res = await axios.post(
      BACKEND_URL + `/courses/${slug}/assignment`,
      { name: title, point: detail },
      {
        headers: {
          Authorization: `Bearer ${_session?.jwt}`,
        },
      }
    );

    // const data = await res.json();
    setAssignments([...assignments, res.data.assignment]);
    setTitle('');
    setDetail('');
  }

  return (
    <div className="mt-4 w-2/5 mx-auto">
      <div className="font-semibold text-center py-6 bordered">
        <h2 className="text-3xl text-red-500">Grade Structure</h2>
      </div>
      <DragDropContext>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ul className="" {...provided.droppableProps} ref={provided.innerRef}>
              {assignments.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      className="flex flex-col mb-3 rounded bg-gray-100 p-4"
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <div className="flex justify-center items-center w-full">
                        <input
                          className="
                          mb-2
                          text-sm
                          placeholder-gray-500
                          pl-10
                          pr-4
                          border border-gray-400
                          w-full
                          py-2
                          focus:outline-none focus:border-blue-400"
                          value={item.name}
                          disabled
                        />
                        <button className="p-1 ml-2 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300 mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex justify-center items-center w-full">
                        <input
                          className="
                          mb-2
                          text-sm
                          placeholder-gray-500
                          pl-10
                          pr-4
                          border border-gray-400
                          w-full
                          py-2
                          focus:outline-none focus:border-blue-400"
                          value={item.point}
                          disabled
                        />
                        <button className="p-1 ml-2 bg-red-500 text-gray-100 text-lg rounded-lg focus:border-4 border-red-300">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                        </button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <div className="flex flex-col mt-5 mb-5 rounded bg-gray-100 p-4">
        <h2 className="text-xl mb-2 font-semibold ">Form creator</h2>
        <form onSubmit={handleCreateAssigment}>
          <div className="form-group">
            <label htmlFor="title" className="mb-2">
              Grade title
            </label>
            <input
              id="title"
              name="title"
              className="mb-2
                text-sm
                placeholder-gray-500
                px-4
                border border-gray-400
                w-full
                py-2
                focus:outline-none focus:border-blue-400"
              value={title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="detail" className="mb-2">
              Grade detail
            </label>
            <input
              id="detail"
              name="detail"
              className="mb-2
              text-sm
              placeholder-gray-500
              px-4
              border border-gray-400
              w-full
              py-2
              focus:outline-none focus:border-blue-400"
              value={detail}
              onChange={handleChange}
            />
          </div>
          <button className="mt-2 btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default GradeStructure;

export const getServerSideProps = async (context) => {
  const _session = await getSession(context);
  const res = await fetch(BACKEND_URL + `/courses/${context.query.slug}/assignment`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${_session?.jwt}`,
    },
  });
  const data = await res.json();
  return {
    props: {
      listAssignment: data.assignments,
      _session: _session,
      slug: context.query.slug,
    },
  };
};
