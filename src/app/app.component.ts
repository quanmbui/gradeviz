import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Course } from '../util/courseModel';
import { SemesterEnum } from '../util/semesterEnum';
import { CourseDataSource } from '../services/courses';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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

	departments: any[] = [{
		name: 'Africana Studies',
		number: '362'
	}, {
		name: 'Anthropology',
		number: '220'
	}, {
		name: 'Applied Mathematics and Statistics',
		number: '220'
	}, {
		name: 'Arabic',
		number: '375'
	}, {
		name: 'Behavioral Biology',
		number: '290'
	}, {
		name: 'Biology',
		number: '020'
	}, {
		name: 'Biomedical Engineering',
		number: '580'
	}, {
		name: 'Biophysics',
		number: '250'
	}, {
		name: 'Chemical and Biomolecular Engineering',
		number: '540'
	}, {
		name: 'Center for Leadership Education',
		number: '660'
	}, {
		name: 'Chemistry',
		number: '030'
	}, {
		name: 'Chinese',
		number: '373'
	}, {
		name: 'Civil Engineering',
		number: '560'
	}, {
		name: 'Classics',
		number: '040'
	}, {
		name: 'Cognitive Science',
		number: '050'
	}, {
		name: 'Computer Science',
		number: '600, 601'
	}, {
		name: 'Earth and Planetary Sciences',
		number: '270, 271'
	}, {
		name: 'East Asian Studies',
		number: '310'
	}, {
		name: 'Economics',
		number: '180'
	}, {
		name: 'Electrical and Computer Engineering',
		number: '520'
	}, {
		name: 'Engineering Management',
		number: '662'
	}, {
		name: 'English',
		number: '060'
	}, {
		name: 'English as a Second Language',
		number: '370'
	}, {
		name: 'Entrepreneurship & Management',
		number: '660'
	}, {
		name: 'Environmental Health and Engineering',
		number: '570'
	}, {
		name: 'Film and Media Studies',
		number: '061'
	}, {
		name: 'General Engineering',
		number: '500'
	}, {
		name: 'German and Romance Languages and Literatures',
		number: '210-216'
	}, {
		name: 'Hebrew',
		number: '384'
	}, {
		name: 'Hindi',
		number: '381'
	}, {
		name: 'History',
		number: '100'
	}, {
		name: 'History of Art',
		number: '010'
	}, {
		name: 'History of Science and Technology',
		number: '140'
	}, {
		name: 'Humanities',
		number: '300'
	}, {
		name: 'Information Security Institute',
		number: '650'
	}, {
		name: 'Interdepartmental',
		number: '360'
	}, {
		name: 'International Studies',
		number: '192'
	}, {
		name: 'Islamic Studies',
		number: '194'
	}, {
		name: 'Japanese',
		number: '378'
	}, {
		name: 'Kiswahili',
		number: '379'
	}, {
		name: 'Korean',
		number: '380'
	}, {
		name: 'Jewish Studies Program',
		number: '193'
	}, {
		name: 'Latin American Studies',
		number: '361'
	}, {
		name: 'Materials Science and Engineering',
		number: '510'
	}, {
		name: 'Mathematics',
		number: '110'
	}, {
		name: 'Mechanical Engineering',
		number: '530'
	}, {
		name: 'Medicine, Science and the Humanities',
		number: '145'
	}, {
		name: 'Military Science',
		number: '374'
	}, {
		name: 'Museum and Society Program',
		number: '389'
	}, {
		name: 'Music',
		number: '376'
	}, {
		name: 'Near Eastern Studies',
		number: '130-134'
	}, {
		name: 'Neuroscience',
		number: '080'
	}, {
		name: 'Nanobiotechnology',
		number: '670'
	}, {
		name: 'Persian',
		number: '382'
	}, {
		name: 'Philosophy',
		number: '150'
	}, {
		name: 'Physics and Astronomy',
		number: '171-173'
	}, {
		name: 'Political Science',
		number: '190-191'
	}, {
		name: 'Professional Communication',
		number: '661'
	}, {
		name: 'Psychological and Brain Sciences',
		number: '200'
	}, {
		name: 'Public Health Studies',
		number: '280'
	}, {
		name: 'Russian',
		number: '377'
	}, {
		name: 'Sanskrit',
		number: '383'
	}, {
		name: 'Sociology',
		number: '230'
	}, {
		name: 'Theatre Arts and Studies',
		number: '225'
	}, {
		name: 'Visual Arts',
		number: '371'
	}, {
		name: 'Women, Gender and Sexuality',
		number: '363'
	}, {
		name: 'Writing Seminars',
		number: '220'
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

	constructor(db: AngularFireDatabase) {
		this.courseDataSource = new CourseDataSource(db);

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
			return (department.name + department.number).toLowerCase().search(name.toLowerCase()) !== -1});
	}

	filterCourses(name: string): any[] {
		return this.courses.filter((course) => {
			return course.name.toLowerCase().search(name.toLowerCase()) !== -1});
	}

	search() {
		var department: string = this.departmentCtrl.value;
		var courseName: string = this.courseNameCtrl.value;

		this.courseDataSource.search(department, courseName)

		return null
	}
}
