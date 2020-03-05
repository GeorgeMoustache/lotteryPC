import { gameBoyApi } from 'api';

const TYPE = {
  CHESS_GAMES_REQUEST: 'CHESS_GAMES_REQUEST',
  CHESS_GAMES_SUCCESS: 'CHESS_GAMES_SUCCESS',
  CHESS_GAMES_FAILURE: 'CHESS_GAMES_FAILURE',
};

const state = {
  chessGames: [],
};

const getters = {
  chessGames: state => state.chessGames,
};

const actions = {
  chessGames({ commit, state, rootState }) {
    rootState.requesting = true;
    commit(TYPE.CHESS_GAMES_REQUEST);
    return gameBoyApi.gameList().then(
      data => {
        rootState.requesting = false;
        commit(TYPE.CHESS_GAMES_SUCCESS, data);
        return data;
      },
      error => {
        rootState.requesting = false;
        commit(TYPE.CHESS_GAMES_FAILURE);
      }
    );
  },
};

const mutations = {
  [TYPE.CHESS_GAMES_REQUEST](state) {},
  [TYPE.CHESS_GAMES_SUCCESS](state, chessGames) {
    state.chessGames = chessGames.games;
  },
  [TYPE.CHESS_GAMES_FAILURE](state) {},
};

export default {
  state,
  getters,
  actions,
  mutations,
};
