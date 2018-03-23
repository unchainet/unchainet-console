import {
  ADD_WORKLOAD,
  REMOVE_WORKLOAD
} from 'constants/ActionTypes';

const INIT_STATE = {
    state: 'loaded',
    list: [
      {
        _id: '5ab09de29f0981d245659569',
        name: 'Sydney S1',
        cpuCores: 4,
        ram: 16,
        storage: 120,
        gpu: 'none',
        containerType: 'Kubernetes',
        dockerConfig: {
          imageName:'',
          repositoryUrl:''
        },
        kubernetesConfig: {
          script: 'some script'
        },
        provider: '1',
        region: '5ab09de29f0981d245659565',
        auctionedPricing: 2,
        eventualAvailability: 4,
        guaranteedAvailability: 0,
        price: 10,
        priceType: 'eventualAvailability',
        status: 'running'
      }
    ]
};


export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ADD_WORKLOAD: {
            let items = state.list.slice();
            if (!action.item.id) {
                action.item.id = new Date().getTime();
                items.push(action.item);
            } else {
                items.forEach(row => {
                    if (row.id === action.item.id) {
                        Object.assign(row, action.item);
                    }
                });
            }
            return {
                ...state,
                list: items
            }
        }
        case REMOVE_WORKLOAD: {
            let items = state.list.filter(row => row.id !== action.id);
            return {
                ...state,
                list: items
            }
        }
        default:
            return state;
    }
}
