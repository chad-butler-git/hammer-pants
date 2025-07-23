const { getPlanner } = require('../../src/planners');
const LinearAislePlanner = require('../../src/planners/LinearAislePlanner');

describe('Planner Factory', () => {
  describe('getPlanner function', () => {
    it('should return a LinearAislePlanner instance when type is "linear"', () => {
      const planner = getPlanner('linear');
      expect(planner).toBeInstanceOf(LinearAislePlanner);
    });
    
    it('should return a LinearAislePlanner instance when no type is provided (default)', () => {
      const planner = getPlanner();
      expect(planner).toBeInstanceOf(LinearAislePlanner);
    });
    
    it('should throw an error when an unknown planner type is requested', () => {
      expect(() => {
        getPlanner('nonexistent');
      }).toThrow('Unknown planner type: nonexistent');
    });
  });
});