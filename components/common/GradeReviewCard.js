import React from 'react';
import axios from 'axios';

const GradeReviewCard = ({ review, jwt, slug, assignmentId }) => {
  const [comments, setComments] = React.useState(review.comments);
  const [commentInput, setCommentInput] = React.useState('');
  const onChangeComment = (e) => {
    setCommentInput(e.target.value);
  };

  const date = new Date(review.createdAt).toLocaleString();
  const status = (() => {
    if (review.status === 0) {
      return 'Pending';
    } else if (review.status === 1) {
      return 'Accepted';
    } else {
      return 'Rejected';
    }
  })();
  const renderComments = (comments) => {
    return comments.map((comment) => (
      <div key={comment._id} className="flex flex-col items-start">
        <div className="flex items-center">
          <div className="text-sm">
            <p className="font-bold">{comment.name}</p>
            <p className="text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <p className="mt-2 text-gray-700">{comment.content}</p>
      </div>
    ));
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (commentInput.length <= 0) return;
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/courses/${slug}/assignment/${assignmentId}/review/${review._id}/comment`,
      {
        content: commentInput,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const newComment = res.data.comment;
    setComments([...comments, newComment]);
    setCommentInput('');
  };

  const commentComponent = (
    <form className="w-full max-w-xl bg-white rounded-lg px-4 pt-2">
      <div className="flex flex-wrap -mx-3 mb-6">
        <h2 className="px-4 pt-3 pb-2 text-gray-800 text-lg">Add a new comment</h2>
        <div className="w-full md:w-full px-3 mb-2 mt-2">
          <textarea
            className="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
            name="body"
            placeholder="Type Your Comment"
            value={commentInput}
            onChange={onChangeComment}
            required
          ></textarea>
        </div>
        <div className="w-full flex items-start md:w-full px-3">
          <div className="flex items-start w-1/2 text-gray-700 px-2 mr-auto"></div>
          <div className="-mr-1">
            <input
              type="submit"
              className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
              value="Post Comment"
              onClick={handleCreateComment}
            />
          </div>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex justify-center">
      <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg">
        <div className="p-6 flex flex-col justify-start">
          <h5 className="text-gray-900 text-xl font-medium mb-2">{date}</h5>
          <div className="text-gray-900 text-base">
            Status: <span>{status}</span>
          </div>
          <div className="text-gray-900 text-base">
            Actual grade: <span>{review.actualGrade}</span>
          </div>
          <div className="text-gray-900 text-base mb-4">
            Expected grade: <span>{review.expectedGrade}</span>
          </div>
          <hr></hr>
          <p className="text-gray-600 text-xs mt-2 mb-2 font-bold">{comments.length} comments</p>
          {renderComments(comments)}
          {/* {create a comment input here} */}
          {commentComponent}
        </div>
      </div>
    </div>
  );
};

export default GradeReviewCard;
