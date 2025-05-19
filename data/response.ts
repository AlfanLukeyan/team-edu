
export const response = {
  "getAllClasses": {
    "status": "success",
    "data": [
      {
        "id": "1",
        "title": "Mathematics 101",
        "class_code": "Class A",
        "desc": "Master the fundamentals of mathematics"
      },
      {
        "id": "2",
        "title": "Introduction to Physics",
        "class_code": "Class B",
        "desc": "Learn the basic principles of physics"
      },
      {
        "id": "3",
        "title": "Computer Science Basics",
        "class_code": "Class C",
        "desc": "Enhance your programming skills through this class"
      },
      {
        "id": "4",
        "title": "English Literature",
        "class_code": "Class D",
        "desc": "Explore classic and modern literature"
      },
      {
        "id": "5",
        "title": "History of Art",
        "class_code": "Class E",
        "desc": "A journey through the history of art and its movements"
      },
      {
        "id": "6",
        "title": "Biology 101",
        "class_code": "Class F",
        "desc": "Understand the basics of biology and life sciences"
      },
      {
        "id": "7",
        "title": "Chemistry Fundamentals",
        "class_code": "Class G",
        "desc": "Dive into the world of chemistry and its applications"
      },
      {
        "id": "8",
        "title": "Introduction to Psychology",
        "class_code": "Class H",
        "desc": "Discover the basics of human behavior and mind"
      },
      {
        "id": "9",
        "title": "Economics 101",
        "class_code": "Class I",
        "desc": "Learn the principles of economics and its impact on society"
      },
    ]
  },
  "getWeeklyContent": {
    "status": "success",
    "data": [
      {
        "id": "1",
        "count": 1,
        "title": "Introduction to Mathematics",
        "description": "Basic concepts and fundamentals",
        "videoUrl": "https://www.youtube.com/watch?v=zuFh9lfb4HY",
        "attachment": {
          "name": "Week 1 Notes.pdf",
          "url": "https://example.com/math-week1.pdf"
        },
        "assignment": {
          "title": "Math Assignment 1",
          "dueDate": "2023-10-15",
          "description": "Solve the problems in the attached worksheet.",
        }
      },
      {
        "id": "2",
        "count": 2,
        "title": "Algebra Fundamentals",
        "description": "Working with variables and equations",
        "videoUrl": "https://www.youtube.com/watch?v=zuFh9lfb4HY",
        "attachment": {
          "name": "Algebra Worksheets.pdf",
          "url": "https://example.com/algebra-sheets.pdf"
        },
        "assignment": {
          "title": "Algebra Assignment 1",
          "dueDate": "2023-10-20",
          "description": "Complete the exercises in the attached document.",
        }
      },
      {
        "id": "3",
        "count": 3,
        "title": "Geometry Basics",
        "description": "Shapes, angles and measurements",
        "videoUrl": "https://www.youtube.com/watch?v=zuFh9lfb4HY",
        "attachment": {
          "name": "Geometry Practice.pdf",
          "url": "https://example.com/geometry-practice.pdf"
        },
        "assignment": {
          "title": "Geometry Assignment 1",
          "dueDate": "2023-10-25",
          "description": "Solve the problems in the attached worksheet.",
        }
      },
      {
        "id": "4",
        "count": 4,
        "title": "Calculus Introduction",
        "description": "Understanding limits and derivatives",
        "videoUrl": "https://www.youtube.com/watch?v=zuFh9lfb4HY",
        "attachment": {
          "name": "Calculus Exercises.pdf",
          "url": "https://example.com/calculus-exercises.pdf"
        },
        "assignment": {
          "title": "Calculus Assignment 1",
          "dueDate": "2023-10-30",
          "description": "Complete the exercises in the attached document.",
        }
      },
      {
        "id": "5",
        "count": 5,
        "title": "Statistics Basics",
        "description": "Data analysis and interpretation",
        "videoUrl": "https://www.youtube.com/watch?v=zuFh9lfb4HY",
        "attachment": {
          "name": "Statistics Guide.pdf",
          "url": "https://example.com/statistics-guide.pdf"
        },
        "assignment": {
          "title": "Statistics Assignment 1",
          "dueDate": "2023-11-05",
          "description": "Analyze the data in the attached file.",
        }
      },
    ],
  },
  "getAllAssessments": {
    "status": "success",
    "data": [
      {
        "id": "1",
        "title": "Mid-Term Mathematics Exam",
        "description": "Comprehensive exam covering algebra and geometry",
        "start_date": "2023-10-15T09:00:00.000Z",
        "end_date": "2023-10-15T11:00:00.000Z",
        "type": "Exam",
        "total_marks": 100
      },
      {
        "id": "2",
        "title": "Weekly Physics Quiz",
        "description": "Short quiz on Newton's laws of motion",
        "start_date": "2023-10-18T14:30:00.000Z",
        "end_date": "2023-10-18T15:15:00.000Z",
        "type": "Quiz",
        "total_marks": 25
      },
      {
        "id": "3",
        "title": "Computer Science Project Submission",
        "description": "Final project on database design",
        "start_date": "2023-10-20T00:00:00.000Z",
        "end_date": "2023-10-25T23:59:59.000Z",
        "type": "Project",
        "total_marks": 50
      },
      {
        "id": "4",
        "title": "English Literature Essay",
        "description": "Analytical essay on Shakespeare's works",
        "start_date": "2023-11-01T08:00:00.000Z",
        "end_date": "2023-11-07T17:00:00.000Z",
        "type": "Essay",
        "total_marks": 40
      },
      {
        "id": "5",
        "title": "Final Biology Examination",
        "description": "Comprehensive assessment covering all semester topics",
        "start_date": "2023-12-10T10:00:00.000Z",
        "end_date": "2023-12-10T13:00:00.000Z",
        "type": "Exam",
        "total_marks": 120
      },
      {
        "id": "6",
        "title": "Chemistry Lab Report",
        "description": "Detailed report on the acid-base titration experiment",
        "start_date": "2023-11-05T00:00:00.000Z",
        "end_date": "2023-11-12T23:59:59.000Z",
        "type": "Report",
        "total_marks": 30
      },
      {
        "id": "7",
        "title": "Economics Data Analysis Quiz",
        "description": "Online quiz analyzing economic trends",
        "start_date": "2023-10-30T16:00:00.000Z",
        "end_date": "2023-10-30T16:45:00.000Z",
        "type": "Quiz", 
        "total_marks": 25
      },
      {
        "id": "8",
        "title": "Art History Presentation",
        "description": "Group presentation on Renaissance art",
        "start_date": "2023-11-15T09:00:00.000Z",
        "end_date": "2023-11-15T12:00:00.000Z",
        "type": "Presentation",
        "total_marks": 50
      },
      {
        "id": "9",
        "title": "Psychology Research Paper",
        "description": "Research paper on cognitive behavioral therapy",
        "start_date": "2023-11-20T08:00:00.000Z",
        "end_date": "2023-11-27T17:00:00.000Z",
        "type": "Research Paper",
        "total_marks": 60
      },
      {
        "id": "10",
        "title": "Physics Lab Practical",
        "description": "Hands-on practical assessment in the lab",
        "start_date": "2023-11-25T10:00:00.000Z",
        "end_date": "2023-11-25T12:00:00.000Z",
        "type": "Practical",
        "total_marks": 40
      },
    ]
  }
};