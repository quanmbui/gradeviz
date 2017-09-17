export interface Course {
  departmentId: number;
  courseId: number;
  writingIntensive: boolean;
  designation: string;
  name: string;
  quality: number;
  medianGrade: number;
  distributionArray: number[];
  instructorName: string;
  semester: string;
}