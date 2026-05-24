const Enzyme = require('enzyme');
const Adapter = require('@cfaester/enzyme-adapter-react-18').default;

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
Enzyme.configure({ adapter: new Adapter() });
