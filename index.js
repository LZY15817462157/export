const axios = require('axios');
const { getQuery, getMutate } = require('./module/request.js');
const { getMeal, addDishes,addMeal } = require('./gql/readGql.js');
require('yu-array');


axios.get('http://cateraway-api-dev.ap-east-1.elasticbeanstalk.com/menu/categorielist').then(res => {
	let data = res.data.data.splice(1);
	let meals = meal(data)
	console.log(meals)
	meals.asyncNextEach((meal, index1, next1) => {
		meal.classify.asyncNextEach((o, index2, next2) => {
			o.dishes.asyncNextEach((dish, index3, next3) => {
				getMutate(addDishes, { add:dish}).then(res=>{
					const {id}=res.data.addDishes[0]
					dish.id = id
					next3()
				})
			}).then(res=>{
				next2()
			})
		}).then(res=>{
			getMutate(addMeal,{add:meal}).then(res=>{
				next1()
			})
		})
	}).then(() => {
		console.log('完成了')
	})

	// meals.forEach((meal,i)=>{
	// 	meal.classify.forEach(type=>{

	// 		if(meal.name==='30人大滿足船P套餐'){
	// 			console.log('--------------------')
	// 			console.log(i,type.name)
	// 		}
	// 		type.dishes.forEach(dish=>{
	// 			// if(meal.name==='30人大滿足船P套餐') console.log(dish.name)
	// 		})
	// 	})
	// })
	// let dishes = getDishes(data);
	// console.log(data);
	// getMutate(addDishes,{ add:dishes }).then(res=>{
	//   console.log(res)
	// }).catch(err=>{
	//   console.log('err',err)
	// })
});


// function meal(data){
//   let arr = [];
//   data.forEach(meals=>{
//     meals.menusets.forEach(meal=>{
// 			if(meal.menus.length<1) return;
// 			let nMeal = {classify:[]};
// 			Object.keys(meal).forEach(key=>{
// 				if(/^(name|prices|description)$/.test(key)){
// 					nMeal[key] = meal[key];
// 				}
// 			})
// 			arr.push(nMeal);
//       meal.menus.forEach(classify=>{
// 				let nClassify = {};
// 				nClassify.name = classify.name;
// 				nClassify.dishes = [];
// 				nMeal.classify.push(nClassify);
//         classify.items.forEach(dish=>{
// 					nClassify.dishes.push(dish)
//         })
//       })
//     })
//   })
// 	return arr;
// }



// function getDishes(data){
//   let arr = [];
//   data.forEach(meals=>{
//     meals.menusets.forEach(meal=>{
//       meal.menus.forEach(classify=>{
//         let type = classify.name;
//         classify.items.forEach(dish=>{
//           const { id,name,price } = dish;
//           arr.push({ id,name,price,type })
//         })
//       })
//     })
//   })
//   arr.sort((a,b)=>a.id-b.id)
//   let indexs = [];
//   arr.reduce((a,b,i)=>{
//     if(a.id===b.id) indexs.push(i);
//     return b;
//   })
//   indexs.forEach(v=>arr.splice(v,1));
//   return arr.map(o=>{
//     const { name,price,type } = o;
//     return { name,price,type };
//   })
// }

function meal(data) {
	var arr = []
	data.forEach(meals => {
		meals.menusets.forEach(meal => {
			if (meal.menus.length < 1) return;
			var nMeal = { classify: [],type:meals.name }
			Object.keys(meal).forEach(key => {
				if ((/^(name|prices|description|img)$/).test(key)) {
					if (key === 'prices') {
						nMeal['price'] = meal[key]
					} else if (key === 'description') {
						nMeal['mealDetail'] = meal[key]
					} else if(key === 'img') { 
						nMeal['image'] = meal[key] 
					}else {
						nMeal[key] = meal[key]
					}

				}
			})
			arr.push(nMeal)
			meal.menus.forEach(classify => {
				let nClassify = {};
				nClassify.name = classify.name;
				nClassify.dishes = [];
				nMeal.classify.push(nClassify);
				classify.items.forEach(dish => {
					let type = classify.name
					const { name, price } = dish
					nClassify.dishes.push({name,price,type})
				})
			})
		})
	});
	return arr
}