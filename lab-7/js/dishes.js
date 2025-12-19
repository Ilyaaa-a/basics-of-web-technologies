// // /lab-6/js/dishes.js

// const dishes = [
//     // --- СУПЫ (6 шт.) ---
//     {
//         keyword: 'gaspacho',
//         name: 'Гаспачо',
//         price: 195,
//         category: 'soup',
//         count: '350 г',
//         image: 'soups/gazpacho',
//         kind: 'veg' // вегетарианский
//     },
//     {
//         keyword: 'mushroom_soup',
//         name: 'Грибной суп-пюре',
//         price: 185,
//         category: 'soup',
//         count: '330 г',
//         image: 'soups/mushroom_soup',
//         kind: 'veg' // вегетарианский
//     },
//     {
//         keyword: 'norwegian_soup',
//         name: 'Норвежский суп',
//         price: 270,
//         category: 'soup',
//         count: '330 г',
//         image: 'soups/norwegian_soup',
//         kind: 'fish' // рыбный
//     },
//     {
//         keyword: 'ramen',
//         name: 'Рамен',
//         price: 375,
//         category: 'soup',
//         count: '425 г',
//         image: 'soups/ramen',
//         kind: 'meat' // мясной
//     },
//     {
//         keyword: 'tom_yam',
//         name: 'Том ям с креветками',
//         price: 650,
//         category: 'soup',
//         count: '500 г',
//         image: 'soups/tomyum',
//         kind: 'fish' // рыбный
//     },
//     {
//         keyword: 'chicken_soup',
//         name: 'Куриный суп',
//         price: 330,
//         category: 'soup',
//         count: '350 г',
//         image: 'soups/chicken',
//         kind: 'meat' // мясной
//     },

//     // --- ГЛАВНЫЕ БЛЮДА (6 шт.) ---
//     {
//         keyword: 'fried_potatoes',
//         name: 'Жареная картошка с грибами',
//         price: 150,
//         category: 'main_course',
//         count: '250 г',
//         image: 'main_course/friedpotatoeswithmushrooms1',
//         kind: 'veg' // вегетарианское
//     },
//     {
//         keyword: 'lasagna',
//         name: 'Лазанья',
//         price: 385,
//         category: 'main_course',
//         count: '310 г',
//         image: 'main_course/lasagna',
//         kind: 'veg' // вегетарианское
//     },
//     {
//         keyword: 'chicken_cutlets',
//         name: 'Котлеты из курицы с картофельным пюре',
//         price: 225,
//         category: 'main_course',
//         count: '280 г',
//         image: 'main_course/chickencutletsandmashedpotatoes',
//         kind: 'meat' // мясное
//     },
//     {
//         keyword: 'fish_cutlet',
//         name: 'Рыбная котлета с рисом и спаржей',
//         price: 320,
//         category: 'main_course',
//         count: '270 г',
//         image: 'main_course/fishrice',
//         kind: 'fish' // рыбное
//     },
//     {
//         keyword: 'pizza_margherita',
//         name: 'Пицца Маргарита',
//         price: 450,
//         category: 'main_course',
//         count: '470 г',
//         image: 'main_course/pizza',
//         kind: 'veg' // вегетарианское
//     },
//     {
//         keyword: 'pasta_shrimp',
//         name: 'Паста с креветками',
//         price: 340,
//         category: 'main_course',
//         count: '280 г',
//         image: 'main_course/shrimppasta',
//         kind: 'fish' // рыбное
//     },

//     // --- САЛАТЫ И СТАРТЕРЫ (6 шт.) ---
//     {
//         keyword: 'korean_salad',
//         name: 'Корейский салат с овощами и яйцом',
//         price: 330,
//         category: 'starter',
//         count: '250 г',
//         image: 'salads_starters/saladwithegg',
//         kind: 'veg' // вегетарианский
//     },
//     {
//         keyword: 'caesar_chicken',
//         name: 'Цезарь с цыпленком',
//         price: 370,
//         category: 'starter',
//         count: '220 г',
//         image: 'salads_starters/caesar',
//         kind: 'meat' // мясной
//     },
//     {
//         keyword: 'caprese',
//         name: 'Капрезе с моцареллой',
//         price: 350,
//         category: 'starter',
//         count: '235 г',
//         image: 'salads_starters/caprese',
//         kind: 'veg' // вегетарианский
//     },
//     {
//         keyword: 'tuna_salad',
//         name: 'Салат с тунцом',
//         price: 480,
//         category: 'starter',
//         count: '250 г',
//         image: 'salads_starters/tunasalad',
//         kind: 'fish' // рыбный
//     },
//     {
//         keyword: 'fries_caesar',
//         name: 'Картофель фри с соусом Цезарь',
//         price: 280,
//         category: 'starter',
//         count: '235 г',
//         image: 'salads_starters/frenchfries1',
//         kind: 'veg' // вегетарианский
//     },
//     {
//         keyword: 'fries_ketchup',
//         name: 'Картофель фри с кетчупом',
//         price: 260,
//         category: 'starter',
//         count: '235 г',
//         image: 'salads_starters/frenchfries2',
//         kind: 'veg' // вегетарианский
//     },

//     // --- НАПИТКИ (6 шт.) ---
//     {
//         keyword: 'orange_juice',
//         name: 'Апельсиновый сок',
//         price: 120,
//         category: 'beverage',
//         count: '300 мл',
//         image: 'beverages/orangejuice',
//         kind: 'cold' // холодный
//     },
//     {
//         keyword: 'apple_juice',
//         name: 'Яблочный сок',
//         price: 90,
//         category: 'beverage',
//         count: '300 мл',
//         image: 'beverages/applejuice',
//         kind: 'cold' // холодный
//     },
//     {
//         keyword: 'carrot_juice',
//         name: 'Морковный сок',
//         price: 110,
//         category: 'beverage',
//         count: '300 мл',
//         image: 'beverages/carrotjuice',
//         kind: 'cold' // холодный
//     },
//     {
//         keyword: 'cappuccino',
//         name: 'Капучино',
//         price: 180,
//         category: 'beverage',
//         count: '300 мл',
//         image: 'beverages/cappuccino',
//         kind: 'hot' // горячий
//     },
//     {
//         keyword: 'green_tea',
//         name: 'Зеленый чай',
//         price: 100,
//         category: 'beverage',
//         count: '300 мл',
//         image: 'beverages/greentea',
//         kind: 'hot' // горячий
//     },
//     {
//         keyword: 'black_tea',
//         name: 'Черный чай',
//         price: 90,
//         category: 'beverage',
//         count: '300 мл',
//         image: 'beverages/tea',
//         kind: 'hot' // горячий
//     },

//     // --- ДЕСЕРТЫ (6 шт.) ---
//     {
//         keyword: 'baklava',
//         name: 'Пахлава',
//         price: 220,
//         category: 'dessert',
//         count: '300 гр',
//         image: 'desserts/baklava',
//         kind: 'small' // маленькая порция
//     },
//     {
//         keyword: 'cheesecake',
//         name: 'Чизкейк',
//         price: 240,
//         category: 'dessert',
//         count: '125 гр',
//         image: 'desserts/cheesecake',
//         kind: 'medium' // средняя порция
//     },
//     {
//         keyword: 'chocolate_cheesecake',
//         name: 'Шоколадный чизкейк',
//         price: 260,
//         category: 'dessert',
//         count: '125 гр',
//         image: 'desserts/chocolatecheesecake',
//         kind: 'medium' // средняя порция
//     },
//     {
//         keyword: 'chocolate_cake',
//         name: 'Шоколадный торт',
//         price: 270,
//         category: 'dessert',
//         count: '140 гр',
//         image: 'desserts/chocolatecake',
//         kind: 'large' // большая порция
//     },
//     {
//         keyword: 'donuts_3',
//         name: 'Пончики (3 штуки)',
//         price: 410,
//         category: 'dessert',
//         count: '350 гр',
//         image: 'desserts/donuts',
//         kind: 'small' // маленькая порция
//     },
//     {
//         keyword: 'donuts_6',
//         name: 'Пончики (6 штук)',
//         price: 650,
//         category: 'dessert',
//         count: '700 гр',
//         image: 'desserts/donuts2',
//         kind: 'large' // большая порция
//     }
// ];