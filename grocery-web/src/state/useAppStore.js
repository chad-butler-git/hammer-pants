import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import * as itemsApi from '../api/items';
import * as storesApi from '../api/stores';
import * as listsApi from '../api/lists';
import * as routeApi from '../api/route';
import { toast } from 'react-toastify';

const useAppStore = create(
  persist(
    immer((set, get) => ({
      // State
      items: [],
      stores: [],
      selectedStore: null,
      currentList: null,
      currentRoute: null,
      isLoading: false,
      error: null,
      shareUrl: null,

      // Actions
      setLoading: (isLoading) => set((state) => { state.isLoading = isLoading; }),
      setError: (error) => set((state) => { state.error = error; }),
      clearError: () => set((state) => { state.error = null; }),

      // Items actions
      fetchItems: async () => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          const items = await itemsApi.fetchItems();
          set((state) => { state.items = items; });
          return items;
        } catch (error) {
          setError(error);
          return [];
        } finally {
          setLoading(false);
        }
      },

      createItem: async (itemData) => {
        const { setLoading, setError, fetchItems } = get();
        try {
          setLoading(true);
          await itemsApi.createItem(itemData);
          return fetchItems();
        } catch (error) {
          setError(error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      // Stores actions
      fetchStores: async () => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          const stores = await storesApi.fetchStores();
          set((state) => { state.stores = stores; });
          return stores;
        } catch (error) {
          setError(error);
          return [];
        } finally {
          setLoading(false);
        }
      },

      addStore: (store) => {
        set((state) => {
          state.stores.push(store);
          state.selectedStore = store;
        });
        return store;
      },

      selectStore: (storeId) => {
        const { stores } = get();
        const selectedStore = stores.find((store) => store.id === storeId);
        set((state) => { state.selectedStore = selectedStore || null; });
        return selectedStore;
      },

      createStore: async (storeData) => {
        const { setLoading, setError, addStore } = get();
        try {
          setLoading(true);
          const newStore = await storesApi.createStore(storeData);
          addStore(newStore);
          return newStore;
        } catch (error) {
          setError(error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      // Shopping list actions
      fetchCurrentList: async (listId) => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          const list = await listsApi.fetchListById(listId);
          set((state) => { state.currentList = list; });
          return list;
        } catch (error) {
          setError(error);
          return null;
        } finally {
          setLoading(false);
        }
      },

      createShoppingList: async (listData) => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          const newList = await listsApi.createList(listData);
          set((state) => { state.currentList = newList; });
          return newList;
        } catch (error) {
          setError(error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      addItemToList: async (itemId) => {
        const { setLoading, setError, currentList, fetchCurrentList } = get();
        if (!currentList) return false;
        
        try {
          setLoading(true);
          await listsApi.addItemToList(currentList.id, itemId);
          return fetchCurrentList(currentList.id);
        } catch (error) {
          setError(error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      removeItemFromList: async (itemId) => {
        const { setLoading, setError, currentList, fetchCurrentList } = get();
        if (!currentList) return false;
        
        try {
          setLoading(true);
          await listsApi.removeItemFromList(currentList.id, itemId);
          return fetchCurrentList(currentList.id);
        } catch (error) {
          setError(error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      clearList: async () => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          set((state) => { state.currentList = null; });
          return true;
        } catch (error) {
          setError(error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      // Share list actions
      shareList: async () => {
        const { setLoading, setError, currentList } = get();
        if (!currentList) {
          setError('No shopping list selected to share');
          return null;
        }
        
        try {
          setLoading(true);
          const shareData = await listsApi.shareList(currentList.id);
          set((state) => { state.shareUrl = shareData.shareUrl; });
          
          // Copy to clipboard
          navigator.clipboard.writeText(shareData.shareUrl)
            .then(() => toast.success('Share link copied to clipboard!'))
            .catch(() => toast.info('Share link generated but could not copy to clipboard'));
            
          return shareData;
        } catch (error) {
          setError(error);
          return null;
        } finally {
          setLoading(false);
        }
      },
      
      clearShareUrl: () => {
        set((state) => { state.shareUrl = null; });
      },
      
      getSharedList: async (token) => {
        const { setLoading, setError } = get();
        try {
          setLoading(true);
          const sharedData = await listsApi.getSharedList(token);
          return sharedData;
        } catch (error) {
          setError(error);
          return null;
        } finally {
          setLoading(false);
        }
      },

      // Route actions
      fetchRoute: async (plannerType) => {
        const { setLoading, setError, selectedStore, currentList } = get();
        if (!selectedStore || !currentList) {
          setError('Store and shopping list must be selected to generate a route');
          return null;
        }
        
        try {
          setLoading(true);
          const routeParams = {
            storeId: selectedStore.id,
            listId: currentList.id,
          };
          
          if (plannerType) {
            routeParams.plannerType = plannerType;
          }
          
          const route = await routeApi.fetchRoute(routeParams);
          set((state) => { state.currentRoute = route; });
          return route;
        } catch (error) {
          setError(error);
          return null;
        } finally {
          setLoading(false);
        }
      },

      completeRouteStep: async (stepId) => {
        const { setLoading, setError, currentRoute } = get();
        if (!currentRoute) return false;
        
        try {
          setLoading(true);
          const updatedRoute = await routeApi.completeRouteStep(currentRoute.id, stepId);
          set((state) => { state.currentRoute = updatedRoute; });
          return updatedRoute;
        } catch (error) {
          setError(error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      resetRoute: async () => {
        const { setLoading, setError, currentRoute } = get();
        if (!currentRoute) return false;
        
        try {
          setLoading(true);
          const resetRoute = await routeApi.resetRoute(currentRoute.id);
          set((state) => { state.currentRoute = resetRoute; });
          return resetRoute;
        } catch (error) {
          setError(error);
          return false;
        } finally {
          setLoading(false);
        }
      },

      // Reset store
      resetStore: () => set((state) => {
        state.selectedStore = null;
        state.currentList = null;
        state.currentRoute = null;
        state.shareUrl = null;
      }),
    })),
    {
      name: 'grocery-app-storage',
      partialize: (state) => ({
        selectedStore: state.selectedStore,
        currentList: state.currentList,
        shareUrl: state.shareUrl,
      }),
    }
  )
);

export default useAppStore;