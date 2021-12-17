import Link from 'next/link';
export default function BC({ _data, active }) {
  return (
    <div className="btn-group">
      <Link href={`/courses/${_data.course.slug}`}>
        <button className={`btn ${active == '/' && 'btn-active'}`}>Overview</button>
      </Link>
      <Link href={`/courses/${_data.course.slug}/users`}>
        <button className={`btn ${active == 'users' && 'btn-active'}`}>Users</button>
      </Link>
      {_data.course.joinId && (
        <Link href={`/courses/${_data.course.slug}/grade-structure`}>
          <button className={`btn ${active == 'grade-structure' && 'btn-active'}`}>
            Grade Structure
          </button>
        </Link>
      )}
      {_data.course.joinId && (
        <Link href={`/courses/${_data.course.slug}/grade-board`}>
          <button className={`btn ${active == 'grade-board' && 'btn-active'}`}>
            Grade Board
          </button>
        </Link>
      )}
    </div>
  );
}