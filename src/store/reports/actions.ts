import { ActionTypes } from '../ActionTypes';
import { createAction } from '@reduxjs/toolkit';

export const undo = createAction(ActionTypes.reportsUndo);
export const redo = createAction(ActionTypes.reportsRedo);
export const clearHistory = createAction(ActionTypes.reportsCrearHistory);
