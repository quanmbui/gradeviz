import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Course } from '../util/courseModel';
import { CourseDataSource } from '../services/courses';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { departments, Department, instanceOfDepartment } from '../util/departments'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	departmentCtrl: FormControl;
	filteredDepartments: Observable<any[]>;

	courseNameCtrl: FormControl;
	filteredCourses: Observable<any[]>;

	displayedColumns: string[] = ['id', 'name', 'instructorName', 'quality', 'medianGrade'];
  	courseDataSource: CourseDataSource;

  	db: AngularFireDatabase;

	courses: any[] = [{
		name: 'Arkansas',
		number: '2.978M'
	}, {
		name: 'California',
		number: '39.14M'
	}, {
		name: 'Florida',
		number: '20.27M'
	}, {
		name: 'Texas',
		number: '27.47M'
	}];

	constructor(db: AngularFireDatabase) {
		this.courseDataSource = new CourseDataSource(db, 'S16');
		this.db = db;

		this.departmentCtrl = new FormControl();
		this.courseNameCtrl = new FormControl();

		this.filteredDepartments = this.departmentCtrl.valueChanges
		.startWith(null)
        .map(department => department && instanceOfDepartment(department) ? department.name : department)
        .map(name => name ? this.filterDepartments(name) : []);

		this.filteredCourses = this.courseNameCtrl.valueChanges
		.startWith(null)
		.map(course => course ? this.filterCourses(course) : []);
	}

	filterDepartments(name: string): any[] {
		return departments.filter((department: Department) => {
			return (department.name + department.number).toLowerCase().search(name.toLowerCase()) !== -1});
	}

	displayDepartments(department: Department): string {
		return department ? department.name : '';
	}

	filterCourses(name: string): any[] {
		return this.courses.filter((course) => {
			return course.name.toLowerCase().search(name.toLowerCase()) !== -1});
	}

	search() {
		var department: Department = this.departmentCtrl.value;
		var courseName: string = this.courseNameCtrl.value;
		var semester: string = 'S14';

		this.courseDataSource = new CourseDataSource(this.db, semester, department)

		return null
	}
}
