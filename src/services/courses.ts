import { DataSource } from '@angular/cdk/collections';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Course } from '../util/courseModel'
import { SemesterEnum } from '../util/semesterEnum'

export class CourseDataSource extends DataSource<any> {
  courseResults: Subject<Course[]>;

  constructor() {
    super();
    this.courseResults = new Subject;
  }

  connect(): Observable<Course[]> {
    return this.courseResults.asObservable();
  }

  search(department: string, courseName: string, isWritingIntensive: boolean, courseDesignation: string): void {
  	this.courseResults.next([{
  		departmentId: 100,
  		courseId: 200,
  		writingIntensive: true,
  		designation: 'H',
  		name: 'courseName',
  		quality: 5.00,
  		medianGrade: 90,
  		distributionArray: [100, 80, 90],
  		instructorName: 'instructorName',
  		semester: SemesterEnum['F17']
  	}]);
  }

  disconnect() {}
}