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
	filteredStates: Observable<any[]>;

	departments: any[] = [
	{
		name: 'Arkansas',
		number: '2.978M'
	},
	{
		name: 'California',
		number: '39.14M'
	},
	{
		name: 'Florida',
		number: '20.27M'
	},
	{
		name: 'Texas',
		number: '27.47M'
	}
	];
	
	appName = 'GradeViz';

	constructor() {
		this.departmentCtrl = new FormControl();
		this.filteredStates = this.departmentCtrl.valueChanges
		.startWith(null)
		.map(department=> department? this.filterStates(department) : this.departments.slice());
	}

	filterStates(name: string) {
		return this.departments.filter(department=>
			department.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
	}
}
