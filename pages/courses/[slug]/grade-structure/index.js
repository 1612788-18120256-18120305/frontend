import React from 'react';
import { BACKEND_URL } from '../../../../lib/Utils';
import { getSession } from 'next-auth/react';
import { DragDropContext, Droppable, Draggable } from '../../../../components/common/dnd_component';

function GradeStructure({ listAssignment }) {
  return (
    <div className="">
      <div className="font-semibold text-center py-6 bordered">
        <h2 className="text-3xl text-red-500">Grade Structure</h2>
      </div>
      <DragDropContext>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ul className="mt-4 w-2/5 mx-auto" {...provided.droppableProps} ref={provided.innerRef}>
              {listAssignment.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      className="relative flex flex-col mb-3 rounded bg-gray-100 p-4"
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
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
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
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
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
    },
  };
};
