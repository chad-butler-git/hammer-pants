import PropTypes from 'prop-types';

function AisleRouteCard({ step, index, onComplete }) {
  return (
    <div className={`p-4 border-l-4 ${step.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">
            Step {index + 1}: {step.aisle}
          </h3>
          <p className="text-gray-600">{step.items.length} items</p>
        </div>
        <button
          onClick={() => onComplete(step.id)}
          className={`px-3 py-1 rounded ${
            step.completed
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
          disabled={step.completed}
        >
          {step.completed ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
      
      <div className="mt-3">
        <h4 className="font-medium mb-2">Items:</h4>
        <ul className="list-disc list-inside space-y-1">
          {step.items.map(item => (
            <li key={item.id} className={step.completed ? 'line-through text-gray-500' : ''}>
              {item.name}
              {item.notes && (
                <span className="text-sm text-gray-500 ml-2">({item.notes})</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

AisleRouteCard.propTypes = {
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    aisle: PropTypes.string.isRequired,
    completed: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        notes: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default AisleRouteCard;