const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./src/models/User');
const Recipe = require('./src/models/Recipe');
const MealPlan = require('./src/models/MealPlan');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear
  await User.deleteMany({});
  await Recipe.deleteMany({});
  await MealPlan.deleteMany({});
  console.log('Cleared existing data');

  // Users
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@recipehub.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Platform administrator and food enthusiast.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  });

  const user1 = await User.create({
    name: 'Priya Sharma',
    email: 'user@recipehub.com',
    password: 'user123',
    bio: 'Home cook from Chennai. Love South Indian cuisine!',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
  });

  const user2 = await User.create({
    name: 'Marco Rossi',
    email: 'marco@recipehub.com',
    password: 'user123',
    bio: 'Italian chef sharing family recipes.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marco',
  });

  console.log('Created users');

  // Recipes
  const recipes = await Recipe.insertMany([
    {
      title: 'Creamy Mushroom Pasta',
      description: 'A rich and indulgent pasta with a creamy mushroom sauce. Ready in 25 minutes — perfect for a weeknight dinner.',
      category: 'Dinner',
      cookTime: 25,
      servings: 4,
      imageUrl: 'https://images.unsplash.com/photo-1572441713132-c542fc4fe282?w=600&q=80',
      author: user2._id,
      tags: ['pasta', 'vegetarian', 'italian', 'quick'],
      ingredients: [
        { name: 'Penne pasta', quantity: '400g' },
        { name: 'Button mushrooms', quantity: '300g' },
        { name: 'Heavy cream', quantity: '1 cup' },
        { name: 'Garlic cloves', quantity: '4' },
        { name: 'Parmesan cheese', quantity: '80g' },
        { name: 'Olive oil', quantity: '2 tbsp' },
        { name: 'Fresh parsley', quantity: 'handful' },
        { name: 'Salt and pepper', quantity: 'to taste' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Boil salted water and cook penne until al dente. Reserve 1 cup of pasta water before draining.' },
        { stepNumber: 2, instruction: 'Slice mushrooms. Heat olive oil in a large pan over medium-high heat and sauté mushrooms until golden brown, about 5 minutes.' },
        { stepNumber: 3, instruction: 'Add minced garlic and cook for 1 minute until fragrant.' },
        { stepNumber: 4, instruction: 'Pour in cream, stir and simmer for 3 minutes. Add grated Parmesan and season well.' },
        { stepNumber: 5, instruction: 'Toss in drained pasta. Add pasta water if needed to loosen the sauce. Garnish with fresh parsley and serve.' },
      ],
      ratings: [{ user: admin._id, value: 5 }, { user: user1._id, value: 4 }],
    },
    {
      title: 'Classic South Indian Sambar',
      description: 'Hearty lentil and vegetable stew with a fragrant tempering. A staple of South Indian households — pairs perfectly with rice or idli.',
      category: 'Lunch',
      cookTime: 40,
      servings: 6,
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
      author: user1._id,
      tags: ['indian', 'vegan', 'lentils', 'south-indian'],
      ingredients: [
        { name: 'Toor dal (split pigeon peas)', quantity: '1 cup' },
        { name: 'Tamarind paste', quantity: '2 tbsp' },
        { name: 'Tomatoes', quantity: '2 medium' },
        { name: 'Drumsticks (moringa)', quantity: '2' },
        { name: 'Onion', quantity: '1 large' },
        { name: 'Sambar powder', quantity: '2 tbsp' },
        { name: 'Turmeric', quantity: '1 tsp' },
        { name: 'Mustard seeds', quantity: '1 tsp' },
        { name: 'Curry leaves', quantity: '10 leaves' },
        { name: 'Red dried chillies', quantity: '2' },
        { name: 'Coconut oil', quantity: '2 tbsp' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Pressure cook toor dal with turmeric and water until soft (3 whistles). Mash well.' },
        { stepNumber: 2, instruction: 'In a pot, combine tamarind water, chopped tomatoes, drumsticks, and onion. Cook for 10 minutes.' },
        { stepNumber: 3, instruction: 'Add mashed dal, sambar powder, salt and simmer for 15 minutes until flavours meld.' },
        { stepNumber: 4, instruction: 'Heat coconut oil in a small pan. Add mustard seeds — let them splutter. Add dried chillies and curry leaves.' },
        { stepNumber: 5, instruction: 'Pour the tempering over the sambar. Stir and serve hot with rice or idli.' },
      ],
      ratings: [{ user: admin._id, value: 5 }, { user: user2._id, value: 5 }],
    },
    {
      title: 'Avocado Toast with Poached Eggs',
      description: 'Elevated breakfast staple with creamy avocado, perfectly poached eggs and a sprinkle of chilli flakes. Healthy and delicious.',
      category: 'Breakfast',
      cookTime: 15,
      servings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&q=80',
      author: admin._id,
      tags: ['breakfast', 'healthy', 'eggs', 'quick'],
      ingredients: [
        { name: 'Sourdough bread slices', quantity: '2' },
        { name: 'Ripe avocados', quantity: '2' },
        { name: 'Eggs', quantity: '2 large' },
        { name: 'Lemon juice', quantity: '1 tbsp' },
        { name: 'Chilli flakes', quantity: 'pinch' },
        { name: 'Salt and black pepper', quantity: 'to taste' },
        { name: 'White vinegar', quantity: '1 tbsp' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Toast sourdough bread until golden and crisp.' },
        { stepNumber: 2, instruction: 'Mash avocado with lemon juice, salt and pepper until smooth but chunky.' },
        { stepNumber: 3, instruction: 'Bring a pot of water to a gentle simmer. Add white vinegar. Create a gentle swirl and crack egg into the centre. Poach for 3 minutes.' },
        { stepNumber: 4, instruction: 'Spread avocado on toast, top with poached egg, chilli flakes and a grind of black pepper.' },
      ],
      ratings: [{ user: user1._id, value: 4 }, { user: user2._id, value: 5 }],
    },
    {
      title: 'Mango Lassi',
      description: 'Chilled, creamy Indian yoghurt drink blended with fresh mangoes and a hint of cardamom. The perfect summer cooler.',
      category: 'Beverage',
      cookTime: 5,
      servings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1571006682755-bbc2e8c0ec42?w=600&q=80',
      author: user1._id,
      tags: ['drink', 'mango', 'indian', 'summer', 'quick'],
      ingredients: [
        { name: 'Ripe mango pulp', quantity: '1 cup' },
        { name: 'Plain yoghurt', quantity: '1 cup' },
        { name: 'Milk', quantity: '1/2 cup' },
        { name: 'Sugar', quantity: '2 tbsp' },
        { name: 'Cardamom powder', quantity: '1/4 tsp' },
        { name: 'Ice cubes', quantity: 'handful' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Add mango pulp, yoghurt, milk, sugar and cardamom to a blender.' },
        { stepNumber: 2, instruction: 'Blend until completely smooth and frothy.' },
        { stepNumber: 3, instruction: 'Add ice and blend briefly. Pour into chilled glasses and serve immediately.' },
      ],
      ratings: [{ user: admin._id, value: 5 }],
    },
    {
      title: 'Tiramisu',
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream. Sophisticated, rich and utterly irresistible.',
      category: 'Dessert',
      cookTime: 30,
      servings: 8,
      imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80',
      author: user2._id,
      tags: ['italian', 'dessert', 'coffee', 'no-bake'],
      ingredients: [
        { name: 'Savoiardi ladyfingers', quantity: '300g' },
        { name: 'Mascarpone cheese', quantity: '500g' },
        { name: 'Eggs (separated)', quantity: '4 large' },
        { name: 'Sugar', quantity: '100g' },
        { name: 'Strong espresso (cooled)', quantity: '2 cups' },
        { name: 'Dark rum or Marsala', quantity: '3 tbsp' },
        { name: 'Unsweetened cocoa powder', quantity: '3 tbsp' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Whisk egg yolks with sugar until pale and thick. Fold in mascarpone until smooth.' },
        { stepNumber: 2, instruction: 'Beat egg whites to stiff peaks. Gently fold into mascarpone mixture.' },
        { stepNumber: 3, instruction: 'Mix cooled espresso with rum. Quickly dip each ladyfinger and layer in a dish.' },
        { stepNumber: 4, instruction: 'Spread half the mascarpone cream over ladyfingers. Add another layer of dipped biscuits then the remaining cream.' },
        { stepNumber: 5, instruction: 'Refrigerate for at least 4 hours (overnight is best). Dust generously with cocoa before serving.' },
      ],
      ratings: [{ user: user1._id, value: 5 }, { user: admin._id, value: 5 }],
    },
    {
      title: 'Veggie Buddha Bowl',
      description: 'Nourishing bowl packed with roasted vegetables, quinoa, chickpeas and a zingy tahini dressing. 100% plant-based.',
      category: 'Vegan',
      cookTime: 35,
      servings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
      author: admin._id,
      tags: ['vegan', 'healthy', 'bowl', 'gluten-free'],
      ingredients: [
        { name: 'Quinoa', quantity: '1 cup' },
        { name: 'Chickpeas (canned)', quantity: '1 can' },
        { name: 'Sweet potato', quantity: '1 large' },
        { name: 'Broccoli florets', quantity: '2 cups' },
        { name: 'Tahini', quantity: '3 tbsp' },
        { name: 'Lemon juice', quantity: '2 tbsp' },
        { name: 'Garlic clove', quantity: '1' },
        { name: 'Olive oil', quantity: '3 tbsp' },
        { name: 'Paprika', quantity: '1 tsp' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Cook quinoa according to package instructions. Set aside.' },
        { stepNumber: 2, instruction: 'Dice sweet potato, toss with olive oil, paprika, salt. Roast at 200°C for 25 minutes.' },
        { stepNumber: 3, instruction: 'Drain chickpeas, toss with olive oil and spices, roast alongside sweet potato for 20 minutes until crispy.' },
        { stepNumber: 4, instruction: 'Steam or roast broccoli until just tender.' },
        { stepNumber: 5, instruction: 'Whisk tahini, lemon juice, minced garlic and 3 tbsp water until smooth. Assemble bowls and drizzle dressing.' },
      ],
    },
  ]);

  console.log(`Created ${recipes.length} recipes`);
  console.log('\n✅ Seed complete!');
  console.log('   Admin: admin@recipehub.com / admin123');
  console.log('   User:  user@recipehub.com  / user123');
  console.log('   User:  marco@recipehub.com / user123\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
