new Vue({
	delimiters : ['${','}'],
	el: '#app',
	data: {
		results: [],
		subject: 'all',
		genre: 'all',
		grade: 'all',
		search: '',
		checked: false,
		isActive: false,
		resultsHide: false,
		resultsEmpty: false
	},
	mounted() {
		axios
		.post('http://krapipl.imumk.ru:8082/api/mobilev1/update',{
			data: ''
		})
		.then(response => {
			for (var i = 0, l = response.data.items.length; i < l; i++) {
				var grade_arr = response.data.items[i].grade.split(';');
				var grade = "";
				if (grade_arr.length > 1) {
					grade = grade_arr[0] + "-" + grade_arr[grade_arr.length - 1] + " классы"
				}else{
					grade = grade_arr + " класс";	
				}
				response.data.items[i].gradeNew = grade;
			}
			this.results = response.data.items;
		});
	},
	computed: {
		filteredList () {
			return this.results
			.filter(item=>{
				if (this.subject == 'all'){
					return this.results;
				}
				return item.subject.indexOf(this.subject) > -1
			})
			.filter(item=>{
				if (this.genre == 'all'){
					return this.results;
				}
				return item.genre.indexOf(this.genre) > -1
			})
			.filter(item=>{
				if (this.grade == 'all'){
					return this.results;
				}
				var grade_arr = item.grade.split(';');
				if (grade_arr.length > 1) {
					for (var i = 0, l = grade_arr.length; i < l; i++)
					{
						if (grade_arr[i] == this.grade) {
							return item;
						}
					}
				}else{
					if (grade_arr == this.grade)
						return item;
				}
			})
			.filter(item=>{
				return this.search == '' || item.title.toLowerCase().indexOf(this.search.toLowerCase()) !== -1;
			})
		}
	},
	watch: {
		filteredList: {
			handler: function (val, oldVal) {
				if (val.length < 1)
					this.resultsEmpty = true
				else
					this.resultsEmpty = false

				if (val.length != this.results.length)
					this.resultsHide = true
				else
					this.resultsHide = false
			},
			deep: true
		}
	},
	methods: {
		menuBtn: function(){
			this.isActive = !this.isActive;
		}
	}
})
