import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question } = await req.json();
  const q = question.toLowerCase();

  let answer = "I'm here to help! Can you tell me more about what you're trying to do?";

  // --- BASIC BUILT‑IN HELP RESPONSES ---
  if (q.includes("submit") && q.includes("assignment")) {
    answer = `
Here’s how to submit an assignment in Canvas:

1. Go to **Courses** and open your class  
2. Click **Assignments** in the left menu  
3. Select the assignment you want to submit  
4. Click the **Start Assignment** button  
5. Choose your submission type:
   - **File Upload** (upload a document)
   - **Text Entry** (type your answer)
   - **Media Recording** (record audio/video)
   - **Google Drive / OneDrive** (attach a cloud file)
6. Click **Submit Assignment**  
7. Look for the green **Submitted!** checkmark

Let me know if you want screenshots or help finding the assignment.
`;
  }

  else if (q.includes("grades") || q.includes("gradebook")) {
    answer = `
To view your grades in Canvas:

1. Open your course  
2. Click **Grades** in the left menu  
3. You’ll see:
   - Your score on each assignment  
   - Teacher comments  
   - Due dates  
   - Missing or late work  
4. Click any assignment to see details or resubmit (if allowed)

If you want, I can help you interpret the grade symbols too.
`;
  }

  else if (q.includes("message") || q.includes("inbox")) {
    answer = `
To message your teacher in Canvas:

1. Click the **Inbox** icon on the left  
2. Click **Compose Message**  
3. Choose your course  
4. Select your teacher  
5. Type your message  
6. Click **Send**

Teachers receive it instantly inside Canvas.
`;
  }

  else if (q.includes("quiz")) {
    answer = `
To take a quiz in Canvas:

1. Open your course  
2. Click **Quizzes**  
3. Select the quiz  
4. Click **Take the Quiz**  
5. Answer each question  
6. Click **Submit Quiz** when finished  

Some quizzes allow multiple attempts — I can help you check that too.
`;
  }

  else if (q.includes("module")) {
    answer = `
Modules are your weekly or unit learning sections.

To view them:

1. Open your course  
2. Click **Modules**  
3. Work through items in order:
   - Pages  
   - Assignments  
   - Quizzes  
   - Discussions  
   - Files  
4. Completed items show a checkmark

I can help you find a specific module if you want.
`;
  }

  return NextResponse.json({ answer });
}
