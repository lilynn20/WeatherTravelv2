/**
 * Smart Packing List Generator
 * Generates personalized packing lists based on weather, trip duration, and activities
 */

const packingDatabase = {
  // Clothing items by temperature ranges
  clothing: {
    hot: {
      essential: [
        "Light cotton t-shirts",
        "Shorts",
        "Sundress/light dress",
        "Sandals",
        "Sunglasses",
        "Sun hat/cap",
        "Swimwear",
        "Light breathable underwear"
      ],
      recommended: [
        "Light cardigan for AC",
        "Flip flops",
        "Beach cover-up",
        "Athletic wear for exercise"
      ]
    },
    warm: {
      essential: [
        "T-shirts/casual tops",
        "Light pants/jeans",
        "Comfortable walking shoes",
        "Light jacket",
        "Sunglasses"
      ],
      recommended: [
        "Shorts",
        "Sneakers",
        "Layers for temperature changes"
      ]
    },
    mild: {
      essential: [
        "Long-sleeve shirts",
        "Jeans/pants",
        "Light sweater",
        "Comfortable shoes",
        "Light jacket"
      ],
      recommended: [
        "Layering pieces",
        "Scarf",
        "Closed-toe shoes"
      ]
    },
    cool: {
      essential: [
        "Warm sweaters",
        "Long pants/jeans",
        "Warm jacket",
        "Closed-toe shoes",
        "Socks",
        "Long underwear"
      ],
      recommended: [
        "Thermal layers",
        "Warm scarf",
        "Gloves",
        "Warm hat"
      ]
    },
    cold: {
      essential: [
        "Winter coat/parka",
        "Thermal underwear",
        "Thick sweaters",
        "Warm pants",
        "Winter boots",
        "Thick socks",
        "Winter gloves",
        "Warm hat/beanie",
        "Scarf"
      ],
      recommended: [
        "Hand warmers",
        "Face mask/balaclava",
        "Extra layers",
        "Waterproof boots"
      ]
    }
  },

  // Weather-specific items
  weatherSpecific: {
    rainy: [
      "Waterproof jacket/raincoat",
      "Umbrella",
      "Waterproof shoes/boots",
      "Rain pants (optional)",
      "Waterproof bag cover"
    ],
    sunny: [
      "Sunscreen (SPF 30+)",
      "After-sun lotion",
      "Sunglasses (UV protection)",
      "Sun hat",
      "Light, breathable clothing"
    ],
    windy: [
      "Windbreaker",
      "Hair ties/clips",
      "Moisturizer (for dry skin)"
    ],
    humid: [
      "Breathable, moisture-wicking clothing",
      "Anti-chafing products",
      "Extra deodorant",
      "Quick-dry towel"
    ]
  },

  // Activity-specific items
  activities: {
    beach: [
      "Swimsuit (2-3)",
      "Beach towel",
      "Flip flops",
      "Waterproof phone case",
      "Beach bag",
      "Snorkel gear (optional)"
    ],
    hiking: [
      "Hiking boots",
      "Moisture-wicking socks",
      "Backpack",
      "Water bottle",
      "Trail snacks",
      "First aid kit",
      "Map/GPS device",
      "Sunscreen",
      "Insect repellent"
    ],
    business: [
      "Business suits/formal wear",
      "Dress shoes",
      "Laptop and charger",
      "Business cards",
      "Portfolio/briefcase",
      "Iron/steamer",
      "Professional accessories"
    ],
    adventure: [
      "Sturdy shoes/boots",
      "Quick-dry clothing",
      "Action camera",
      "Multi-tool",
      "Headlamp/flashlight",
      "Portable charger"
    ],
    culture: [
      "Comfortable walking shoes",
      "Day backpack",
      "Camera",
      "Guidebook/maps",
      "Modest clothing (for religious sites)",
      "Reusable water bottle"
    ]
  },

  // Essential items for all trips
  essentials: {
    documents: [
      "Passport/ID",
      "Travel insurance documents",
      "Booking confirmations",
      "Emergency contacts list",
      "Copies of important documents"
    ],
    toiletries: [
      "Toothbrush and toothpaste",
      "Shampoo and conditioner",
      "Body wash/soap",
      "Deodorant",
      "Skincare products",
      "Medications (prescription)",
      "First aid kit basics",
      "Nail clipper",
      "Razor"
    ],
    electronics: [
      "Phone and charger",
      "Power bank",
      "Universal adapter",
      "Headphones",
      "Camera (optional)"
    ],
    miscellaneous: [
      "Reusable water bottle",
      "Snacks for travel",
      "Book/entertainment",
      "Travel pillow",
      "Eye mask and earplugs",
      "Plastic bags (for laundry)",
      "Small daypack"
    ]
  }
};

/**
 * Generate personalized packing list
 */
exports.generatePackingList = (weatherData, tripDetails) => {
  const {
    duration = 7,
    activities = [],
    style = "casual"
  } = tripDetails;

  const packingList = {
    clothing: [],
    weatherGear: [],
    activityGear: [],
    essentials: {},
    tips: []
  };

  // Determine temperature category
  const temp = weatherData.main?.temp;
  const category = getTempCategory(temp);

  // Add clothing based on temperature
  packingList.clothing = [
    ...packingDatabase.clothing[category].essential,
    ...packingDatabase.clothing[category].recommended
  ];

  // Add weather-specific items
  if (weatherData.rain || weatherData.clouds?.all > 70) {
    packingList.weatherGear.push(...packingDatabase.weatherSpecific.rainy);
    packingList.tips.push("Rain is expected - pack waterproof items");
  }

  if (temp > 25) {
    packingList.weatherGear.push(...packingDatabase.weatherSpecific.sunny);
    packingList.tips.push("Hot weather - stay hydrated and protected from sun");
  }

  if (weatherData.wind?.speed > 10) {
    packingList.weatherGear.push(...packingDatabase.weatherSpecific.windy);
  }

  if (weatherData.main?.humidity > 70) {
    packingList.weatherGear.push(...packingDatabase.weatherSpecific.humid);
    packingList.tips.push("High humidity - pack breathable fabrics");
  }

  // Add activity-specific gear
  activities.forEach(activity => {
    const activityLower = activity.toLowerCase();
    if (packingDatabase.activities[activityLower]) {
      packingList.activityGear.push({
        activity: activity,
        items: packingDatabase.activities[activityLower]
      });
    }
  });

  // Add essentials
  packingList.essentials = {
    documents: [...packingDatabase.essentials.documents],
    toiletries: [...packingDatabase.essentials.toiletries],
    electronics: [...packingDatabase.essentials.electronics],
    miscellaneous: [...packingDatabase.essentials.miscellaneous]
  };

  // Add duration-based tips
  if (duration <= 3) {
    packingList.tips.push("Short trip - pack carry-on only");
    packingList.tips.push("Limit to 3 outfit combinations");
  } else if (duration <= 7) {
    packingList.tips.push("Week-long trip - plan for laundry mid-trip");
    packingList.tips.push("Pack versatile pieces that mix and match");
  } else {
    packingList.tips.push("Extended trip - definitely plan for laundry");
    packingList.tips.push("Consider shipping heavy items ahead");
  }

  // Calculate clothing quantities
  packingList.quantities = calculateQuantities(duration, category);

  // Add space-saving tips
  packingList.tips.push("Roll clothes to save space and reduce wrinkles");
  packingList.tips.push("Use packing cubes for organization");
  packingList.tips.push("Wear bulkiest items during travel");

  return packingList;
};

/**
 * Get temperature category
 */
function getTempCategory(temp) {
  if (temp >= 30) return "hot";
  if (temp >= 20) return "warm";
  if (temp >= 10) return "mild";
  if (temp >= 0) return "cool";
  return "cold";
}

/**
 * Calculate clothing quantities based on duration
 */
function calculateQuantities(duration, category) {
  const base = {
    underwear: Math.min(duration + 2, 10),
    socks: Math.min(duration + 1, 8),
    tops: Math.ceil(duration / 2) + 1,
    bottoms: Math.ceil(duration / 3) + 1,
    outerwear: category === "cold" ? 2 : 1
  };

  if (duration > 7) {
    base.tops = Math.min(base.tops, 6);
    base.bottoms = Math.min(base.bottoms, 4);
  }

  return base;
}

/**
 * Generate minimal packing list (carry-on only)
 */
exports.generateMinimalList = (weatherData, duration) => {
  const temp = weatherData.main?.temp;
  const category = getTempCategory(temp);

  return {
    clothing: packingDatabase.clothing[category].essential.slice(0, 5),
    essentials: {
      documents: packingDatabase.essentials.documents.slice(0, 3),
      toiletries: ["Travel-size toiletries", "Medications"],
      electronics: ["Phone + charger", "Power bank"]
    },
    tips: [
      "Carry-on only - pack light!",
      "Wear bulkiest items on plane",
      "Plan to do laundry",
      "Limit to one small bag"
    ],
    quantities: {
      tops: 3,
      bottoms: 2,
      underwear: 4,
      socks: 3,
      outerwear: 1
    }
  };
};

/**
 * Get packing checklist with checkboxes
 */
exports.getPackingChecklist = (packingList) => {
  const checklist = [];

  // Clothing
  if (packingList.clothing) {
    checklist.push({
      category: "Clothing",
      items: packingList.clothing.map(item => ({ name: item, checked: false }))
    });
  }

  // Weather gear
  if (packingList.weatherGear && packingList.weatherGear.length > 0) {
    checklist.push({
      category: "Weather Gear",
      items: packingList.weatherGear.map(item => ({ name: item, checked: false }))
    });
  }

  // Activity gear
  if (packingList.activityGear) {
    packingList.activityGear.forEach(activity => {
      checklist.push({
        category: `${activity.activity} Gear`,
        items: activity.items.map(item => ({ name: item, checked: false }))
      });
    });
  }

  // Essentials
  if (packingList.essentials) {
    Object.keys(packingList.essentials).forEach(key => {
      checklist.push({
        category: key.charAt(0).toUpperCase() + key.slice(1),
        items: packingList.essentials[key].map(item => ({ name: item, checked: false }))
      });
    });
  }

  return checklist;
};

/**
 * Smart suggestions based on destination
 */
exports.getDestinationSpecificTips = (city, weatherData) => {
  const tips = [];
  
  // Add general tips
  tips.push("Check visa requirements for your destination");
  tips.push("Notify your bank of travel plans");
  tips.push("Download offline maps");
  
  // Weather-based tips
  if (weatherData.main?.temp > 30) {
    tips.push("Pack electrolyte supplements for hot weather");
  }
  
  if (weatherData.rain) {
    tips.push("Download entertainment for indoor time");
  }

  return tips;
};

module.exports = exports;
