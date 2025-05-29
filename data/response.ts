
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
                    "id": "1",
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
                    "id": "2",
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
                    "id": "3",
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
                    "id": "4",
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
                    "id": "5",
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
                "total_marks": 100,
                "class_id": "1",
                "duration": 10,
            },
            {
                "id": "2",
                "title": "Weekly Physics Quiz",
                "description": "Short quiz on Newton's laws of motion",
                "start_date": "2023-10-18T14:30:00.000Z",
                "end_date": "2023-10-18T15:15:00.000Z",
                "type": "Quiz",
                "total_marks": 25,
                "class_id": "2",
                "duration": 2700,
            },
            {
                "id": "3",
                "title": "Computer Science Project Submission",
                "description": "Final project on database design",
                "start_date": "2023-10-20T00:00:00.000Z",
                "end_date": "2023-10-25T23:59:59.000Z",
                "type": "Project",
                "total_marks": 50,
                "class_id": "3",
                "duration": 43200,
            },
            {
                "id": "4",
                "title": "English Literature Essay",
                "description": "Analytical essay on Shakespeare's works",
                "start_date": "2023-11-01T08:00:00.000Z",
                "end_date": "2023-11-07T17:00:00.000Z",
                "type": "Essay",
                "total_marks": 40,
                "class_id": "4",
                "duration": 60480
            },
            {
                "id": "5",
                "title": "Final Biology Examination",
                "description": "Comprehensive assessment covering all semester topics",
                "start_date": "2023-12-10T10:00:00.000Z",
                "end_date": "2023-12-10T13:00:00.000Z",
                "type": "Exam",
                "total_marks": 120,
                "class_id": "6",
                "duration": 10800,
            },
            {
                "id": "6",
                "title": "Chemistry Lab Report",
                "description": "Detailed report on the acid-base titration experiment",
                "start_date": "2023-11-05T00:00:00.000Z",
                "end_date": "2023-11-12T23:59:59.000Z",
                "type": "Report",
                "total_marks": 30,
                "class_id": "7",
                "duration": 60480,
            },
            {
                "id": "7",
                "title": "Economics Data Analysis Quiz",
                "description": "Online quiz analyzing economic trends",
                "start_date": "2023-10-30T16:00:00.000Z",
                "end_date": "2023-10-30T16:45:00.000Z",
                "type": "Quiz",
                "total_marks": 25,
                "class_id": "9",
                "duration": 2700,
            },
            {
                "id": "8",
                "title": "Art History Presentation",
                "description": "Group presentation on Renaissance art",
                "start_date": "2023-11-15T09:00:00.000Z",
                "end_date": "2023-11-15T12:00:00.000Z",
                "type": "Presentation",
                "total_marks": 50,
                "class_id": "5",
                "duration": 10800,
            },
            {
                "id": "9",
                "title": "Psychology Research Paper",
                "description": "Research paper on cognitive behavioral therapy",
                "start_date": "2023-11-20T08:00:00.000Z",
                "end_date": "2023-11-27T17:00:00.000Z",
                "type": "Research Paper",
                "total_marks": 60,
                "class_id": "8",
                "duration": 604800,
            },
            {
                "id": "10",
                "title": "Physics Lab Practical",
                "description": "Hands-on practical assessment in the lab",
                "start_date": "2023-11-25T10:00:00.000Z",
                "end_date": "2023-11-25T12:00:00.000Z",
                "type": "Practical",
                "total_marks": 40,
                "class_id": "2",
                "duration": 7200,
            },
        ]
    },
    "getAllSubmissions": {
        "status": "success",
        "data": [
            {
                "id": "1",
                "assessment_id": "1",
                "user_profile_url": "https://randomuser.me/api/portraits/men/32.jpg",
                "user_name": "John Smith",
                "user_id": "user_001",
                "time_remaining": 0,
                "status": "completed",
                "score": 85,
                "total_score": 100
            },
            {
                "id": "2",
                "assessment_id": "1",
                "user_profile_url": "https://randomuser.me/api/portraits/women/44.jpg",
                "user_name": "Sarah Johnson",
                "user_id": "user_002",
                "time_remaining": 0,
                "status": "completed",
                "score": 92,
                "total_score": 100
            },
            {
                "id": "3",
                "assessment_id": "1",
                "user_profile_url": "https://randomuser.me/api/portraits/men/22.jpg",
                "user_name": "Michael Brown",
                "user_id": "user_003",
                "time_remaining": 1800,
                "status": "in_progress",
                "score": 0,
                "total_score": 100
            },
            {
                "id": "4",
                "assessment_id": "2",
                "user_profile_url": "https://randomuser.me/api/portraits/women/28.jpg",
                "user_name": "Emily Davis",
                "user_id": "user_004",
                "time_remaining": 0,
                "status": "completed",
                "score": 22,
                "total_score": 25
            },
            {
                "id": "5",
                "assessment_id": "2",
                "user_profile_url": "https://randomuser.me/api/portraits/men/42.jpg",
                "user_name": "Robert Wilson",
                "user_id": "user_005",
                "time_remaining": 0,
                "status": "completed",
                "score": 18,
                "total_score": 25
            },
            {
                "id": "6",
                "assessment_id": "3",
                "user_profile_url": "https://randomuser.me/api/portraits/women/15.jpg",
                "user_name": "Jennifer Martinez",
                "user_id": "user_006",
                "time_remaining": 86400,
                "status": "in_progress",
                "score": 0,
                "total_score": 50
            },
            {
                "id": "7",
                "assessment_id": "4",
                "user_profile_url": "https://randomuser.me/api/portraits/men/67.jpg",
                "user_name": "David Thompson",
                "user_id": "user_007",
                "time_remaining": 0,
                "status": "completed",
                "score": 36,
                "total_score": 40
            },
            {
                "id": "8",
                "assessment_id": "5",
                "user_profile_url": "https://randomuser.me/api/portraits/women/33.jpg",
                "user_name": "Lisa Anderson",
                "user_id": "user_008",
                "time_remaining": 0,
                "status": "not_started",
                "score": 0,
                "total_score": 120
            },
            {
                "id": "9",
                "assessment_id": "7",
                "user_profile_url": "https://randomuser.me/api/portraits/men/52.jpg",
                "user_name": "James Taylor",
                "user_id": "user_009",
                "time_remaining": 0,
                "status": "completed",
                "score": 20,
                "total_score": 25
            },
            {
                "id": "10",
                "assessment_id": "10",
                "user_profile_url": "https://randomuser.me/api/portraits/women/26.jpg",
                "user_name": "Patricia Rodriguez",
                "user_id": "user_010",
                "time_remaining": 3600,
                "status": "in_progress",
                "score": 0,
                "total_score": 40
            }
        ]
    },
    "getAssessmentById": {
        "status": "success",
        "message": "success",
        "data": [
            {
                "id": "36d0e4c3-9154-42a9-ab82-722d0903d0d3",
                "question_text": "What is the formula for calculating velocity?",
                "evaluation_id": "4d5e6998-7949-43dd-acb9-c42750bf13fd",
                "created_at": "2025-05-04T22:54:17.877755+07:00",
                "updated_at": "2025-05-04T22:54:17.877755+07:00",
                "deleted_at": null,
                "choice": [
                    {
                        "id": "7a397595-2a02-405c-91b3-ea0939774ec3",
                        "choice_text": "v = d/t",
                        "question_id": "36d0e4c3-9154-42a9-ab82-722d0903d0d3",
                        "is_correct": true,
                        "created_at": "2025-05-04T22:54:17.88267+07:00",
                        "updated_at": "2025-05-04T22:54:17.88267+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "45e1ddb2-35d7-4344-8fed-e4d7f5f75c85",
                        "choice_text": "v = t/d",
                        "question_id": "36d0e4c3-9154-42a9-ab82-722d0903d0d3",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:54:17.885994+07:00",
                        "updated_at": "2025-05-04T22:54:17.885994+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "b5f810cc-8797-47ae-9595-a3c2e3555c0a",
                        "choice_text": "v = d × t",
                        "question_id": "36d0e4c3-9154-42a9-ab82-722d0903d0d3",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:54:17.886994+07:00",
                        "updated_at": "2025-05-04T22:54:17.886994+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "e2a77d4a-cc3d-486a-9d8c-8a1f2ade7643",
                        "choice_text": "v = d² + t²",
                        "question_id": "36d0e4c3-9154-42a9-ab82-722d0903d0d3",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:54:17.887994+07:00",
                        "updated_at": "2025-05-04T22:54:17.887994+07:00",
                        "deleted_at": null
                    }
                ]
            },
            {
                "id": "a6381a1c-bd04-495d-9ca0-c4f32d128467",
                "question_text": "Which of the following is Newton's First Law of Motion?",
                "evaluation_id": "4d5e6998-7949-43dd-acb9-c42750bf13fd",
                "created_at": "2025-05-04T22:54:17.890246+07:00",
                "updated_at": "2025-05-04T22:54:17.890246+07:00",
                "deleted_at": null,
                "choice": [
                    {
                        "id": "5c32eb69-d27f-472c-929d-9cf9ea7a5be5",
                        "choice_text": "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
                        "question_id": "a6381a1c-bd04-495d-9ca0-c4f32d128467",
                        "is_correct": true,
                        "created_at": "2025-05-04T22:54:17.89369+07:00",
                        "updated_at": "2025-05-04T22:54:17.89369+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "edb3ac69-0281-44d7-99bb-a19978c28939",
                        "choice_text": "Force equals mass times acceleration.",
                        "question_id": "a6381a1c-bd04-495d-9ca0-c4f32d128467",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:54:17.896885+07:00",
                        "updated_at": "2025-05-04T22:54:17.896885+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "fc72b5e8-abd0-4fc1-ac3b-5f6df3c7c6a4",
                        "choice_text": "For every action, there is an equal and opposite reaction.",
                        "question_id": "a6381a1c-bd04-495d-9ca0-c4f32d128467",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:54:17.897885+07:00",
                        "updated_at": "2025-05-04T22:54:17.897885+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "a41e8d2c-ef5b-4cc0-9e58-19c733b236b2",
                        "choice_text": "The gravitational force between two objects is proportional to their masses and inversely proportional to the square of the distance between them.",
                        "question_id": "a6381a1c-bd04-495d-9ca0-c4f32d128467",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:54:17.898885+07:00",
                        "updated_at": "2025-05-04T22:54:17.898885+07:00",
                        "deleted_at": null
                    }
                ]
            },
            {
                "id": "c0a06565-02cd-489c-aaa0-6cc99a84abe1",
                "question_text": "What is the main function of a cell membrane?",
                "evaluation_id": "4d5e6998-7949-43dd-acb9-c42750bf13fd",
                "created_at": "2025-05-04T22:58:15.73379+07:00",
                "updated_at": "2025-05-04T22:58:15.73379+07:00",
                "deleted_at": null,
                "choice": [
                    {
                        "id": "33cf47ad-b0ee-4693-bcf5-21f42a39159a",
                        "choice_text": "To control what enters and exits the cell",
                        "question_id": "c0a06565-02cd-489c-aaa0-6cc99a84abe1",
                        "is_correct": true,
                        "created_at": "2025-05-04T22:58:15.738568+07:00",
                        "updated_at": "2025-05-04T22:58:15.738568+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "ca249877-a708-49ca-a197-ec25baff0467",
                        "choice_text": "To produce energy for the cell",
                        "question_id": "c0a06565-02cd-489c-aaa0-6cc99a84abe1",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:58:15.741636+07:00",
                        "updated_at": "2025-05-04T22:58:15.741636+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "5e74a7b1-a37c-4b2f-b9f0-0e7fc3b2c2a5",
                        "choice_text": "To store genetic information",
                        "question_id": "c0a06565-02cd-489c-aaa0-6cc99a84abe1",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:58:15.742636+07:00",
                        "updated_at": "2025-05-04T22:58:15.742636+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "7d82f45e-89a0-4bd9-a6c5-9b2eabd6c328",
                        "choice_text": "To synthesize proteins",
                        "question_id": "c0a06565-02cd-489c-aaa0-6cc99a84abe1",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:58:15.743636+07:00",
                        "updated_at": "2025-05-04T22:58:15.743636+07:00",
                        "deleted_at": null
                    }
                ]
            },
            {
                "id": "58f4fce7-4a8f-4d1e-bf15-26fb72b5cb01",
                "question_text": "Which of the following is not a primary color in painting?",
                "evaluation_id": "4d5e6998-7949-43dd-acb9-c42750bf13fd",
                "created_at": "2025-05-04T22:58:15.744719+07:00",
                "updated_at": "2025-05-04T22:58:15.744719+07:00",
                "deleted_at": null,
                "choice": [
                    {
                        "id": "78329ad0-1c6a-467a-aec2-504936e6677f",
                        "choice_text": "Green",
                        "question_id": "58f4fce7-4a8f-4d1e-bf15-26fb72b5cb01",
                        "is_correct": true,
                        "created_at": "2025-05-04T22:58:15.749361+07:00",
                        "updated_at": "2025-05-04T22:58:15.749361+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "88058675-b04a-4bf4-8149-4a8bede12170",
                        "choice_text": "Red",
                        "question_id": "58f4fce7-4a8f-4d1e-bf15-26fb72b5cb01",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:58:15.752337+07:00",
                        "updated_at": "2025-05-04T22:58:15.752337+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "92c5d819-1234-4bb8-9d37-0d8a4e9c7a3b",
                        "choice_text": "Yellow",
                        "question_id": "58f4fce7-4a8f-4d1e-bf15-26fb72b5cb01",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:58:15.753337+07:00",
                        "updated_at": "2025-05-04T22:58:15.753337+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "d45e6f12-7890-4c23-a56e-1f2d3b4c5e6a",
                        "choice_text": "Blue",
                        "question_id": "58f4fce7-4a8f-4d1e-bf15-26fb72b5cb01",
                        "is_correct": false,
                        "created_at": "2025-05-04T22:58:15.754337+07:00",
                        "updated_at": "2025-05-04T22:58:15.754337+07:00",
                        "deleted_at": null
                    }
                ]
            },
            {
                "id": "71a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
                "question_text": "Who is credited with developing the theory of relativity?",
                "evaluation_id": "4d5e6998-7949-43dd-acb9-c42750bf13fd",
                "created_at": "2025-05-04T23:01:17.123456+07:00",
                "updated_at": "2025-05-04T23:01:17.123456+07:00",
                "deleted_at": null,
                "choice": [
                    {
                        "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
                        "choice_text": "Albert Einstein",
                        "question_id": "71a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
                        "is_correct": true,
                        "created_at": "2025-05-04T23:01:17.223456+07:00",
                        "updated_at": "2025-05-04T23:01:17.223456+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
                        "choice_text": "Isaac Newton",
                        "question_id": "71a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
                        "is_correct": false,
                        "created_at": "2025-05-04T23:01:17.323456+07:00",
                        "updated_at": "2025-05-04T23:01:17.323456+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
                        "choice_text": "Galileo Galilei",
                        "question_id": "71a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
                        "is_correct": false,
                        "created_at": "2025-05-04T23:01:17.423456+07:00",
                        "updated_at": "2025-05-04T23:01:17.423456+07:00",
                        "deleted_at": null
                    },
                    {
                        "id": "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
                        "choice_text": "Stephen Hawking",
                        "question_id": "71a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c",
                        "is_correct": false,
                        "created_at": "2025-05-04T23:01:17.523456+07:00",
                        "updated_at": "2025-05-04T23:01:17.523456+07:00",
                        "deleted_at": null
                    }
                ]
            }
        ]
    },
    "getAllTodo": {
        "status": "success",
        "data": [
            {
                "id": "1",
                "assessment_id": "1",
                "user_profile_url": "https://randomuser.me/api/portraits/men/32.jpg",
                "user_name": "John Smith",
                "user_id": "user_001",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Complete Math Practice Problems",
                "due_date": "2023-10-14T23:59:59.000Z",
                "priority": "high"
            },
            {
                "id": "2",
                "assessment_id": "2",
                "user_profile_url": "https://randomuser.me/api/portraits/women/44.jpg",
                "user_name": "Sarah Johnson",
                "user_id": "user_002",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Review Physics Formulas",
                "due_date": "2023-10-17T23:59:59.000Z",
                "priority": "medium"
            },
            {
                "id": "3",
                "assessment_id": "3",
                "user_profile_url": "https://randomuser.me/api/portraits/men/22.jpg",
                "user_name": "Michael Brown",
                "user_id": "user_003",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Start Database Design Project",
                "due_date": "2023-10-22T23:59:59.000Z",
                "priority": "high"
            },
            {
                "id": "4",
                "assessment_id": "4",
                "user_profile_url": "https://randomuser.me/api/portraits/women/28.jpg",
                "user_name": "Emily Davis",
                "user_id": "user_004",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Research Shakespeare Background",
                "due_date": "2023-11-03T23:59:59.000Z",
                "priority": "low"
            },
            {
                "id": "5",
                "assessment_id": "5",
                "user_profile_url": "https://randomuser.me/api/portraits/men/42.jpg",
                "user_name": "Robert Wilson",
                "user_id": "user_005",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Study Biology Cell Structure",
                "due_date": "2023-12-08T23:59:59.000Z",
                "priority": "high"
            },
            {
                "id": "6",
                "assessment_id": "6",
                "user_profile_url": "https://randomuser.me/api/portraits/women/15.jpg",
                "user_name": "Jennifer Martinez",
                "user_id": "user_006",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Prepare Chemistry Lab Notes",
                "due_date": "2023-11-04T23:59:59.000Z",
                "priority": "medium"
            },
            {
                "id": "7",
                "assessment_id": "7",
                "user_profile_url": "https://randomuser.me/api/portraits/men/67.jpg",
                "user_name": "David Thompson",
                "user_id": "user_007",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Gather Economic Data Sources",
                "due_date": "2023-10-29T23:59:59.000Z",
                "priority": "medium"
            },
            {
                "id": "8",
                "assessment_id": "8",
                "user_profile_url": "https://randomuser.me/api/portraits/women/33.jpg",
                "user_name": "Lisa Anderson",
                "user_id": "user_008",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Create Art History Presentation Slides",
                "due_date": "2023-11-14T23:59:59.000Z",
                "priority": "high"
            },
            {
                "id": "9",
                "assessment_id": "9",
                "user_profile_url": "https://randomuser.me/api/portraits/men/52.jpg",
                "user_name": "James Taylor",
                "user_id": "user_009",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Outline Psychology Research Paper",
                "due_date": "2023-11-19T23:59:59.000Z",
                "priority": "low"
            },
            {
                "id": "10",
                "assessment_id": "10",
                "user_profile_url": "https://randomuser.me/api/portraits/women/26.jpg",
                "user_name": "Patricia Rodriguez",
                "user_id": "user_010",
                "time_remaining": null,
                "status": "not_started",
                "score": null,
                "total_score": null,
                "title": "Review Lab Safety Procedures",
                "due_date": "2023-11-24T23:59:59.000Z",
                "priority": "high"
            }
        ]
    },
    "getAllStudentsByClassId": {
        "status": "success",
        "data": [
            {
                "user_profile_url": "https://randomuser.me/api/portraits/men/32.jpg",
                "user_name": "John Smith",
                "user_id": "student_001"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/women/44.jpg",
                "user_name": "Sarah Johnson",
                "user_id": "student_002"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/men/22.jpg",
                "user_name": "Michael Brown",
                "user_id": "student_003"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/women/28.jpg",
                "user_name": "Emily Davis",
                "user_id": "student_004"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/men/42.jpg",
                "user_name": "Robert Wilson",
                "user_id": "student_005"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/women/15.jpg",
                "user_name": "Jennifer Martinez",
                "user_id": "student_006"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/men/67.jpg",
                "user_name": "David Thompson",
                "user_id": "student_007"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/women/33.jpg",
                "user_name": "Lisa Anderson",
                "user_id": "student_008"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/men/52.jpg",
                "user_name": "James Taylor",
                "user_id": "student_009"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/women/26.jpg",
                "user_name": "Patricia Rodriguez",
                "user_id": "student_010"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/men/85.jpg",
                "user_name": "Thomas Martinez",
                "user_id": "student_011"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/women/63.jpg",
                "user_name": "Jessica Wilson",
                "user_id": "student_012"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/men/36.jpg",
                "user_name": "Christopher Lee",
                "user_id": "student_013"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/women/57.jpg",
                "user_name": "Amanda Clark",
                "user_id": "student_014"
            },
            {
                "user_profile_url": "https://randomuser.me/api/portraits/men/77.jpg",
                "user_name": "Daniel Wright",
                "user_id": "student_015"
            }
        ]
    },
    "getUpcomingAssessmentsByClass": {
        "status": "success",
        "data": [
            {
                "class_id": "1",
                "class_title": "Mathematics 101",
                "class_code": "Class A",
                "assessments": [
                    {
                        "id": "11",
                        "title": "Trigonometry Quiz",
                        "description": "Quiz on sine, cosine, and tangent functions",
                        "start_date": "2025-05-28T10:00:00.000Z",
                        "end_date": "2025-05-28T11:00:00.000Z",
                        "type": "Quiz",
                        "total_marks": 30,
                        "duration": 3675,
                        "days_remaining": 2
                    },
                    {
                        "id": "12",
                        "title": "Final Mathematics Exam",
                        "description": "Comprehensive final exam covering all topics",
                        "start_date": "2025-06-05T09:00:00.000Z",
                        "end_date": "2025-06-05T12:00:00.000Z",
                        "type": "Exam",
                        "total_marks": 150,
                        "duration": 10800,
                        "days_remaining": 10
                    }
                ]
            },
            {
                "class_id": "2",
                "class_title": "Introduction to Physics",
                "class_code": "Class B",
                "assessments": [
                    {
                        "id": "13",
                        "title": "Thermodynamics Assignment",
                        "description": "Problem set on heat transfer and energy",
                        "start_date": "2025-05-30T00:00:00.000Z",
                        "end_date": "2025-06-02T23:59:59.000Z",
                        "type": "Assignment",
                        "total_marks": 40,
                        "duration": 259200,
                        "days_remaining": 4
                    }
                ]
            },
            {
                "class_id": "3",
                "class_title": "Computer Science Basics",
                "class_code": "Class C",
                "assessments": [
                    {
                        "id": "14",
                        "title": "Algorithm Analysis Project",
                        "description": "Implement and analyze sorting algorithms",
                        "start_date": "2025-05-27T00:00:00.000Z",
                        "end_date": "2025-06-10T23:59:59.000Z",
                        "type": "Project",
                        "total_marks": 80,
                        "duration": 1209600,
                        "days_remaining": 1
                    },
                    {
                        "id": "15",
                        "title": "Data Structures Quiz",
                        "description": "Quick assessment on arrays, lists, and trees",
                        "start_date": "2025-06-01T14:00:00.000Z",
                        "end_date": "2025-06-01T15:30:00.000Z",
                        "type": "Quiz",
                        "total_marks": 25,
                        "duration": 5400,
                        "days_remaining": 6
                    }
                ]
            },
            {
                "class_id": "4",
                "class_title": "English Literature",
                "class_code": "Class D",
                "assessments": [
                    {
                        "id": "16",
                        "title": "Poetry Analysis Essay",
                        "description": "Analyze themes in modern poetry",
                        "start_date": "2025-06-03T08:00:00.000Z",
                        "end_date": "2025-06-10T17:00:00.000Z",
                        "type": "Essay",
                        "total_marks": 50,
                        "duration": 604800,
                        "days_remaining": 8
                    }
                ]
            },
            {
                "class_id": "6",
                "class_title": "Biology 101",
                "class_code": "Class F",
                "assessments": [
                    {
                        "id": "17",
                        "title": "Genetics Lab Report",
                        "description": "Report on DNA extraction experiment",
                        "start_date": "2025-05-29T00:00:00.000Z",
                        "end_date": "2025-06-05T23:59:59.000Z",
                        "type": "Report",
                        "total_marks": 35,
                        "duration": 604800,
                        "days_remaining": 3
                    },
                    {
                        "id": "18",
                        "title": "Ecology Quiz",
                        "description": "Assessment on ecosystem interactions",
                        "start_date": "2025-06-07T11:00:00.000Z",
                        "end_date": "2025-06-07T12:00:00.000Z",
                        "type": "Quiz",
                        "total_marks": 20,
                        "duration": 3600,
                        "days_remaining": 12
                    }
                ]
            }
        ]
    },
        "getAllAssignments": {
        "status": "success",
        "data": [
            {
                "id": "1",
                "title": "Math Assignment 1",
                "description": "Solve the problems in the attached worksheet covering basic mathematical concepts",
                "due_date": "2023-10-15T23:59:59.000Z",
                "attachment": {
                    "file_name": "Math Worksheet 1.pdf",
                    "file_url": "https://example.com/math-assignment-1.pdf"
                }
            },
            {
                "id": "2",
                "title": "Algebra Assignment 1",
                "description": "Complete the exercises in the attached document focusing on linear equations",
                "due_date": "2023-10-20T23:59:59.000Z",
                "attachment": {
                    "file_name": "Algebra Problems.pdf",
                    "file_url": "https://example.com/algebra-assignment-1.pdf"
                }
            },
            {
                "id": "3",
                "title": "Physics Lab Report",
                "description": "Write a detailed lab report on the pendulum experiment conducted in class",
                "due_date": "2023-10-25T23:59:59.000Z",
                "attachment": {
                    "file_name": "Lab Report Template.docx",
                    "file_url": "https://example.com/lab-report-template.docx"
                }
            },
            {
                "id": "4",
                "title": "Programming Project 1",
                "description": "Create a simple calculator application using Python",
                "due_date": "2023-11-01T23:59:59.000Z",
                "attachment": {
                    "file_name": "Project Requirements.pdf",
                    "file_url": "https://example.com/programming-project-1.pdf"
                }
            },
            {
                "id": "5",
                "title": "Shakespeare Essay",
                "description": "Write a 1500-word essay analyzing themes in Hamlet",
                "due_date": "2023-11-10T23:59:59.000Z",
                "attachment": {
                    "file_name": "Essay Guidelines.pdf",
                    "file_url": "https://example.com/essay-guidelines.pdf"
                }
            },
            {
                "id": "6",
                "title": "Cell Biology Assignment",
                "description": "Complete the worksheet on cell structure and organelles",
                "due_date": "2023-10-30T23:59:59.000Z",
                "attachment": {
                    "file_name": "Cell Biology Worksheet.pdf",
                    "file_url": "https://example.com/cell-biology-worksheet.pdf"
                }
            },
            {
                "id": "7",
                "title": "Chemical Reactions Lab",
                "description": "Document observations from the acid-base reaction experiment",
                "due_date": "2023-11-05T23:59:59.000Z",
                "attachment": {
                    "file_name": "Lab Procedure",
                    "file_url": "https://example.com/chemistry-lab-procedure.pdf"
                }
            },
            {
                "id": "8",
                "title": "Art History Research",
                "description": "Research and present on a Renaissance artist of your choice",
                "due_date": "2023-11-15T23:59:59.000Z",
                "attachment": {
                    "file_name": "Research Guidelines.pdf",
                    "file_url": "https://example.com/art-research-guidelines.pdf"
                }
            }
        ]
    },
        "getAllAssignmentSubmissions": {
        "status": "success",
        "data": [
            {
                "id": "sub_001",
                "assignment_id": "1",
                "user_id": "student_001",
                "user_profile_url": "https://randomuser.me/api/portraits/men/32.jpg",
                "user_name": "John Smith",
                "status": "submitted",
                "score": 95,
                "submitted_at": "2023-10-14T18:30:00.000Z",
                "file_name": "John_Smith_Math_Assignment_1.pdf",
                "file_url": "https://example.com/submissions/john_smith_math_1.pdf"
            },
            {
                "id": "sub_002",
                "assignment_id": "1",
                "user_id": "student_002",
                "user_profile_url": "https://randomuser.me/api/portraits/women/44.jpg",
                "user_name": "Sarah Johnson",
                "status": "submitted",
                "score": 88,
                "submitted_at": "2023-10-15T20:15:00.000Z",
                "file_name": "Sarah_Johnson_Math_Assignment_1.pdf",
                "file_url": "https://example.com/submissions/sarah_johnson_math_1.pdf"
            },
            {
                "id": "sub_003",
                "assignment_id": "1",
                "user_id": "student_003",
                "user_profile_url": "https://randomuser.me/api/portraits/men/22.jpg",
                "user_name": "Michael Brown",
                "status": "todo",
                "score": 0,
                "submitted_at": null,
                "file_name": null,
                "file_url": null
            },
            {
                "id": "sub_004",
                "assignment_id": "1",
                "user_id": "student_004",
                "user_profile_url": "https://randomuser.me/api/portraits/women/28.jpg",
                "user_name": "Emily Davis",
                "status": "submitted",
                "score": 92,
                "submitted_at": "2023-10-15T16:45:00.000Z",
                "file_name": "Emily_Davis_Math_Assignment_1.pdf",
                "file_url": "https://example.com/submissions/emily_davis_math_1.pdf"
            },
            {
                "id": "sub_005",
                "assignment_id": "1",
                "user_id": "student_005",
                "user_profile_url": "https://randomuser.me/api/portraits/men/42.jpg",
                "user_name": "Robert Wilson",
                "status": "todo",
                "score": 0,
                "submitted_at": null,
                "file_name": null,
                "file_url": null
            },
            {
                "id": "sub_006",
                "assignment_id": "2",
                "user_id": "student_001",
                "user_profile_url": "https://randomuser.me/api/portraits/men/32.jpg",
                "user_name": "John Smith",
                "status": "submitted",
                "score": 85,
                "submitted_at": "2023-10-19T14:20:00.000Z",
                "file_name": "John_Smith_Algebra_Assignment_1.pdf",
                "file_url": "https://example.com/submissions/john_smith_algebra_1.pdf"
            },
            {
                "id": "sub_007",
                "assignment_id": "2",
                "user_id": "student_002",
                "user_profile_url": "https://randomuser.me/api/portraits/women/44.jpg",
                "user_name": "Sarah Johnson",
                "status": "todo",
                "score": 0,
                "submitted_at": null,
                "file_name": null,
                "file_url": null
            },
            {
                "id": "sub_008",
                "assignment_id": "3",
                "user_id": "student_006",
                "user_profile_url": "https://randomuser.me/api/portraits/women/15.jpg",
                "user_name": "Jennifer Martinez",
                "status": "submitted",
                "score": 78,
                "submitted_at": "2023-10-24T22:10:00.000Z",
                "file_name": "Jennifer_Martinez_Physics_Lab_Report.docx",
                "file_url": "https://example.com/submissions/jennifer_martinez_physics_lab.docx"
            },
            {
                "id": "sub_009",
                "assignment_id": "3",
                "user_id": "student_007",
                "user_profile_url": "https://randomuser.me/api/portraits/men/67.jpg",
                "user_name": "David Thompson",
                "status": "submitted",
                "score": 90,
                "submitted_at": "2023-10-25T19:30:00.000Z",
                "file_name": "David_Thompson_Physics_Lab_Report.docx",
                "file_url": "https://example.com/submissions/david_thompson_physics_lab.docx"
            },
            {
                "id": "sub_010",
                "assignment_id": "4",
                "user_id": "student_008",
                "user_profile_url": "https://randomuser.me/api/portraits/women/33.jpg",
                "user_name": "Lisa Anderson",
                "status": "todo",
                "score": 0,
                "submitted_at": null,
                "file_name": null,
                "file_url": null
            },
            {
                "id": "sub_011",
                "assignment_id": "4",
                "user_id": "student_009",
                "user_profile_url": "https://randomuser.me/api/portraits/men/52.jpg",
                "user_name": "James Taylor",
                "status": "submitted",
                "score": 96,
                "submitted_at": "2023-10-30T21:45:00.000Z",
                "file_name": "James_Taylor_Calculator_Project.zip",
                "file_url": "https://example.com/submissions/james_taylor_calculator.zip"
            },
            {
                "id": "sub_012",
                "assignment_id": "5",
                "user_id": "student_010",
                "user_profile_url": "https://randomuser.me/api/portraits/women/26.jpg",
                "user_name": "Patricia Rodriguez",
                "status": "submitted",
                "score": 87,
                "submitted_at": "2023-11-09T15:20:00.000Z",
                "file_name": "Patricia_Rodriguez_Shakespeare_Essay.docx",
                "file_url": "https://example.com/submissions/patricia_rodriguez_shakespeare.docx"
            },
            {
                "id": "sub_013",
                "assignment_id": "5",
                "user_id": "student_011",
                "user_profile_url": "https://randomuser.me/api/portraits/men/85.jpg",
                "user_name": "Thomas Martinez",
                "status": "todo",
                "score": 0,
                "submitted_at": null,
                "file_name": null,
                "file_url": null
            },
            {
                "id": "sub_014",
                "assignment_id": "6",
                "user_id": "student_012",
                "user_profile_url": "https://randomuser.me/api/portraits/women/63.jpg",
                "user_name": "Jessica Wilson",
                "status": "submitted",
                "score": 91,
                "submitted_at": "2023-10-29T17:40:00.000Z",
                "file_name": "Jessica_Wilson_Cell_Biology_Assignment.pdf",
                "file_url": "https://example.com/submissions/jessica_wilson_cell_biology.pdf"
            },
            {
                "id": "sub_015",
                "assignment_id": "7",
                "user_id": "student_013",
                "user_profile_url": "https://randomuser.me/api/portraits/men/36.jpg",
                "user_name": "Christopher Lee",
                "status": "submitted",
                "score": 83,
                "submitted_at": "2023-11-04T20:55:00.000Z",
                "file_name": "Christopher_Lee_Chemistry_Lab_Report.pdf",
                "file_url": "https://example.com/submissions/christopher_lee_chemistry_lab.pdf"
            },
            {
                "id": "sub_016",
                "assignment_id": "8",
                "user_id": "student_014",
                "user_profile_url": "https://randomuser.me/api/portraits/women/57.jpg",
                "user_name": "Amanda Clark",
                "status": "todo",
                "score": 0,
                "submitted_at": null,
                "file_name": null,
                "file_url": null
            },
            {
                "id": "sub_017",
                "assignment_id": "8",
                "user_id": "student_015",
                "user_profile_url": "https://randomuser.me/api/portraits/men/77.jpg",
                "user_name": "Daniel Wright",
                "status": "submitted",
                "score": 89,
                "submitted_at": "2023-11-14T23:15:00.000Z",
                "file_name": "Daniel_Wright_Art_History_Research.pdf",
                "file_url": "https://example.com/submissions/daniel_wright_art_history.pdf"
            }
        ]
    },
};