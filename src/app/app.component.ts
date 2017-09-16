import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Course } from '../util/courseModel';
import { SemesterEnum } from '../util/semesterEnum';
import { CourseDataSource } from '../services/courses';

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
  	dataSource = new CourseDataSource();

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
		var department: string = this.departmentCtrl.value;
		var isWritingIntensive: boolean = this.isWritingIntensive;
		var courseDesignation: string = this.courseDesignation;
		var courseName: string = this.courseNameCtrl.value;

		console.log("Department: " + department)
		console.log("Writing Intensive: " + isWritingIntensive)
		console.log("Course Designation: " + courseDesignation)
		console.log("Course Name: " + courseName)

		this.dataSource.search(department, courseName, isWritingIntensive, courseDesignation)

		return null
	}
}
