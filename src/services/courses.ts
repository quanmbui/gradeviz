import { DataSource } from '@angular/cdk/collections';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Course } from '../util/courseModel';
import { Department } from '../util/departments'

export class CourseDataSource extends DataSource<any> {
  courseResults: FirebaseListObservable<Course[]>;

  departmentSubject: Subject<string>;
  nameSubject: Subject<string>;
  semesterSubject: Subject<string>;

  orderByChild: string;

  constructor(db: AngularFireDatabase, semester: string, department?: Department) {
    super();

    console.log('created a new data source! ' + semester + " " + (department ? department.number : 'no dept'))

    this.courseResults = db.list('/Evals/-KuCNE-hpCTy1rIjQ0lE/' + semester, {
      query: {
        orderByChild: 'DeptID',
        equalTo: department ? department.number : ''
      }
    });
  }

  public connect(): Observable<Course[]> {
    return this.courseResults;
  }

  public disconnect() {}
}

export function updateCourseGrade(db: AngularFireDatabase, semester, courseID, letterGrade) {
    var course = db.object('/Evals/-KuCNE-hpCTy1rIjQ0lE/' + semester + '/' + courseID);
    var courseDistributionArray = db.list('/Evals/-KuCNE-hpCTy1rIjQ0lE/' + semester + '/' + courseID + '/distributionArray');
    if ( courseDistributionArray != undefined ) {
        courseDistributionArray.push(letterGrade);
    } else {
        // var distributionArray = [letterGrade];
        course.update({"distributionArray": [letterGrade]});
    }
}
