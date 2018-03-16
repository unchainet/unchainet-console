import {
  ADD_WORKLOAD,
  REMOVE_WORKLOAD
} from 'constants/ActionTypes';

const INIT_STATE = {
    state: 'loaded',
    providers: [
        {
          id: '1',
          name: 'Provider ABC',
          region: '1',
          location: {lat: -33.8980122, lng: 151.1802367}
        },
        {
          id: '2',
          name: 'Provider 123',
          region: '1',
          location: {lat: -33.879083, lng: 151.1954023}
        }
      ],
    regions: [
        {
          id:'1',
          name: 'Australia',
          zoom: 4,
          location: {lat: -23.268353, lng: 134.185811}
        },
        {
          id:'2',
          name: 'China',
          zoom: 5,
          location: {lat: 23.1253503, lng: 112.9476547}
        }
    ],
    list: [
      {
        id: "1",
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
        region: '1',
        auctionedPricing: 2,
        eventualAvailability: 4,
        guaranteedAvailability: 0,
        price: 10,
        priceType: "eventualAvailability",
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
