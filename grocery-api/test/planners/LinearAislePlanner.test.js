const LinearAislePlanner = require('../../src/planners/LinearAislePlanner');
const { RouteStep } = require('grocery-shared');

describe('LinearAislePlanner', () => {
  let planner;
  
  beforeEach(() => {
    planner = new LinearAislePlanner();
  });
  
  describe('plan method', () => {
    it('should group items by aisle and sort by aisle number ascending', () => {
      // Mock store with aisles in non-sequential order
      const store = {
        id: 'store1',
        name: 'Test Store',
        address: '123 Test St',
        aisles: [
          { number: 3, categories: ['Dairy'] },
          { number: 1, categories: ['Fruits'] },
          { number: 2, categories: ['Bakery'] }
        ]
      };
      
      // Mock items
      const items = [
        { id: 'item1', name: 'Milk', category: 'Dairy' },
        { id: 'item2', name: 'Apples', category: 'Fruits' },
        { id: 'item3', name: 'Bread', category: 'Bakery' }
      ];
      
      const route = planner.plan(store, items);
      
      // Check that the route is an array of RouteStep objects
      expect(Array.isArray(route)).toBe(true);
      expect(route.length).toBe(3);
      route.forEach(step => {
        expect(step).toBeInstanceOf(RouteStep);
      });
      
      // Check that aisles are sorted numerically
      expect(route[0].aisleNumber).toBe(1);
      expect(route[1].aisleNumber).toBe(2);
      expect(route[2].aisleNumber).toBe(3);
      
      // Check that items are in the correct aisles
      expect(route[0].items[0].category).toBe('Fruits');
      expect(route[1].items[0].category).toBe('Bakery');
      expect(route[2].items[0].category).toBe('Dairy');
    });
    
    it('should handle items with categories not matching any aisle', () => {
      // Mock store with aisles
      const store = {
        id: 'store1',
        name: 'Test Store',
        address: '123 Test St',
        aisles: [
          { number: 1, categories: ['Fruits'] },
          { number: 2, categories: ['Dairy'] }
        ]
      };
      
      // Mock items including one with no matching aisle
      const items = [
        { id: 'item1', name: 'Apples', category: 'Fruits' },
        { id: 'item2', name: 'Milk', category: 'Dairy' },
        { id: 'item3', name: 'Cereal', category: 'Breakfast' }
      ];
      
      const route = planner.plan(store, items);
      
      // Check that uncategorized items are handled properly
      // The LinearAislePlanner implementation should put them in aisle 1
      const uncategorizedItems = route.find(step => 
        step.items.some(item => item.category === 'Breakfast')
      );
      
      expect(uncategorizedItems).toBeDefined();
      expect(uncategorizedItems.aisleNumber).toBe(1);
    });
    
    it('should throw an error if store is invalid', () => {
      expect(() => {
        planner.plan(null, []);
      }).toThrow('Invalid store provided');
      
      expect(() => {
        planner.plan({}, []);
      }).toThrow('Invalid store provided');
    });
    
    it('should throw an error if items is not an array', () => {
      const store = {
        aisles: []
      };
      
      expect(() => {
        planner.plan(store, null);
      }).toThrow('Items must be an array');
      
      expect(() => {
        planner.plan(store, 'not an array');
      }).toThrow('Items must be an array');
    });
  });
});