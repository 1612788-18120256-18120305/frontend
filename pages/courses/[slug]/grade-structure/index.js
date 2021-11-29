import React from 'react';
import { BACKEND_URL } from '../../../../lib/Utils';
import { getSession } from 'next-auth/react';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from '../../../../components/common/dnd_component';

function GradeStructure({ listAssignment }) {
  return (
    <div>
      <h2>Grade Structure</h2>
      <DragDropContext>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {listAssignment.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided, snapshot) => (
                    <li
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      {item.name}
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
  const res = await fetch(
    BACKEND_URL + `/courses/${context.query.slug}/assignment`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${_session?.jwt}`,
      },
    }
  );
  const data = await res.json();
  return {
    props: {
      listAssignment: data.assignments,
    },
  };
};
