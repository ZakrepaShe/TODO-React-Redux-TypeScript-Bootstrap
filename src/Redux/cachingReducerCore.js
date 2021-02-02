import { handleActions } from 'redux-actions';

export const idX = x => x;

export const keep = (res, key, value) => ({...res, [key]: value});
export const mapObject = (predicate, modifier, defModifier = keep) => obj => Object.entries(
  obj || {},
)
  .reduce((res, [key, value]) => (predicate(key, value)
    ? modifier(res, key, value)
    : defModifier(res, key, value)), {});
export const mapAllKeys = modifier => obj => mapObject(idX, modifier)(obj);
export const mapAllValues = modifier => obj => mapAllKeys(
  (res, key, value) => ({...res, [key]: modifier(value)}),
)(obj);

export const conditionallyAddProps = (condition, entries) => (condition ? entries : {});

export const innerInitialState = {
  byId: {},
  updatedAt: 0,
  slateId: null,
  pagination: null,
};

const mergeById = (state, byId) => ({
  ...state.byId,
  ...byId,
});

const replaceById = (state, byId) => byId;

const getCommonParameters = (state, {payload}) => {
  const updatedAt = Date.now();
  const entities = payload.hasPagination
    ? payload.entities
    : payload;
  const byId = mapAllValues(entity => ({updatedAt, entity}))(entities);
  const pagination = payload.hasPagination
    ? payload.pagination
    : state.pagination;
  return ({updatedAt, byId, pagination});
};

const commonListHandler = mergeFn => (state, {payload}) => {
  const {updatedAt, byId, pagination} = getCommonParameters(state, {payload});

  return {
    ...state,
    byId: mergeFn(state, byId),
    updatedAt,
    pagination,
  };
};

const setList = commonListHandler(replaceById);

const addEntities = commonListHandler(mergeById);

const setEntity = isNewFirst => (state, {payload}) => ({
  ...state,
  byId: {
    ...conditionallyAddProps(!isNewFirst, state.byId),
    [payload.id]: {entity: payload, updatedAt: Date.now()},
    ...conditionallyAddProps(isNewFirst, state.byId),
  },
});

const setEntityDefault = setEntity(false);
const setEntityReversed = setEntity(true);

const updateEntity = (state, {payload}) => ({
  ...state,
  byId: {
    ...state.byId,
    [payload.id]: {
      entity: {
        ...state.byId[payload.id].entity,
        ...payload,
      },
      updatedAt: Date.now(),
    },
  },
});

const removeEntity = (state, {payload}) => ({
  ...state,
  byId: {
    ...state.byId,
    [payload]: null,
  },
});

const removeEntities = (state, {payload}) => ({
  ...state,
  byId: payload.reduce((res, {id}) => ({
    ...res,
    [id]: null,
  }), state.byId),
});

const bulkUpdate = (state, {payload}) => ({
  ...state,
  byId: payload.reduce((res, {id, ...rest}) => ({
    ...res,
    [id]: {
      ...state.byId[id],
      entity: {
        ...state.byId[id].entity,
        ...rest,
      },
    },
  }), state.byId),
});

const clearList = state => ({
  ...state,
  byId: {},
  updatedAt: 0,
  pagination: null,
});

export const createCachingReducer = (actionNames, actions, initialState = {}) => {
  const {
    SET_LIST,
    SET_ENTITY,
    SET_ENTITY_REVERSED,
    REMOVE_ENTITY,
    REMOVE_ENTITIES,
    BULK_UPDATE,
    CLEAR_LIST,
    ADD_ENTITIES,
    UPDATE_ENTITY,
    SET_SLATE_ID,
  } = actionNames;

  return handleActions({
    ...actions,
    [SET_LIST]: setList,
    [ADD_ENTITIES]: addEntities,
    [SET_ENTITY]: setEntityDefault,
    [SET_ENTITY_REVERSED]: setEntityReversed,
    [UPDATE_ENTITY]: updateEntity,
    [REMOVE_ENTITY]: removeEntity,
    [REMOVE_ENTITIES]: removeEntities,
    [BULK_UPDATE]: bulkUpdate,
    [CLEAR_LIST]: clearList,
    [SET_SLATE_ID]: (state, {payload: {slateId}}) => (
      slateId !== state.slateId
        ? {...initialState, ...innerInitialState, slateId}
        : state
    ),
  }, {...initialState, ...innerInitialState});
};













export const createTypedCachingReducer = (actionNames, actionsFunc) => {
  const {
    SET_LIST,
    SET_ENTITY,
    SET_ENTITY_REVERSED,
    REMOVE_ENTITY,
    REMOVE_ENTITIES,
    BULK_UPDATE,
    CLEAR_LIST,
    ADD_ENTITIES,
    UPDATE_ENTITY,
    SET_SLATE_ID,
  } = actionNames;

  const handleDefault = (state, action) => {
    switch (action.type) {
      case [SET_LIST]:
        return setList(state, action);
      case [ADD_ENTITIES]:
        return addEntities(state, action);
      case [SET_ENTITY]:
        return setEntityDefault(state, action);
      case [SET_ENTITY_REVERSED]:
        return setEntityReversed(state, action);
      case [UPDATE_ENTITY]:
        return updateEntity(state, action);
      case [REMOVE_ENTITY]:
        return removeEntity(state, action);
      case [REMOVE_ENTITIES]:
        return removeEntities(state, action);
      case [BULK_UPDATE]:
        return bulkUpdate(state, action);
      case [CLEAR_LIST]:
        return clearList(state, action);
      case [SET_SLATE_ID]:
        return (
          action.payload.slateId !== state.slateId
            ? { ...state, slateId: action.payload.slateId }
            : state
        );
      default:
        return state;
    }

  };

  return actionsFunc(handleDefault);
};
