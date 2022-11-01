const DB_URL = 'mongodb://localhost:27017/moviesdb';
const SECRET_KEY = 'some-secret-key';

const BAD_REQUEST_ERROR_MESSAGE = 'Переданы некорректные данные.';
const CONFLICT_ERROR_MESSAGE = 'Данный email уже существует.';
const FORBIDDEN_ERROR_MESSAGE = 'Доступ запрещен.';
const USER_NOT_FOUND_ERROR_MESSAGE = 'Пользователь не найден.';
const MOVIE_NOT_FOUND_ERROR_MESSAGE = 'Фильм не найден.';
const PAGE_NOT_FOUND_ERROR_MESSAGE = 'Страница не найдена';
const UNAUTHORIZED_ERROR_MESSAGE = 'Необходима авторизация.';
const INTERNAL_SERVER_ERROR_MESSAGE = 'На сервере произошла ошибка';
const INVALID_DATA_ERROR_MESSAGE = 'Неправильные почта или пароль';

module.exports = {
  DB_URL,
  SECRET_KEY,
  BAD_REQUEST_ERROR_MESSAGE,
  CONFLICT_ERROR_MESSAGE,
  FORBIDDEN_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
  MOVIE_NOT_FOUND_ERROR_MESSAGE,
  PAGE_NOT_FOUND_ERROR_MESSAGE,
  UNAUTHORIZED_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  INVALID_DATA_ERROR_MESSAGE,
};
