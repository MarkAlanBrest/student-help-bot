// lib/canvasResources.ts

export type CanvasResource = {
  keywords: string[];
  guide: string;
  description: string;
  label: string;
};

export const CanvasResources: CanvasResource[] = [
  {
    label: "Assignments",
    keywords: [
      "submit","submission","turn in","upload","hand in",
      "send assignment","homework","attach","file upload",
      "submit file","submit work","turn it in"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Assignments",
    description: "How to submit assignments, upload files, and view submission details."
  },
  {
    label: "Grades",
    keywords: [
      "grade","grades","score","feedback","points","results",
      "mark","rubric","grading","teacher comments","why is my grade"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Grades",
    description: "How to view grades, rubric feedback, and instructor comments."
  },
  {
    label: "Discussions",
    keywords: [
      "discussion","reply","post","comment","forum","thread",
      "respond","discussion board","participate","discussion post"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Discussions",
    description: "How to reply to discussions, post comments, and participate in forums."
  },
  {
    label: "Modules",
    keywords: [
      "module","lesson","course content","units","topics",
      "where is my work","content","materials","learning module"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Modules",
    description: "How to navigate modules and find course materials."
  },
  {
    label: "Quizzes",
    keywords: [
      "quiz","test","exam","assessment","take quiz","start quiz",
      "timed quiz","quiz attempt","quiz results","quiz score"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Quizzes",
    description: "How to take quizzes, view results, and understand quiz settings."
  },
  {
    label: "Calendar",
    keywords: [
      "calendar","due dates","schedule","planner","events",
      "what's due","when is it due","calendar view","to do list"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Calendar",
    description: "How to use the Canvas calendar to track due dates and events."
  },
  {
    label: "Inbox",
    keywords: [
      "inbox","message","email","contact teacher","send message",
      "communication","canvas inbox","conversation","dm teacher"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Inbox",
    description: "How to send messages to instructors and classmates using the Canvas Inbox."
  },
  {
    label: "Files",
    keywords: [
      "files","documents","download","upload file","course files",
      "where are my files","file storage","view files"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Files",
    description: "How to access, download, and manage files in Canvas."
  },
  {
    label: "Mobile",
    keywords: [
      "app","mobile","phone","ios","android","canvas app",
      "student app","mobile login","qr code login"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Mobile",
    description: "How to use the Canvas Student mobile app on iOS and Android."
  },
  {
    label: "Announcements",
    keywords: [
      "announcement","announcements","teacher announcement",
      "class announcement","updates","notifications"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Announcements",
    description: "How to view course announcements and instructor updates."
  },
  {
    label: "Groups",
    keywords: [
      "group","groups","group work","collaboration","team",
      "peer group","group assignment","group page"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Groups",
    description: "How to join groups, collaborate, and access group pages."
  },
  {
    label: "Peer Review",
    keywords: [
      "peer review","peer feedback","review classmate",
      "peer assignment","peer grading"
    ],
    guide: "https://community.canvaslms.com/t5/Student-Guide/tkb-p/student?labels=Peer+Review",
    description: "How to complete peer reviews and give feedback to classmates."
  }
];

export function getCanvasGuide(question: string) {
  const q = question.toLowerCase();

  for (const item of CanvasResources) {
    if (item.keywords.some((k) => q.includes(k))) {
      return item;
    }
  }

  return null;
}
