const initialState = {
  devices: [],
  alexaDevices: [],
  googleDevices: [],
  updatedDevice: null,
};

const devices = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_DEVICES':
          return {
              ...state,
              devices: action.devices,
          };

        case 'LOAD_ALEXA_DEVICES':
          return {
              ...state,
              alexaDevices: action.devices,
          };

        case 'LOAD_GOOGLE_DEVICES':
          return {
              ...state,
              googleDevices: action.devices,
          };

        case 'UPDATE_DEVICE':
          return {
              ...state,
              updatedDevice: action.updatedDevice,
          };

        default:
            return state
    }
}

export default devices
