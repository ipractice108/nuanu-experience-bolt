import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coffee, Pizza, Salad, Wine, Soup, Plus, Clock, MapPin, Truck, IceCream } from 'lucide-react';
import { useCart } from './CartContext';

interface MenuItem {
  name: string;
  price: number;
  description?: string;
  image?: string;
}

interface MenuCategory {
  name: string;
  items: MenuItem[];
}

interface Menu {
  food: {
    breakfast: MenuCategory;
    lunch: MenuCategory;
    dinner: MenuCategory;
    desserts: MenuCategory;
  };
  drinks: {
    water: MenuCategory;
    juice: MenuCategory;
    tea: MenuCategory;
    coffee: MenuCategory;
  };
}

interface Venue {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  image: string;
  bestSeller: MenuItem;
  icon: React.ElementType;
  menu: Menu;
}

type DeliveryOption = 'dine-in' | 'takeaway' | 'delivery';

interface OrderDetails {
  deliveryOption: DeliveryOption;
  scheduledTime?: string;
  notes?: string;
}

const venues: Venue[] = [
  {
    id: 'ash',
    name: 'Ash',
    description: 'Contemporary dining with artisanal pizzas and craft beverages',
    fullDescription: 'Experience modern dining at its finest with our artisanal pizzas, Mediterranean-inspired dishes, and carefully curated beverage selection. Our space combines industrial chic with warm hospitality.',
    image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&q=80',
    icon: Pizza,
    bestSeller: { name: 'Signature Pizza', price: 80000, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80' },
    menu: {
      food: {
        breakfast: {
          name: 'Breakfast',
          items: [
            { 
              name: 'Breakfast Pizza', 
              price: 75000, 
              description: 'Eggs, bacon, mushrooms, and mozzarella',
              image: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Granola Bowl', 
              price: 55000, 
              description: 'House-made granola with yogurt and fresh fruits',
              image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80'
            }
          ]
        },
        lunch: {
          name: 'Lunch',
          items: [
            { 
              name: 'Margherita Pizza', 
              price: 80000, 
              description: 'Fresh tomatoes, mozzarella, and basil',
              image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Hummus Plate', 
              price: 70000, 
              description: 'House-made hummus with pita bread',
              image: 'https://images.unsplash.com/photo-1577906096429-f73c2c312435?auto=format&fit=crop&q=80'
            }
          ]
        },
        dinner: {
          name: 'Dinner',
          items: [
            { 
              name: 'Truffle Pizza', 
              price: 95000, 
              description: 'Wild mushrooms, truffle oil, and parmesan',
              image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Mezze Platter', 
              price: 120000, 
              description: 'Selection of Mediterranean appetizers',
              image: 'https://images.unsplash.com/photo-1542345812-d98b5cd6cf98?auto=format&fit=crop&q=80'
            }
          ]
        },
        desserts: {
          name: 'Desserts',
          items: [
            { name: 'Gelato Selection', price: 45000, description: 'Choice of three artisanal gelato flavors', image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80' },
            { name: 'Tiramisu', price: 55000, description: 'Classic Italian dessert with espresso and mascarpone', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80' },
            { name: 'Chocolate Lava Cake', price: 65000, description: 'Warm chocolate cake with vanilla gelato', image: 'https://images.unsplash.com/photo-1617305855058-336d24456869?auto=format&fit=crop&q=80' }
          ]
        }
      },
      drinks: {
        water: {
          name: 'Water',
          items: [
            { 
              name: 'Still Water', 
              price: 15000,
              image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Sparkling Water', 
              price: 25000,
              image: 'https://images.unsplash.com/photo-1598343175492-9e7dc0e63cc6?auto=format&fit=crop&q=80'
            }
          ]
        },
        juice: {
          name: 'Fresh Juices',
          items: [
            { 
              name: 'Orange Juice', 
              price: 35000,
              image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Green Juice', 
              price: 40000,
              image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80'
            }
          ]
        },
        tea: {
          name: 'Tea Selection',
          items: [
            { 
              name: 'Earl Grey', 
              price: 30000,
              image: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Green Tea', 
              price: 30000,
              image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80'
            }
          ]
        },
        coffee: {
          name: 'Coffee',
          items: [
            { 
              name: 'Espresso', 
              price: 25000,
              image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Cappuccino', 
              price: 35000,
              image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80'
            }
          ]
        }
      }
    }
  },
  {
    id: 'alpacafe',
    name: 'Alpacafe',
    description: 'Cozy café serving sweet and savory crepes with specialty coffee',
    fullDescription: 'A charming café where French-inspired crepes meet Indonesian hospitality. Our specialty coffee is sourced from local farmers and roasted in-house.',
    image: 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?auto=format&fit=crop&q=80',
    icon: Coffee,
    bestSeller: { name: 'Nutella Crepe', price: 60000, image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80' },
    menu: {
      food: {
        breakfast: {
          name: 'Breakfast',
          items: [
            { 
              name: 'Breakfast Crepe', 
              price: 65000, 
              description: 'Eggs, cheese, and ham',
              image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Granola Bowl', 
              price: 50000, 
              description: 'With fresh fruits and honey',
              image: 'https://images.unsplash.com/photo-1525373612132-b3e820b87cea?auto=format&fit=crop&q=80'
            }
          ]
        },
        lunch: {
          name: 'Lunch',
          items: [
            { 
              name: 'Savory Crepe', 
              price: 70000, 
              description: 'Mushroom, spinach, and cheese',
              image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Quiche of the Day', 
              price: 65000, 
              description: 'Served with side salad',
              image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80'
            }
          ]
        },
        dinner: {
          name: 'Dinner',
          items: [
            { 
              name: 'Galette Complete', 
              price: 75000, 
              description: 'Buckwheat crepe with egg, ham, and cheese',
              image: 'https://images.unsplash.com/photo-1608039830616-86e774965b26?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Ratatouille Crepe', 
              price: 70000, 
              description: 'Mediterranean vegetables',
              image: 'https://images.unsplash.com/photo-1608039832281-ea9df349b5db?auto=format&fit=crop&q=80'
            }
          ]
        },
        desserts: {
          name: 'Desserts',
          items: [
            { name: 'Ice Cream Crepe', price: 55000, description: 'Crepe with vanilla ice cream and chocolate sauce', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80' },
            { name: 'Affogato', price: 45000, description: 'Vanilla ice cream with hot espresso', image: 'https://images.unsplash.com/photo-1594261956806-3ad03785c9b4?auto=format&fit=crop&q=80' },
            { name: 'Berry Parfait', price: 50000, description: 'Layered ice cream with fresh berries', image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?auto=format&fit=crop&q=80' }
          ]
        }
      },
      drinks: {
        water: {
          name: 'Water',
          items: [
            { 
              name: 'Mineral Water', 
              price: 15000,
              image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Sparkling Water', 
              price: 25000,
              image: 'https://images.unsplash.com/photo-1605188229570-c67429d3eb49?auto=format&fit=crop&q=80'
            }
          ]
        },
        juice: {
          name: 'Fresh Juices',
          items: [
            { 
              name: 'Orange Juice', 
              price: 35000,
              image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Mixed Berry Smoothie', 
              price: 45000,
              image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80'
            }
          ]
        },
        tea: {
          name: 'Tea Selection',
          items: [
            { 
              name: 'English Breakfast', 
              price: 30000,
              image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Chamomile', 
              price: 30000,
              image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&q=80'
            }
          ]
        },
        coffee: {
          name: 'Coffee',
          items: [
            { 
              name: 'Vietnamese Coffee', 
              price: 50000,
              image: 'https://images.unsplash.com/photo-1632789395770-20e6f63be806?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Cafe Latte', 
              price: 45000,
              image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80'
            }
          ]
        }
      }
    }
  },
  {
    id: 'lumeira-kitchen',
    name: 'Lumeira Kitchen',
    description: 'Plant-based cuisine celebrating local ingredients and mindful eating',
    fullDescription: 'A wellness-focused restaurant offering nourishing plant-based dishes made with locally sourced ingredients. Our menu changes seasonally to reflect nature\'s bounty.',
    image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&q=80',
    icon: Salad,
    bestSeller: { name: 'Buddha Bowl', price: 85000, image: 'https://images.unsplash.com/photo-1546007600-8c2e5a9b8ea3?auto=format&fit=crop&q=80' },
    menu: {
      food: {
        breakfast: {
          name: 'Breakfast',
          items: [
            { 
              name: 'Acai Bowl', 
              price: 75000, 
              description: 'Organic acai blend topped with granola and fresh fruits',
              image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Avocado Toast', 
              price: 65000, 
              description: 'Sourdough bread with smashed avocado and microgreens',
              image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?auto=format&fit=crop&q=80'
            }
          ]
        },
        lunch: {
          name: 'Lunch',
          items: [
            { 
              name: 'Buddha Bowl', 
              price: 85000, 
              description: 'Quinoa, roasted vegetables, tempeh, and tahini dressing',
              image: 'https://images.unsplash.com/photo-1546007600-8c2e5a9b8ea3?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Rainbow Pad Thai', 
              price: 80000, 
              description: 'Zucchini noodles with colorful vegetables and peanut sauce',
              image: 'https://images.unsplash.com/photo-1637225701929-37d84066115f?auto=format&fit=crop&q=80'
            }
          ]
        },
        dinner: {
          name: 'Dinner',
          items: [
            { 
              name: 'Mushroom Risotto', 
              price: 90000, 
              description: 'Creamy arborio rice with wild mushrooms and truffle oil',
              image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Cauliflower Steak', 
              price: 85000, 
              description: 'Roasted cauliflower with chimichurri sauce',
              image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80'
            }
          ]
        },
        desserts: {
          name: 'Desserts',
          items: [
            { 
              name: 'Raw Chocolate Cake', 
              price: 60000, 
              description: 'Made with dates, nuts, and raw cacao',
              image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Coconut Chia Pudding', 
              price: 55000, 
              description: 'With mango and passion fruit',
              image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?auto=format&fit=crop&q=80'
            }
          ]
        }
      },
      drinks: {
        water: {
          name: 'Water',
          items: [
            { 
              name: 'Alkaline Water', 
              price: 20000,
              image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Coconut Water', 
              price: 35000,
              image: 'https://images.unsplash.com/photo-1628619876503-2db74e724757?auto=format&fit=crop&q=80'
            }
          ]
        },
        juice: {
          name: 'Fresh Juices',
          items: [
            { 
              name: 'Green Goddess', 
              price: 45000,
              description: 'Kale, cucumber, apple, and ginger',
              image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Immunity Booster', 
              price: 45000,
              description: 'Carrot, orange, turmeric, and lemon',
              image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80'
            }
          ]
        },
        tea: {
          name: 'Herbal Teas',
          items: [
            { 
              name: 'Blue Butterfly Pea', 
              price: 35000,
              image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Turmeric Latte', 
              price: 40000,
              image: 'https://images.unsplash.com/photo-1578927634052-6c293992cbaa?auto=format&fit=crop&q=80'
            }
          ]
        },
        coffee: {
          name: 'Plant-Based Coffee',
          items: [
            { 
              name: 'Oat Milk Latte', 
              price: 45000,
              image: 'https://images.unsplash.com/photo-1589985902809-39d25db22101?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Mushroom Coffee', 
              price: 50000,
              image: 'https://images.unsplash.com/photo-1568649929103-28ffbefaca1e?auto=format&fit=crop&q=80'
            }
          ]
        }
      }
    }
  },
  {
    id: 'oshom-bistro',
    name: 'Oshom Bistro',
    description: 'Modern Indonesian cuisine with a contemporary twist',
    fullDescription: 'Experience traditional Indonesian flavors reimagined through modern culinary techniques. Our menu celebrates local ingredients while pushing creative boundaries.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    icon: Soup,
    bestSeller: { name: 'Rendang Bowl', price: 95000, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80' },
    menu: {
      food: {
        breakfast: {
          name: 'Breakfast',
          items: [
            { 
              name: 'Nasi Goreng Bowl', 
              price: 65000, 
              description: 'Traditional fried rice with organic vegetables and free-range egg',
              image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Bubur Ayam Modern', 
              price: 60000, 
              description: 'Rice porridge with pulled chicken and crispy shallots',
              image: 'https://images.unsplash.com/photo-1626123552399-8b3479ea00f2?auto=format&fit=crop&q=80'
            }
          ]
        },
        lunch: {
          name: 'Lunch',
          items: [
            { 
              name: 'Rendang Bowl', 
              price: 95000, 
              description: 'Slow-cooked beef rendang with red rice and vegetables',
              image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Gado-Gado Modern', 
              price: 75000, 
              description: 'Mixed vegetables with peanut dressing and tempeh chips',
              image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80'
            }
          ]
        },
        dinner: {
          name: 'Dinner',
          items: [
            { 
              name: 'Sate Lilit Platter', 
              price: 110000, 
              description: 'Balinese fish satay with sambal matah',
              image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Bebek Goreng', 
              price: 125000, 
              description: 'Crispy duck with Balinese spices and sambal',
              image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80'
            }
          ]
        },
        desserts: {
          name: 'Desserts',
          items: [
            { 
              name: 'Es Teler Modern', 
              price: 45000, 
              description: 'Traditional mixed ice dessert with coconut and avocado',
              image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Klepon Cake', 
              price: 50000, 
              description: 'Pandan cake with palm sugar and coconut',
              image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80'
            }
          ]
        }
      },
      drinks: {
        water: {
          name: 'Water',
          items: [
            { 
              name: 'Mountain Spring Water', 
              price: 15000,
              image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Sparkling Water', 
              price: 25000,
              image: 'https://images.unsplash.com/photo-1605188229570-c67429d3eb49?auto=format&fit=crop&q=80'
            }
          ]
        },
        juice: {
          name: 'Traditional Drinks',
          items: [
            { 
              name: 'Jamu Kunyit Asam', 
              price: 35000,
              description: 'Traditional turmeric and tamarind tonic',
              image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Es Cincau', 
              price: 30000,
              description: 'Grass jelly drink with coconut milk',
              image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80'
            }
          ]
        },
        tea: {
          name: 'Indonesian Teas',
          items: [
            { 
              name: 'Teh Talua', 
              price: 35000,
              description: 'Traditional egg tea from West Sumatra',
              image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Es Teh Serai', 
              price: 30000,
              description: 'Lemongrass iced tea',
              image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&q=80'
            }
          ]
        },
        coffee: {
          name: 'Indonesian Coffee',
          items: [
            { 
              name: 'Kopi Tubruk', 
              price: 30000,
              description: 'Traditional Indonesian black coffee',
              image: 'https://images.unsplash.com/photo-1632789395770-20e6f63be806?auto=format&fit=crop&q=80'
            },
            { 
              name: 'Es Kopi Susu', 
              price: 35000,
              description: 'Indonesian iced milk coffee',
              image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80'
            }
          ]
        }
      }
    }
  }
];

export function FoodPage() {
  const navigate = useNavigate();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'food' | 'drinks' | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    deliveryOption: 'dine-in'
  });
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      food: {
        ...item,
        venue: selectedVenue?.name,
        orderDetails
      }
    });
  };

  const getDeliveryIcon = (option: DeliveryOption) => {
    switch (option) {
      case 'dine-in':
        return <Clock className="w-5 h-5" />;
      case 'takeaway':
        return <MapPin className="w-5 h-5" />;
      case 'delivery':
        return <Truck className="w-5 h-5" />;
    }
  };

  if (selectedVenue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => {
            setSelectedVenue(null);
            setSelectedCategory(null);
            setSelectedSubCategory(null);
          }}
          className="mb-8 flex items-center text-nuanu hover:text-nuanu-light font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Venues
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96 relative">
            <img
              src={selectedVenue.image}
              alt={selectedVenue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h1 className="text-4xl font-bold mb-2">{selectedVenue.name}</h1>
                <p className="text-lg">{selectedVenue.fullDescription}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  setSelectedCategory('food');
                  setSelectedSubCategory(null);
                }}
                className={`px-6 py-3 rounded-lg transition-all ${
                  selectedCategory === 'food'
                    ? 'bg-nuanu text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Food Menu
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('drinks');
                  setSelectedSubCategory(null);
                }}
                className={`px-6 py-3 rounded-lg transition-all ${
                  selectedCategory === 'drinks'
                    ? 'bg-nuanu text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Drinks Menu
              </button>
            </div>

            {selectedCategory && !selectedSubCategory && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {Object.entries(selectedVenue.menu[selectedCategory]).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSubCategory(key)}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-center"
                  >
                    <div className="flex justify-center mb-2">
                      {key === 'desserts' ? (
                        <IceCream className="w-6 h-6 text-nuanu" />
                      ) : key === 'coffee' ? (
                        <Coffee className="w-6 h-6 text-nuanu" />
                      ) : key === 'juice' ? (
                        <Wine className="w-6 h-6 text-nuanu" />
                      ) : key === 'breakfast' ? (
                        <Coffee className="w-6 h-6 text-nuanu" />
                      ) : key === 'lunch' || key === 'dinner' ? (
                        <Pizza className="w-6 h-6 text-nuanu" />
                      ) : (
                        <Salad className="w-6 h-6 text-nuanu" />
                      )}
                    </div>
                    <h3 className="font-medium text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.items.length} items</p>
                  </button>
                ))}
              </div>
            )}

            {selectedCategory && selectedSubCategory && (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedSubCategory(null)}
                  className="text-nuanu hover:text-nuanu-light font-medium flex items-center"
                >
                  <ArrowLeft className="w-5 h-5 mr-1" />
                  Back to {selectedCategory === 'food' ? 'Food' : 'Drinks'} Categories
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedVenue.menu[selectedCategory][selectedSubCategory].items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      {item.image && (
                        <div className="h-48 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h4 className="font-medium text-lg mb-1">{item.name}</h4>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-nuanu font-medium">{formatPrice(item.price)}</span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="p-2 bg-nuanu text-white rounded-full hover:bg-nuanu-light transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Options */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Order Options</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setOrderDetails({ ...orderDetails, deliveryOption: 'dine-in' })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      orderDetails.deliveryOption === 'dine-in'
                        ? 'border-nuanu bg-nuanu/5'
                        : 'border-gray-200 hover:border-nuanu/30'
                    }`}
                  >
                    <Clock className="w-6 h-6 mb-2 mx-auto" />
                    <div className="text-center">
                      <p className="font-medium">Dine In</p>
                      <p className="text-sm text-gray-600">I'll come at scheduled time</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOrderDetails({ ...orderDetails, deliveryOption: 'takeaway' })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      orderDetails.deliveryOption === 'takeaway'
                        ? 'border-nuanu bg-nuanu/5'
                        : 'border-gray-200 hover:border-nuanu/30'
                    }`}
                  >
                    <MapPin className="w-6 h-6 mb-2 mx-auto" />
                    <div className="text-center">
                      <p className="font-medium">Take Away</p>
                      <p className="text-sm text-gray-600">I'll pick up my order</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setOrderDetails({ ...orderDetails, deliveryOption: 'delivery' })}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      orderDetails.deliveryOption === 'delivery'
                        ? 'border-nuanu bg-nuanu/5'
                        : 'border-gray-200 hover:border-nuanu/30'
                    }`}
                  >
                    <Truck className="w-6 h-6 mb-2 mx-auto" />
                    <div className="text-center">
                      <p className="font-medium">Delivery</p>
                      <p className="text-sm text-gray-600">Deliver to my location</p>
                    </div>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scheduled Time
                  </label>
                  <input
                    type="datetime-local"
                    value={orderDetails.scheduledTime || ''}
                    onChange={(e) => setOrderDetails({ ...orderDetails, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={orderDetails.notes || ''}
                    onChange={(e) => setOrderDetails({ ...orderDetails, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    placeholder="Any special requests?"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 flex items-center text-nuanu hover:text-nuanu-light font-medium"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to Home
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Nuanu Delicious</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {venues.map((venue) => {
          const Icon = venue.icon;
          return (
            <button
              key={venue.id}
              onClick={() => setSelectedVenue(venue)}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow text-left"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={venue.bestSeller.image || venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-nuanu/10 rounded-lg">
                    <Icon className="w-8 h-8 text-nuanu" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{venue.name}</h3>
                    <p className="text-nuanu font-medium">
                      {formatPrice(venue.bestSeller.price)}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">{venue.description}</p>
                <button
                  onClick={() => setSelectedVenue(venue)}
                  className="w-full py-3 bg-nuanu text-white rounded-lg hover:bg-nuanu-light transition-colors"
                >
                  View Menu
                </button>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}