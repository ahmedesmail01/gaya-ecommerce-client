import { State } from './state';

describe('State', () => {
  it('should describe a state from the API', () => {
    const state: State = { id: 1, name: 'Acre' };
    expect(state.name).toBe('Acre');
  });
});
