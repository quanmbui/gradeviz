import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	departmentCtrl: FormControl;
	filteredDepartments: Observable<any[]>;

	courseCtrl: FormControl;
	filteredCourses: Observable<any[]>;

	isWritingIntensive: boolean = false;

	courseDesignations : any[] = ['H', 'N']

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
		this.courseCtrl = new FormControl();

		this.filteredDepartments = this.departmentCtrl.valueChanges
		.startWith(null)
		.map(department => department ? this.filterDepartments(department) : []);

		this.filteredCourses = this.courseCtrl.valueChanges
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
}
