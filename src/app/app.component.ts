import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Course } from '../util/courseModel'
import { SemesterEnum } from '../util/semesterEnum'


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

	isWritingIntensive: boolean = false;

	courseDesignation: string;
	courseDesignations: any[] = ['H', 'N'];

	displayedColumns = ['id', 'name', 'instructorName', 'quality', 'medianGrade', 'writingIntensive', 'designation'];
  	dataSource = new MyDataSource();

	departments: any[] = [{
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

	constructor() {
		this.departmentCtrl = new FormControl();
		this.courseNameCtrl = new FormControl();

		this.filteredDepartments = this.departmentCtrl.valueChanges
		.startWith(null)
		.map(department => department ? this.filterDepartments(department) : []);

		this.filteredCourses = this.courseNameCtrl.valueChanges
		.startWith(null)
		.map(course => course ? this.filterCourses(course) : []);
	}

	filterDepartments(name: string): any[] {
		return this.departments.filter((department) => {
			return department.name.toLowerCase().indexOf(name.toLowerCase()) === 0});
	}

	filterCourses(name: string): any[] {
		return this.courses.filter((course) => {
			return course.name.toLowerCase().indexOf(name.toLowerCase()) === 0});
	}

	search() {
		console.log("Department: " + this.departmentCtrl.value)
		console.log("Writing Intensive: " + this.isWritingIntensive)
		console.log("Course Designation: " + this.courseDesignation)
		console.log("Course Name: " + this.courseNameCtrl.value)
		console.log("Submitted!")
		return null
	}
}

const courseResults: Course[] = [{
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
}];

export class MyDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Course[]> {
    return Observable.of(courseResults);
  }

  disconnect() {}
}
