import { DataSource } from '@angular/cdk/collections';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Course } from '../util/courseModel';
import { SemesterEnum } from '../util/semesterEnum';
import { Department } from '../util/departments'

export class CourseDataSource extends DataSource<any> {
  courseResults: FirebaseListObservable<Course[]>;

  departmentSubject: Subject<string>;
  nameSubject: Subject<string>;
  semesterSubject: Subject<SemesterEnum>;

  orderByChild: string;

  constructor(db: AngularFireDatabase) {
    super();

    this.orderByChild = 'department'

    this.courseResults = db.list('/evals/-KuCNE-hpCTy1rIjQ0lE/' + (this.semesterSubject ? this.semesterSubject : 'F14') + '/', {
      query: {
        orderByChild: 'DeptID',
        equalTo: this.departmentSubject
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

  public search(department?: Department, courseName?: string, semester?: SemesterEnum): void {
    semester = semester ? semester : SemesterEnum[SemesterEnum[12]]
    console.log("getting data for semester " + SemesterEnum[semester]);

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
    console.log("searching by course name with name = " + courseName);
    this.semesterSubject.next(semester);
    this.nameSubject.next(courseName);
  }

  private searchByDepartment(deparment: Department, semester: SemesterEnum): void {
    console.log("searching by department with department = " + deparment);
    this.semesterSubject.next(semester);
    this.departmentSubject.next(deparment.number);
  }
}