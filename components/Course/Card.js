import Link from 'next/link';
export default function CourseCard({ course }) {
  return (
    <div className="w-96 card bordered">
      <figure>
        <img src="https://www.gstatic.com/classroom/themes/img_backtoschool.jpg" />
      </figure>
      <div className="absolute right-5 top-16 avatar">
        <div className="mb-8 rounded-full w-16 h-16 ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src="https://lh3.googleusercontent.com/a/default-user=s75-c" />
        </div>
      </div>
      <div className="card-body">
        <Link href={`/courses/${course.slug}`}>
          <div className="cursor-pointer hover:text-red-500">
            <h2 className="card-title">Course: {course.name}</h2>
            <p>Description: {course.description}</p>
          </div>
        </Link>

        <div className="justify-end card-actions">
          <Link href={`/courses/${course.slug}`}>
            <button className="btn btn-secondary">More info</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
