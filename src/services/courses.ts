import { DataSource } from '@angular/cdk/collections';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Course } from '../util/courseModel';
import { SemesterEnum } from '../util/semesterEnum';

export class CourseDataSource extends DataSource<any> {
  courseResults: FirebaseListObservable<Course[]>;

  nameSubject: Subject<string>;
  semesterSubject: Subject<SemesterEnum>;

  hasData: boolean;

  constructor(db: AngularFireDatabase) {
    super();

    this.nameSubject = new Subject();
    this.semesterSubject = new Subject();
    
    this.courseResults = db.list('/evals/' + this.semesterSubject, {
      query: {
        orderByChild: 'Name',
        equalTo: this.nameSubject
      }
    });

    this.courseResults.subscribe(list => list.map(item => console.log(item)));

    this.hasData = true;
  }

  connect(): Observable<Course[]> {
    return this.courseResults;
  }

  search(department: string, courseName: string, isWritingIntensive: boolean, courseDesignation: string, semester: SemesterEnum): void {
    console.log("getting data for semester " + SemesterEnum[semester]);

    this.semesterSubject.next(semester);
    this.nameSubject.next(courseName);
  }

  disconnect() {}
}