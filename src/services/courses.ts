import { DataSource } from '@angular/cdk/collections';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Course } from '../util/courseModel';
import { SemesterEnum } from '../util/semesterEnum';

export class CourseDataSource extends DataSource<any> {
  courseResults: FirebaseListObservable<Course[]>;

  departmentSubject: Subject<string>;
  nameSubject: Subject<string>;
  semesterSubject: Subject<SemesterEnum>;

  orderByChild: string;

  constructor(db: AngularFireDatabase) {
    super();

    this.orderByChild = 'department'

    this.courseResults = db.list('/evals/' + (this.semesterSubject ? this.semesterSubject : ''), {
      query: {
        orderByChild: 'Department',
        equalTo: this.nameSubject
      }
    });

    this.departmentSubject = new Subject();
    this.nameSubject = new Subject();
    this.semesterSubject = new Subject();

    this.courseResults.subscribe(list => list.map(item => console.log(item)));
  }

  public connect(): Observable<Course[]> {
    return this.courseResults;
  }

  public search(department?: string, courseName?: string, semester?: SemesterEnum): void {
    console.log("getting data for semester " + SemesterEnum[semester]);
    semester = semester ? semester : SemesterEnum[SemesterEnum[12]]

    if(department) {
      this.searchByDepartment(department, semester)
    } else if (courseName) {
      this.searchByName(courseName, semester)
    } else {
      console.log("ERROR SEARCHING")
    }
  }

  public disconnect() {}

  private searchByName(courseName: string, semester: SemesterEnum): void {
    this.semesterSubject.next(semester);
    this.nameSubject.next(courseName);
  }

  private searchByDepartment(deparment: string, semester: SemesterEnum): void {
    this.semesterSubject.next(semester);
    this.departmentSubject.next(deparment);
  }
}