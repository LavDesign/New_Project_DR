import { v4 as uuidv4 } from 'uuid';

let StateId = '';

export const generateStateId = () => {
    StateId = uuidv4();
};

export const getStateId = () => StateId;
