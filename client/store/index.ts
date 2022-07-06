import create from "zustand";

interface State {
  bears: number;
}

const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state: State) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

export default useStore;
