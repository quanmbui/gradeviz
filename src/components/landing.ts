import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Course } from '../util/courseModel';
import { CourseDataSource, updateCourseGrade } from '../services/courses';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { departments, Department, instanceOfDepartment } from '../util/departments';
import PDFJS from 'pdfjs-dist';

@Component({
	selector: 'landing-component',
	templateUrl: './landing.html',
	styleUrls: ['./landing.css']
})
export class LandingComponent{
	departmentCtrl: FormControl;
	filteredDepartments: Observable<any[]>;

	courseNameCtrl: FormControl;
	filteredCourses: Observable<any[]>;

	displayedColumns: string[] = ['id', 'name', 'instructorName', 'quality', 'medianGrade'];
	courseDataSource: CourseDataSource;
	hasCourses: boolean;

	semesters: any[];
	selectedSemester: any;

	static db: AngularFireDatabase;

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

	constructor(
		private db: AngularFireDatabase,
		private router: Router
		) {
		this.courseDataSource = new CourseDataSource(db, 'S16');
		LandingComponent.db = db;

		this.departmentCtrl = new FormControl();
		this.courseNameCtrl = new FormControl();

		this.semesters = [{
			name: "Fall 2011",
			abv: "F11"
		}, {
			name: "Spring 2012",
			abv: "S12"
		}, { 
			name: "Fall 2012",
			abv: "F12"
		}, { 
			name:"Spring 2013", 
			abv: "S13" 
		}, {
			name: "Fall 2013", 
			abv: "F13"
		}, { 
			name: "Spring 2014", 
			abv: "S14"
		}, {
			name:"Fall 2014", 
			abv: "F14"
		}, {
			name: "Fall 2015",
			abv: "F15"
		}, {
			name:"Spring 2016",
			abv: "S16"
		}];

		this.selectedSemester = this.semesters[this.semesters.length - 1];

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
		var semester: string = this.selectedSemester.abv;

		console.log(semester);

		if (department) {
			this.courseDataSource = new CourseDataSource(LandingComponent.db, semester, department);
			this.courseDataSource.connect().subscribe(resp => {
				if (resp.length > 0) {
					this.hasCourses = true;
					this.scrollToCourses();
				}
			});
		} else {
			this.router.navigate(['/dashboard', courseName]);
		}

		return null
	}

	transcriptPDFHandler(event) {
		let fileInput = event.target.files[0],
		reader = new FileReader();

		var semesters = {"Fall 2011": "F11", "Spring 2012": "S12", "Fall 2012": "F12", "Spring 2013": "S13",
		"Fall 2013": "F13", "Spring 2014": "S14", "Fall 2014": "F14", "Spring 2015": "S15",
		"Fall 2015": "F15", "Spring 2016": "S16"};


		var gradesList = ["A+", "A", "A-", "B+", "B", "B-",
		"C+", "C", "C-", "D+", "D", "F"];


		var courseList = [];
		var allPagesPromises = [];

		reader.onload = function () {
			var pdfTypedArray = new Uint8Array(this.result);
			PDFJS.getDocument(pdfTypedArray).then( function(pdf) {
				var numPages = pdf.numPages;
				var currSemester;
				for ( var n = numPages; n > 0; n--) {
					pdf.getPage(n).then( function(page) {
						var page = page.getTextContent().then( function(textContent) {
							var currCourse: {[k: string]: any} = {};
							for ( let item of textContent.items ) {
								var itemString = item.str;
								if ( Object.keys(semesters).includes(itemString) ) {
									currSemester = semesters[itemString];
								}
								if (item.transform[4] == 123.048) {
									currCourse = {
										"courseID": itemString.replace('.', ''),
										"semester": currSemester
									}
								}
								if (item.transform[4] == 169.992 && itemString.indexOf("GPA") == -1 && itemString.indexOf("COURSE TITLE") == -1) {
									currCourse.courseName = itemString;
								}
								if (item.transform[4] == 373.968 && itemString.indexOf("TOTAL") == -1 && gradesList.includes(itemString)) {
									currCourse.letterGrade = itemString;
									if (currCourse.semester != undefined) {
										courseList.push(currCourse);
										updateCourseGrade(LandingComponent.db, currCourse.semester, currCourse.courseID, currCourse.letterGrade)
									}
								}
							}
						});
						allPagesPromises.push(page);
					});

				}
			});
		}

		Promise.all(allPagesPromises).then( function() {
			console.log(courseList);
		});

		reader.readAsArrayBuffer(fileInput);
	}

	public scrollToCourses() {
		var element = document.getElementById('courses-table');

		if(element) {
			element.scrollIntoView({behavior: "smooth"});
		}
	}
}
