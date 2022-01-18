import React, { useState } from 'react';
import { getSession } from 'next-auth/react';
import { DragDropContext, Droppable, Draggable } from '../../../../components/common/dnd_component';
import axios from 'axios';
import Layout from '../../../../components/Layout';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

function GradeStructure({ listAssignment, course }) {
  const { jwt } = useSelector((state) => state.storeManage);

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [assignments, setAssignments] = useState(listAssignment);
  // const [disabled, setDisabled] = useState(true);

  function handleChange(e) {
    const name = e.target.name;
    if (name === 'title') {
      setTitle(e.target.value);
    } else {
      if(e.target.value >= 0) {
        setDetail(e.target.value);
      }
    }
  }

  async function handleCreateAssigment(event) {
    event.preventDefault();

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${course.slug}/assignment`,
      { name: title, point: detail },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success) {
      toast.success(res.data.message);
      setAssignments([...assignments, res.data.assignment]);
      setTitle('');
      setDetail('');
    } else {
      toast.error(res.data.message);
    }
  }

  async function handleEdit(item, index) {
    assignments[index].canEdit = assignments[index].canEdit === false ? true : false;
    setAssignments([...assignments]);

    // console.log(assignments[index].canEdit);
    if (assignments[index].canEdit == true) {
      const res = await axios.patch(
        process.env.NEXT_PUBLIC_BACKEND_URL + `/courses/${course.slug}/assignment/${item._id}`,
        { name: assignments[index].name, point: assignments[index].point },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    }
  }

  async function handleDelete(item, index) {
    const res = await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_URL + `/courses/${course.slug}/assignment/${item._id}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success) {
      toast.success(res.data.message);
      assignments.splice(index, 1);
      setAssignments([...assignments]);
    } else {
      toast.error(res.data.message);
    }
  }

  async function handleOnDrapEnd(result) {
    if (!result.destination) return;
    const items = Array.from(assignments);
    const [reorderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItems);
    setAssignments(items);
    const assignmentIds = items.map((item) => item._id);
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${course._id}`,
      { assignments: assignmentIds },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    if (res.data.success) {
      toast.success(res.data.message);
    } else {
      toast.error(res.data.message);
    }
  }

  return (
    <div className="xl:w-2/5 xl:mx-auto">
      <div className="font-semibold text-center pb-2 bordered">
        <h2 className="text-3xl text-red-500">Grade Structure</h2>
      </div>
      <DragDropContext onDragEnd={handleOnDrapEnd}>
        <Droppable droppableId="assignments">
          {(provided) => (
            <ul className="assignments" {...provided.droppableProps} ref={provided.innerRef}>
              {assignments.map((item, index) => (
                <Draggable key={item._id} draggableId={item._id} index={index}>
                  {(provided) => (
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
                          onChange={(e) => {
                            assignments[index].name = e.target.value;
                            setAssignments([...assignments]);
                          }}
                          disabled={item.canEdit == undefined ? true : item.canEdit}
                        />
                        <button
                          onClick={() => handleEdit(item, index)}
                          className="p-1 ml-2 bg-blue-500 text-gray-100 text-lg rounded-lg focus:border-4 border-blue-300 mb-2"
                        >
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
                          type="number"
                          value={item.point}
                          onChange={(e) => {
                            if(e.target.value >= 0) {
                              assignments[index].point = e.target.value;
                              setAssignments([...assignments]);
                            }
                          }}
                          disabled={item.canEdit == undefined ? true : item.canEdit}
                        />
                        <button
                          onClick={() => handleDelete(item, index)}
                          className="p-1 ml-2 bg-red-500 text-gray-100 text-lg rounded-lg focus:border-4 border-red-300"
                        >
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
              {provided.placeholder}
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
              Ratio
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
              type="number"
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
GradeStructure.getLayout = function getLayout(page) {
  return (
    <Layout active={'/courses'} url={'grade-structure'}>
      {page}
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  const _session = await getSession(ctx);

  if (!_session) {
    return {
      redirect: {
        permanent: false,
        destination: '/auth/login',
      },
    };
  }

  const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${ctx.query.slug}`, {
    headers: {
      Authorization: `Bearer ${_session.jwt}`,
    },
  });

  if (res.data.success) {
    const course = res.data.course;
    const temp = course.teachers.map((item) => item._id);

    if (!temp.includes(_session.user._id)) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        course,
        listAssignment: course.assignments,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/courses',
      },
    };
  }
}
