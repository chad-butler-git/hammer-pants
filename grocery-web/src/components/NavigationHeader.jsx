import { Link, useLocation } from 'react-router-dom';
import useAppStore from '../state/useAppStore';

function NavigationHeader() {
  const location = useLocation();
  const { selectedStore, currentList } = useAppStore();
  
  // Define the breadcrumb paths
  const paths = [
    { path: '/', label: 'Home' },
    { path: '/list', label: 'Shopping List' },
    { path: '/route', label: 'Shopping Route' },
    { path: '/onboard', label: 'Add Store' },
  ];
  
  // Find the current path in the paths array
  const currentPath = paths.find(p => p.path === location.pathname);
  
  // Generate breadcrumbs based on the current path
  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    // Always include Home
    breadcrumbs.push(paths[0]);
    
    if (location.pathname === '/list' || location.pathname === '/route') {
      breadcrumbs.push(paths[1]);
    }
    
    if (location.pathname === '/route') {
      breadcrumbs.push(paths[2]);
    }
    
    if (location.pathname === '/onboard') {
      breadcrumbs.push(paths[3]);
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-blue-600">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="text-gray-600 hover:text-blue-600">
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-sm">
            {selectedStore && (
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Store:</span>
                <span className="font-medium">{selectedStore.name}</span>
                
                {currentList && (
                  <>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-gray-600 mr-2">Items:</span>
                    <span className="font-medium">{currentList.items?.length || 0}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationHeader;