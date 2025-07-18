import React from "react";
import { useParams } from "react-router-dom";
import mockCourses from "./mockCourses";

function CourseLearn() {
  const { id } = useParams();
  const course = mockCourses.find(c => c.id === Number(id));

  if (!course) return <div className="p-8 text-center">Không tìm thấy khóa học!</div>;

  // Mock nội dung học sinh động hơn
  const lessons = [
    {
      title: "Bài 1: Chào hỏi cơ bản",
      description: "Học cách chào hỏi và giới thiệu bản thân bằng tiếng Anh.",
      example: "Hello! My name is Nam. Nice to meet you!",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      quiz: {
        question: "'Hello' nghĩa là gì?",
        options: ["Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi"],
        answer: 0
      }
    },
    {
      title: "Bài 2: Bảng chữ cái tiếng Anh",
      description: "Làm quen với các chữ cái trong bảng chữ cái tiếng Anh.",
      example: "A, B, C, D, ... Z",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      quiz: {
        question: "Chữ cái đầu tiên trong bảng chữ cái tiếng Anh là gì?",
        options: ["A", "B", "C", "D"],
        answer: 0
      }
    },
    {
      title: "Bài 3: Số đếm",
      description: "Học các số đếm cơ bản bằng tiếng Anh.",
      example: "One, Two, Three, Four, Five...",
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
      quiz: {
        question: "'Three' là số mấy?",
        options: ["1", "2", "3", "4"],
        answer: 2
      }
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">{course.title}</h1>
      <p className="mb-4 text-gray-700">{course.description}</p>
      {/* Nếu là khóa học 1 thì nhúng video */}
      {course.id === 1 && (
        <div className="mb-6">
          <div className="aspect-w-16 aspect-h-9 mb-4" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              src="https://www.youtube.com/embed/zi8-KmrtuWM"
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <img src={course.teacherAvatar} className="w-10 h-10 rounded-full border-2 border-white mr-2" alt="Teacher" />
          <div>
            <p className="font-medium text-gray-800">{course.teacherName}</p>
            <p className="text-xs text-gray-600">{course.teacherRole}</p>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-3 text-blue-500">Nội dung học</h2>
      <ul className="space-y-8">
        {lessons.map((lesson, idx) => (
          <li key={idx} className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-700 mb-1 text-lg">{lesson.title}</h3>
            <div className="text-gray-700 mb-2">{lesson.description}</div>
            <div className="mb-2"><span className="font-semibold text-blue-600">Ví dụ:</span> {lesson.example}</div>
            <img src={lesson.image} alt={lesson.title} className="w-full h-40 object-cover rounded mb-2" />
            <div className="mt-2">
              <span className="font-semibold text-blue-600">Quiz:</span> {lesson.quiz.question}
              <ul className="mt-1 space-y-1">
                {lesson.quiz.options.map((opt, i) => (
                  <li key={i} className="flex items-center">
                    <input type="radio" name={`quiz-${idx}`} id={`quiz-${idx}-opt-${i}`} className="mr-2" disabled />
                    <label htmlFor={`quiz-${idx}-opt-${i}`}>{opt}</label>
                  </li>
                ))}
              </ul>
              <div className="text-green-600 mt-1 text-sm">Đáp án đúng: <b>{lesson.quiz.options[lesson.quiz.answer]}</b></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseLearn; 